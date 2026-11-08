import React from 'react';
import Link from 'next/link';
import {
  Box,
  CalendarCheck,
  CalendarClock,
  Check,
  CircleCheck,
  ClipboardList,
  Clock,
  CreditCard,
  FileText,
  Images,
  MessageSquare,
  Package,
  PackageCheck,
  Ruler,
  Scissors,
  Shirt,
  TrendingUp,
} from 'lucide-react';
import { Order, OrderStatusHistory } from '@/types/order';
import { StoreProfile } from '@/types/store';
import { PageContainer } from '@/components/layout/page-header';
import { buttonClasses } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CopyButton } from '@/components/ui/copy-button';
import { formatDate, formatDateTime, formatRupiah, toNumber } from '@/lib/format';
import { formatImageUrl } from '@/lib/image';
import {
  ORDER_STATUS_META,
  ORDER_TYPE_LABEL,
  RENTAL_STATUS_META,
  orderTitle,
  parseOrderMeta,
  totalQuantity,
} from '@/lib/order-status';
import { PaymentCard } from '../components/payment-card';

const ORDER_FLOW_STAGES = [
  { title: 'Pesanan Diterima', icon: ClipboardList },
  { title: 'Dikonfirmasi Admin', icon: CircleCheck },
  { title: 'Pembayaran DP', icon: CreditCard },
  { title: 'Proses Pembuatan', icon: Scissors },
  { title: 'Siap Diambil / Dikirim', icon: PackageCheck },
];

