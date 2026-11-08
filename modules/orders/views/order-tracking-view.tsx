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
  ShoppingBag,
  TrendingUp,
} from 'lucide-react';
import { Order, OrderStatusHistory } from '@/types/order';
import { StoreProfile } from '@/types/store';
import { PageContainer } from '@/components/layout/page-header';
import { buttonClasses } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CopyButton } from '@/components/ui/copy-button';
import { formatDate, formatDateTime, formatRupiah, toNumber } from '@/lib/format';
import { formatImageUrl, primaryImage } from '@/lib/image';
import {
  ORDER_STATUS_META,
  ORDER_TYPE_LABEL,
  RENTAL_STATUS_META,
  orderTitle,
  parseOrderMeta,
  totalQuantity,
} from '@/lib/order-status';
import { OrderNotificationToast } from '../components/order-notification-toast';
import { PaymentCard } from '../components/payment-card';

const ORDER_FLOW_STAGES = [
  { title: 'Pesanan Diterima', icon: ClipboardList },
  { title: 'Dikonfirmasi Admin', icon: CircleCheck },
  { title: 'Pembayaran DP', icon: CreditCard },
  { title: 'Proses Pembuatan', icon: Scissors },
  { title: 'Siap Diambil / Dikirim', icon: PackageCheck },
];

const TYPE_FALLBACK: Record<Order['orderType'], string> = {
  custom: '/images/portfolio/project-1.webp',
  beli: '/images/portfolio/project-6.webp',
  sewa: '/images/portfolio/project-2.webp',
};

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
      {/* Sticky floating notification (slides in from right, disappears after a few seconds) */}
      {order.status === 'dikonfirmasi' && !order.isLunas ? (
        <OrderNotificationToast type="confirmed" orderNumber={order.orderNumber} />
      ) : justCreated && order.status === 'pending' ? (
        <OrderNotificationToast type="created" orderNumber={order.orderNumber} />
      ) : null}

      {/* Card Tahapan Alur Pesanan (menggabungkan Judul, Status Pill, dan Timeline) */}
      <section className="mt-6 rounded-2xl bg-surface p-6 shadow-card ring-1 ring-line sm:p-8">
        <div className="flex flex-col gap-4 border-b border-line pb-5">
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-xl font-extrabold tracking-tight text-ink sm:text-2xl">
                {isRental ? 'Status Sewa' : 'Lacak Pesanan'}
              </h1>
              <Badge tone={statusMeta.tone} pill dot>
                {order.status === 'pending'
                  ? 'Menunggu Konfirmasi Bahan'
                  : order.status === 'diproses' && production
                    ? 'Produksi Berlangsung'
                    : statusMeta.label}
              </Badge>
            </div>
            <p className="pt-1 text-xs text-ink-soft">
              {isRental
                ? 'Jadwal dan status penyewaan kostum.'
                : order.status === 'pending'
                  ? 'Pengecekan bahan kain di supplier sebelum pembayaran DP dibuka.'
                  : 'Pantau tahapan pengerjaan dan progres produksi pesanan Anda.'}
            </p>
          </div>
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

          {/* Card Rincian Produk Dipesan (Ala Shopee / Tokopedia) */}
          <section className="rounded-2xl bg-surface p-6 shadow-card ring-1 ring-line sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
              <h2 className="flex items-center gap-2 text-lg font-bold text-ink">
                <ShoppingBag className="size-5 text-primary" aria-hidden="true" /> Rincian Produk yang Dipesan
              </h2>
              <span className="rounded-full bg-beige-soft px-3 py-1 text-xs font-bold text-primary">
                {ORDER_TYPE_LABEL[order.orderType]}
              </span>
            </div>

            {/* List Barang Dipesan */}
            <div className="divide-y divide-line">
              {order.items.map((it) => {
                const itemImage =
                  primaryImage(it.product?.images) ??
                  it.accessory?.imageUrl ??
                  TYPE_FALLBACK[order.orderType];
                const unitPrice =
                  toNumber(it.unitPrice) > 0
                    ? toNumber(it.unitPrice)
                    : Math.round(toNumber(order.totalPrice) / Math.max(1, totalQuantity(order)));
                const subtotal = toNumber(it.subtotal) > 0 ? toNumber(it.subtotal) : unitPrice * it.quantity;

                return (
                  <div key={it.id} className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center">
                    {/* Thumbnail Foto Produk */}
                    <div className="relative size-20 shrink-0 overflow-hidden rounded-xl border border-line bg-beige-soft sm:size-24">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={itemImage}
                        alt={it.product?.name ?? it.accessory?.name ?? 'Foto produk'}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    {/* Informasi Produk */}
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <h3 className="text-base font-bold text-ink sm:text-lg">
                            {it.product?.name ?? it.accessory?.name ?? orderTitle(order)}
                          </h3>
                          <span className="text-base font-extrabold text-ink">
                            {formatRupiah(subtotal)}
                          </span>
                        </div>

                        {/* Variasi / Ukuran */}
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          {it.size && (
                            <span className="rounded-lg border border-line bg-canvas px-2.5 py-1 text-xs font-semibold text-ink">
                              Ukuran: <span className="text-primary">{it.size}</span>
                            </span>
                          )}
                          {it.productVariant?.size && it.productVariant.size !== it.size && (
                            <span className="rounded-lg border border-line bg-canvas px-2.5 py-1 text-xs font-semibold text-ink">
                              Varian: <span className="text-primary">{it.productVariant.size}</span>
                            </span>
                          )}
                          <span className="rounded-lg border border-line bg-canvas px-2.5 py-1 text-xs font-semibold text-ink-soft">
                            Kuantitas: <b className="text-ink">{it.quantity} {order.orderType === 'custom' ? 'Stel' : 'Unit'}</b>
                          </span>
                        </div>
                      </div>

                      <div className="mt-2 text-xs text-ink-soft">
                        Harga Satuan: <b className="text-ink">{formatRupiah(unitPrice)}</b>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Catatan / Spesifikasi Khusus */}
            {(meta.institution || meta.pic || meta.eventDate || meta.rosterFile || order.notes) && (
              <div className="mt-4 rounded-xl bg-beige-soft/70 p-4 text-xs">
                <p className="font-bold text-ink">Catatan & Rincian Pesanan:</p>
                <div className="mt-2 grid grid-cols-1 gap-2 text-ink-soft sm:grid-cols-2">
                  {meta.institution && <p>Institusi / Pemesan: <b className="text-ink">{meta.institution}</b></p>}
                  {meta.pic && <p>Penanggung Jawab: <b className="text-ink">{meta.pic}</b></p>}
                  {meta.eventDate && <p>Target Pemakaian: <b className="text-ink">{meta.eventDate}</b></p>}
                  {meta.rosterFile && <p>Berkas Terlampir: <b className="text-ink">{meta.rosterFile}</b></p>}
                  {order.notes && <p className="sm:col-span-2">Catatan: <b className="text-ink">{order.notes}</b></p>}
                </div>
              </div>
            )}

            {/* Subtotal & Action Bar ala Shopee */}
            <div className="mt-6 flex flex-col gap-4 border-t border-line pt-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <span className="text-xs text-ink-soft">Total Pesanan ({totalQuantity(order)} produk):</span>
                <span className="ml-2 text-xl font-extrabold text-primary">
                  {toNumber(order.totalPrice) > 0 ? formatRupiah(order.totalPrice) : 'Menunggu penawaran'}
                </span>
              </div>

              {/* Action Buttons: Chat Admin & Beli Lagi */}
              <div className="flex flex-wrap items-center gap-2.5">
                <Link
                  href={chatHref}
                  className="inline-flex items-center gap-2 rounded-xl border border-line bg-surface px-4 py-2.5 text-xs font-bold text-ink shadow-xs transition hover:border-primary hover:text-primary"
                >
                  <MessageSquare className="size-4 text-primary" aria-hidden="true" />
                  <span>Tanya Admin via Chat</span>
                </Link>

                {order.items[0]?.productId && (
                  <Link
                    href={`/product/${order.items[0].productId}`}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-beige-soft px-4 py-2.5 text-xs font-bold text-primary transition hover:bg-primary hover:text-white"
                  >
                    <span>Lihat Halaman Produk</span>
                  </Link>
                )}
              </div>
            </div>

            {/* Informasi & Spesifikasi Pesanan (Disatukan di bawah rincian produk agar tidak kosong) */}
            <div className="mt-6 border-t border-line pt-6">
              <h3 className="mb-3.5 flex items-center gap-2 text-sm font-bold text-ink">
                <FileText className="size-4 text-primary" aria-hidden="true" /> Informasi Pesanan
              </h3>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {/* Nomor Pesanan Box */}
                <div className="flex items-center justify-between rounded-xl bg-beige-soft px-3.5 py-2.5">
                  <div>
                    <span className="block text-[11px] font-semibold uppercase text-ink-soft">Nomor Pesanan</span>
                    <span className="font-extrabold text-primary">{order.orderNumber}</span>
                  </div>
                  <CopyButton value={order.orderNumber} label="Salin" />
                </div>

                {/* Status Kesiapan Bahan Box */}
                <div className="flex items-center justify-between rounded-xl border border-line bg-canvas px-3.5 py-2.5 text-xs">
                  <div>
                    <span className="block text-[11px] text-ink-soft">Kesiapan Bahan:</span>
                    {order.status === 'pending' ? (
                      <span className="font-bold text-warning-dark">Dicek ke supplier</span>
                    ) : (
                      <span className="font-bold text-success">Terkonfirmasi aman</span>
                    )}
                  </div>
                </div>

                {/* Tipe Transaksi Box */}
                <div className="flex items-center justify-between rounded-xl border border-line bg-canvas px-3.5 py-2.5 text-xs">
                  <div>
                    <span className="block text-[11px] text-ink-soft">Tipe Transaksi</span>
                    <span className="font-bold text-ink">{ORDER_TYPE_LABEL[order.orderType]}</span>
                  </div>
                </div>
              </div>

              {deadline && (
                <div className="mt-3 rounded-xl border border-line bg-canvas p-3 text-xs">
                  <span className="text-ink-soft">Target / Estimasi Waktu Selesai: </span>
                  <b className="text-ink">{formatDate(deadline)}</b>
                </div>
              )}
            </div>
          </section>

          {/* Dokumentasi Visual Bengkel Jahit (Muncul saat tahap pengerjaan) */}
          {showWorkshopDocs && (
            <section className="rounded-2xl bg-surface p-6 shadow-card ring-1 ring-line sm:p-8">
              <div className="flex items-center justify-between gap-3 border-b border-line pb-4">
                <h2 className="flex items-center gap-2 text-lg font-bold text-ink">
                  <Images className="size-5 text-primary" aria-hidden="true" /> Dokumentasi Visual dari Bengkel Jahit
                </h2>
                <span className="text-xs text-ink-soft">Foto progres jahit asli</span>
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
                  <p className="text-xs text-ink-soft">Foto proses jahit akan diunggah oleh bengkel saat produksi berlangsung.</p>
                </div>
              )}
            </section>
          )}
        </div>

        <aside className="flex flex-col gap-6">
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