export function OrderTrackingView({
  order,
  history,
  store,
  justCreated,
}: {
  order: Order;
  history: OrderStatusHistory[];
  store?: StoreProfile | null;
  justCreated?: boolean;
}) {
  const meta = parseOrderMeta(order);
  const isRental = order.orderType === 'sewa';
  const production = order.requiresProduction;
  const statusMeta = ORDER_STATUS_META[order.status];
  const lastUpdate = history.at(-1)?.createdAt ?? order.updatedAt;
  const deadline = order.etaDate ?? meta.eventDate ?? order.rental?.returnDate;
  const chatHref = `/chat?topic=${encodeURIComponent(`Pesanan ${order.orderNumber}`)}`;

  const showWorkshopDocs = production && (order.status === 'diproses' || order.status === 'siap_diambil' || order.status === 'selesai' || (order.orderPhotos && order.orderPhotos.length > 0));

  return (
    <PageContainer>

      {justCreated && (
        <div role="status" className="mt-6 flex items-start gap-3 rounded-xl border border-warning/30 bg-warning-bg/60 p-4 text-sm text-ink">
          <Clock className="mt-0.5 size-5 shrink-0 text-warning-dark" aria-hidden="true" />
          <div>
            <p className="font-bold text-warning-dark">Pengajuan Pesanan Berhasil Diterima</p>
            <p className="text-xs text-ink-soft pt-0.5">
              Pesanan #{order.orderNumber} telah tersimpan. Admin sedang memeriksa ketersediaan bahan baku kain ke supplier. Setelah bahan terkonfirmasi, rekening pembayaran DP akan otomatis aktif.
            </p>
          </div>
        </div>
      )}

      {order.status === 'dikonfirmasi' && !order.isLunas && (
        <div role="status" className="mt-6 flex items-start gap-3 rounded-xl border border-success/30 bg-success-bg p-4 text-sm text-ink">
          <CircleCheck className="mt-0.5 size-5 shrink-0 text-success" aria-hidden="true" />
          <div>
            <p className="font-bold text-success">Bahan Tersedia & Pesanan Dikonfirmasi!</p>
            <p className="text-xs text-ink-soft pt-0.5">
              Admin telah mengonfirmasi bahwa bahan kain tersedia. Silakan lakukan transfer DP pada kartu pembayaran untuk memulai pengerjaan di bengkel jahit.
            </p>
          </div>
        </div>
      )}

      <header className="py-6">
        <div className="max-w-2xl">
          <Badge tone={statusMeta.tone} pill dot>
            {order.status === 'pending'
              ? 'Menunggu Konfirmasi Bahan'
              : order.status === 'diproses' && production
                ? 'Produksi Berlangsung'
                : statusMeta.label}
          </Badge>
          <h1 className="pt-2 text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
            {isRental ? 'Status Sewa' : order.status === 'pending' ? 'Status Pengajuan Pre-Order' : 'Lacak Pesanan'}
          </h1>
          <p className="pt-1 text-xs text-ink-soft">
            {isRental
              ? 'Jadwal dan status penyewaan kostum.'
              : order.status === 'pending'
                ? 'Verifikasi ketersediaan bahan kain di supplier sebelum pembayaran DP dibuka.'
                : 'Pantau progres produksi dan status pesanan.'}
          </p>
        </div>
      </header>

      {/* Milestones */}
      <section className="rounded-2xl bg-surface p-8 shadow-card ring-1 ring-line">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
          <h2 className="flex items-center gap-2 text-lg font-bold text-ink">
            <TrendingUp className="size-5 text-primary" aria-hidden="true" /> Tahapan Alur Pesanan
          </h2>
          <p className="text-[13px] text-ink-soft">
            Pembaruan Terakhir: <b className="text-ink">{formatDateTime(lastUpdate)} WIB</b>
          </p>
        </div>
        {order.status === 'dibatalkan' ? (
          <p className="pt-6 text-sm font-semibold text-danger">Pesanan ini telah dibatalkan.</p>
        ) : (
          <FlowTimeline order={order} />
        )}
      </section>

      <div className="grid grid-cols-1 gap-8 pt-8 lg:grid-cols-[1fr_384px]">
        <div className="flex flex-col gap-8">
          {isRental && order.rental && (
            <section className="rounded-2xl bg-surface p-8 shadow-card ring-1 ring-line">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
                <h2 className="flex items-center gap-2 text-lg font-bold text-ink">
                  <CalendarClock className="size-5 text-primary" aria-hidden="true" /> Jadwal Sewa
                </h2>
                <Badge tone={RENTAL_STATUS_META[order.rental.status].tone}>{RENTAL_STATUS_META[order.rental.status].label}</Badge>
              </div>
              <div className="grid grid-cols-1 gap-4 pt-6 sm:grid-cols-2">
                <ScheduleBox label="Pengambilan" date={order.rental.pickupDate} time={order.rental.pickupTime} />
                <ScheduleBox label="Pengembalian" date={order.rental.returnDate} time={order.rental.returnTime} gold />
              </div>
              {toNumber(order.rental.depositAmount) > 0 && (
                <p className="pt-4 text-sm text-ink-soft">
                  Deposit: <b className="text-ink">{formatRupiah(order.rental.depositAmount)}</b>
                </p>
              )}
            </section>
          )}

          {showWorkshopDocs ? (
            <section className="rounded-2xl bg-surface p-8 shadow-card ring-1 ring-line">
              <div className="flex items-center justify-between gap-3">
                <h2 className="flex items-center gap-2 text-lg font-bold text-ink">
                  <Images className="size-5 text-primary" aria-hidden="true" /> Dokumentasi Visual dari Bengkel Jahit
                </h2>
              </div>
              {order.orderPhotos && order.orderPhotos.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 pt-6 sm:grid-cols-3">
                  {order.orderPhotos.map((p) => (
                    <figure key={p.id} className="overflow-hidden rounded-xl bg-beige-soft shadow-soft">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={formatImageUrl(p.imageUrl)} alt={p.title ?? 'Dokumentasi produksi'} className="h-36 w-full object-cover" />
                      <figcaption className="p-4">
                        <p className="text-sm font-bold text-ink">{p.title ?? p.category}</p>
                        <p className="text-xs text-ink-soft">{formatDate(p.createdAt)}</p>
                      </figcaption>
                    </figure>
                  ))}
                </div>
              ) : (
                <div className="mt-6 flex flex-col items-center rounded-xl border border-dashed border-line-strong bg-canvas p-8 text-center">
                  <Images className="size-8 text-muted" aria-hidden="true" />
                  <p className="pt-3 text-sm font-semibold text-ink">Belum ada foto dokumentasi</p>
                  <p className="text-xs text-ink-soft">Foto proses akan muncul di sini saat bengkel mengunggahnya.</p>
                </div>
              )}
            </section>
          ) : (
            <section className="rounded-2xl bg-surface p-6 shadow-card ring-1 ring-line sm:p-8">
              <div className="flex items-center gap-3 border-b border-line pb-4">
                <span className="flex size-10 items-center justify-center rounded-xl bg-beige-soft text-primary">
                  <Package className="size-5" aria-hidden="true" />
                </span>
                <div>
                  <h2 className="text-base font-bold text-ink sm:text-lg">
                    {order.status === 'pending' ? 'Pengecekan Ketersediaan Bahan Kain' : 'Bahan Terkonfirmasi — Siap Pengerjaan'}
                  </h2>
                  <p className="text-xs text-ink-soft">
                    {order.status === 'pending'
                      ? 'Tim admin sedang memeriksa stok kain ke supplier rekanan'
                      : 'Lakukan pembayaran DP agar bengkel dapat segera memulai proses produksi'}
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-4">
                <div className="rounded-xl bg-beige-soft p-4 text-xs leading-relaxed text-ink-soft">
                  <p className="font-semibold text-ink">Mengapa pesanan harus dikonfirmasi terlebih dahulu?</p>
                  <p className="mt-1">
                    VieGuard menerapkan sistem <i>Made-to-Order</i>. Setiap pesanan dicek langsung ke supplier bahan untuk memastikan ketersediaan dan kesesuaian spesifikasi kain sebelum Anda melakukan pembayaran DP.
                  </p>
                </div>

                <div className="rounded-xl border border-line bg-canvas p-4 text-xs">
                  <p className="font-bold text-ink">Tahapan Alur Pesanan Anda:</p>
                  <ol className="mt-2.5 space-y-2">
                    <li className="flex items-start gap-2.5">
                      <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-success text-[10px] font-bold text-white">✓</span>
                      <span><b>1. Pengajuan Pesanan:</b> Ukuran dan rincian pesanan telah tersimpan.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className={`mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white ${order.status === 'pending' ? 'bg-warning-dark' : 'bg-success'}`}>
                        {order.status === 'pending' ? '2' : '✓'}
                      </span>
                      <span><b>2. Pengecekan Bahan ke Supplier:</b> Admin memastikan stok kain & aksesoris tersedia (estimasi max 1x24 jam kerja).</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className={`mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white ${order.status === 'dikonfirmasi' ? 'bg-primary' : 'bg-muted'}`}>
                        3
                      </span>
                      <span><b>3. Pembayaran DP:</b> Setelah bahan terkonfirmasi, Anda dapat mentransfer DP 50% dan mengunggah bukti bayar.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-bold text-white">4</span>
                      <span><b>4. Produksi Bengkel Jahit:</b> Bahan dibeli dan proses jahit dimulai. Foto progres jahit akan diunggah di halaman ini.</span>
                    </li>
                  </ol>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-surface p-4">
                  <div>
                    <p className="text-xs font-semibold text-ink">Ada pertanyaan mengenai bahan atau jadwal?</p>
                    <p className="text-[11px] text-ink-soft">Tim kami siap membantu Anda secara langsung via chat.</p>
                  </div>
                  <Link
                    href={chatHref}
                    className="flex items-center gap-1.5 rounded-lg border border-line bg-canvas px-3 py-1.5 text-xs font-semibold text-primary transition hover:border-primary hover:bg-beige-soft"
                  >
                    <MessageSquare className="size-3.5" aria-hidden="true" /> Tanya Admin via Chat
                  </Link>
                </div>
              </div>
            </section>
          )}
        </div>

        <aside className="flex flex-col gap-6">
          <section className="rounded-2xl bg-surface p-6 shadow-card ring-1 ring-line">
            <h2 className="flex items-center gap-2 border-b border-line pb-3 text-lg font-bold text-ink">
              <ClipboardList className="size-5 text-primary" aria-hidden="true" /> Spesifikasi Pesanan
            </h2>
            <dl className="flex flex-col gap-4 pt-4 text-sm">
              <div className="flex items-center justify-between rounded-xl bg-beige-soft px-3.5 py-2.5">
                <div>
                  <dt className="text-[11px] font-semibold uppercase text-ink-soft">Nomor Pesanan</dt>
                  <dd className="font-extrabold text-primary">{order.orderNumber}</dd>
                </div>
                <CopyButton value={order.orderNumber} label="Salin" />
              </div>
              <Fact label="Item Produk" value={orderTitle(order)} />
              <div className="grid grid-cols-2 gap-4">
                <Fact label="Kuota Pembuatan" value={`${totalQuantity(order)} ${order.orderType === 'custom' ? 'Stel' : 'Unit'}`} accent />
                <Fact label="Jenis" value={ORDER_TYPE_LABEL[order.orderType]} />
              </div>
              {(meta.pic || meta.institution) && (
                <div className="grid grid-cols-2 gap-4">
                  {meta.institution && <Fact label="Institusi / Sekolah" value={meta.institution} />}
                  {meta.pic && <Fact label="Penanggung Jawab (PIC)" value={meta.pic} />}
                </div>
              )}
              <div>
                <dt className="text-xs text-ink-soft">Rincian Item</dt>
                <dd className="pt-1">
                  <ul className="flex flex-wrap gap-1.5">
                    {order.items.map((it) => (
                      <li key={it.id} className="rounded bg-beige-soft px-2 py-0.5 text-xs font-semibold text-primary">
                        {it.product?.name ?? it.accessory?.name ?? 'Seragam'}
                        {it.size ? ` · ${it.size}` : ''} × {it.quantity}
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
              {meta.rosterFile && (
                <div className="rounded-lg bg-beige-soft p-3">
                  <dt className="text-xs text-ink-soft">Berkas Terlampir</dt>
                  <dd className="flex items-center gap-2 pt-1 font-semibold text-ink">
                    <FileText className="size-4 text-primary" aria-hidden="true" /> {meta.rosterFile}
                  </dd>
                </div>
              )}
            </dl>
            <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
              <span className="text-[13px] text-ink-soft">Total Biaya Pesanan</span>
              <span className="text-xl font-extrabold text-ink">{toNumber(order.totalPrice) > 0 ? formatRupiah(order.totalPrice) : 'Menunggu penawaran'}</span>
            </div>
          </section>

          <PaymentCard order={order} />
        </aside>
      </div>
    </PageContainer>
  );
}

function FlowTimeline({ order }: { order: Order }) {
  const payments = order.payments ?? [];
  const paid = payments
    .filter((p) => p.status === 'terverifikasi' && p.paymentType !== 'refund')
    .reduce((s, p) => s + toNumber(p.amount), 0);
  const dpVerified = paid > 0 || order.isLunas;
  const isSelesai = order.status === 'selesai';

  // Stages:
  // 0: 1. Pesanan Diterima
  // 1: 2. Dikonfirmasi Admin
  // 2: 3. Pembayaran DP
  // 3: 4. Proses Pembuatan
  // 4: 5. Siap Diambil / Dikirim
  let activeIdx = 0;
  if (isSelesai) {
    activeIdx = 4;
  } else if (order.status === 'siap_diambil') {
    activeIdx = 4;
  } else if (order.status === 'diproses') {
    activeIdx = 3;
  } else if (order.status === 'dikonfirmasi') {
    activeIdx = dpVerified ? 3 : 1;
  } else {
    // pending
    activeIdx = 0;
  }

  return (
    <ol className="grid grid-cols-1 gap-6 pt-8 sm:grid-cols-5">
      {ORDER_FLOW_STAGES.map((s, i) => {
        const isDone = isSelesai || i < activeIdx || (i === activeIdx && activeIdx === 1 && order.status === 'dikonfirmasi');
        const isActive = !isSelesai && i === activeIdx;
        const Icon = s.icon;

        // Connector line logic:
        // i < activeIdx: line is completely filled (done).
        // i === activeIdx && !isSelesai: line is 50% filled (in-progress halfway!).
        // i > activeIdx: line is empty.
        const isLineDone = isSelesai || i < activeIdx;
        const isLineHalf = !isSelesai && i === activeIdx;

        return (
          <li key={s.title} className="relative flex items-center gap-4 sm:flex-col sm:gap-0 sm:text-center">
            {/* Desktop Horizontal Line */}
            {i < ORDER_FLOW_STAGES.length - 1 && (
              <span className="absolute left-1/2 top-6 hidden h-1 w-full sm:block bg-line overflow-visible z-0" aria-hidden="true">
                <span
                  className={`relative block h-full transition-all duration-500 ${
                    isLineDone
                      ? 'w-full bg-primary'
                      : isLineHalf
                        ? 'w-1/2 bg-primary'
                        : 'w-0'
                  }`}
                >
                  {isLineHalf && (
                    <>
                      <span className="absolute -right-1 -top-[3px] size-2.5 rounded-full bg-primary" />
                      <span className="absolute -right-1 -top-[3px] size-2.5 rounded-full bg-primary ring-4 ring-primary/30 animate-ping" />
                    </>
                  )}
                </span>
              </span>
            )}

            {/* Mobile Vertical Line */}
            {i < ORDER_FLOW_STAGES.length - 1 && (
              <span className="absolute left-6 top-12 h-6 w-0.5 sm:hidden bg-line overflow-visible" aria-hidden="true">
                <span
                  className={`relative block w-full ${
                    isLineDone
                      ? 'h-full bg-primary'
                      : isLineHalf
                        ? 'h-1/2 bg-primary'
                        : 'h-0'
                  }`}
                >
                  {isLineHalf && (
                    <span className="absolute -left-[3px] -bottom-1 size-2 rounded-full bg-primary animate-ping" />
                  )}
                </span>
              </span>
            )}

            <span
              className={`relative z-10 flex size-12 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
                isDone || isActive
                  ? 'bg-primary text-on-primary ring-4 ring-beige-soft shadow-xs'
                  : 'bg-canvas text-muted ring-1 ring-line'
              }`}
            >
              {isDone && !isActive ? (
                <Check className="size-5" strokeWidth={3} aria-hidden="true" />
              ) : (
                <Icon className="size-5" aria-hidden="true" />
              )}
            </span>

            <span className="sm:pt-3">
              <span
                className={`block text-[13.5px] font-bold ${
                  isActive
                    ? 'text-primary'
                    : isDone
                      ? 'text-ink'
                      : 'text-muted'
                }`}
              >
                {i + 1}. {s.title}
              </span>
              <span className="block pt-0.5 text-[11px]">
                {isSelesai || (isDone && !isActive) ? (
                  <span className="font-semibold text-primary">Selesai</span>
                ) : isActive ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-warning-bg px-2 py-0.5 font-bold text-warning-dark">
                    <span className="size-1.5 rounded-full bg-warning-dark animate-pulse" /> Sedang Berjalan
                  </span>
                ) : (
                  <span className="text-muted">Berikutnya</span>
                )}
              </span>
            </span>
          </li>
        );
      })}
    </ol>
  );
}

function Fact({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div>
      <dt className="text-xs text-ink-soft">{label}</dt>
      <dd className={`pt-0.5 font-bold ${accent ? 'text-primary' : 'text-ink'}`}>{value}</dd>
    </div>
  );
}

function ScheduleBox({ label, date, time, gold = false }: { label: string; date: string; time?: string | null; gold?: boolean }) {
  return (
    <div className={`rounded-xl p-5 ${gold ? 'bg-warning-bg' : 'bg-beige-soft'}`}>
      <p className="text-xs font-semibold uppercase text-ink-soft">{label}</p>
      <p className={`pt-1 text-lg font-bold ${gold ? 'text-gold-dark' : 'text-primary'}`}>
        {formatDate(date, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
      </p>
      {time && <p className="text-sm text-ink-soft">Pukul {time} WIB</p>}
    </div>
  );
}

