import React from 'react';
import Link from 'next/link';
import {
  Box,
  CalendarCheck,
  CalendarClock,
  Check,
  CircleCheck,
  ClipboardList,
  FileText,
  Headset,
  History,
  Images,
  MessageSquare,
  Package,
  PackageCheck,
  ReceiptText,
  Ruler,
  Scissors,
  Shirt,
  TrendingUp,
  Truck,
} from 'lucide-react';
import { Order, OrderStatusHistory } from '@/types/order';
import { StoreProfile } from '@/types/store';
import { PageContainer } from '@/components/layout/page-header';
import { buttonClasses } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PrintButton } from '@/components/ui/copy-button';
import { formatDate, formatDateTime, formatRupiah, toNumber } from '@/lib/format';
import { formatImageUrl } from '@/lib/image';
import {
  ORDER_STATUS_META,
  ORDER_TYPE_LABEL,
  PRODUCTION_STAGES,
  RENTAL_STATUS_META,
  activeStageIndex,
  orderProgressPercent,
  orderTitle,
  parseOrderMeta,
  totalQuantity,
} from '@/lib/order-status';
import { PaymentCard } from '../components/payment-card';

const STAGE_ICONS = [Scissors, Shirt, Ruler, CircleCheck, Box];

/** Order lifecycle used for purchases and rentals (no production milestones). */
const FLOW_STAGES: { title: string; statuses: Order['status'][] }[] = [
  { title: 'Pesanan Diterima', statuses: ['pending'] },
  { title: 'Dikonfirmasi Admin', statuses: ['dikonfirmasi'] },
  { title: 'Disiapkan', statuses: ['diproses'] },
  { title: 'Siap Diambil / Dikirim', statuses: ['siap_diambil'] },
  { title: 'Selesai', statuses: ['selesai'] },
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

  return (
    <PageContainer>

      {justCreated && (
        <p role="status" className="mt-6 flex items-center gap-2 rounded-xl border border-success/25 bg-success-bg px-4 py-3 text-sm font-semibold text-success">
          <CircleCheck className="size-4" aria-hidden="true" /> Pesanan berhasil dibuat.
        </p>
      )}

      <header className="flex flex-col gap-6 py-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <Badge tone={statusMeta.tone} pill dot>
            {order.status === 'diproses' && production ? 'Produksi Sedang Berlangsung' : statusMeta.label}
          </Badge>
          <h1 className="pt-3 text-3xl font-extrabold leading-tight tracking-tight text-ink sm:text-4xl">
            {isRental ? 'Detail Status Penyewaan Armada' : 'Detail Status & Pelacakan Produksi Pesanan'}
          </h1>
          <p className="pt-2 text-base leading-relaxed text-ink-soft">
            {isRental
              ? 'Pantau jadwal pengambilan, batas pengembalian, dan status pembayaran sewa Anda.'
              : 'Pantau milestone penjahitan, jadwal QC, dan nomor resi kargo resmi pesanan institusi Anda.'}
          </p>
        </div>
        <div className="flex flex-col gap-4 rounded-2xl bg-surface p-4 shadow-card ring-1 ring-line sm:flex-row sm:items-center">
          <HeaderFact icon={<ReceiptText className="size-5" />} label="Nomor Transaksi" value={order.orderNumber} />
          {deadline && (
            <>
              <span className="hidden h-12 w-px bg-line sm:block" aria-hidden="true" />
              <HeaderFact
                gold
                icon={<CalendarCheck className="size-5" />}
                label={isRental ? 'Batas Pengembalian' : 'Batas Waktu Kirim'}
                value={formatDate(deadline, { day: 'numeric', month: 'short', year: 'numeric' })}
              />
            </>
          )}
        </div>
      </header>

      {/* Milestones */}
      <section className="rounded-2xl bg-surface p-8 shadow-card ring-1 ring-line">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
          <h2 className="flex items-center gap-2 text-lg font-bold text-ink">
            <TrendingUp className="size-5 text-primary" aria-hidden="true" /> {production ? 'Tahapan Pengerjaan Busana' : 'Tahapan Pesanan'}
          </h2>
          <p className="text-[13px] text-ink-soft">
            Pembaruan Terakhir: <b className="text-ink">{formatDateTime(lastUpdate)} WIB</b>
          </p>
        </div>
        {order.status === 'dibatalkan' ? (
          <p className="pt-6 text-sm font-semibold text-danger">Pesanan ini telah dibatalkan.</p>
        ) : production ? (
          <ProductionTimeline order={order} />
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

          {production && (
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
          )}

          <section className="rounded-2xl bg-surface p-8 shadow-card ring-1 ring-line">
            <div className="flex items-center justify-between gap-3 border-b border-line pb-4">
              <h2 className="flex items-center gap-2 text-lg font-bold text-ink">
                <History className="size-5 text-primary" aria-hidden="true" /> Log Aktivitas & Catatan Harian
              </h2>
              <PrintButton className="text-[13px] font-bold text-primary hover:underline print:hidden">Cetak Catatan</PrintButton>
            </div>
            {history.length === 0 ? (
              <p className="pt-6 text-sm text-ink-soft">Belum ada catatan aktivitas dari admin.</p>
            ) : (
              <ol className="relative flex flex-col gap-6 pt-6">
                <span className="absolute bottom-2 left-[11px] top-8 w-px bg-line-strong" aria-hidden="true" />
                {[...history].reverse().map((h, i) => (
                  <li key={h.id} className="relative flex gap-4 pl-0">
                    <span className={`relative z-10 mt-1 flex size-6 shrink-0 items-center justify-center rounded-full ${i === 0 ? 'bg-primary' : 'bg-beige'}`}>
                      <span className="size-2 rounded-full bg-surface" />
                    </span>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <p className="font-bold text-ink">{h.statusLabel}</p>
                        <p className="text-xs text-ink-soft">{formatDateTime(h.createdAt)} WIB</p>
                      </div>
                      {h.note && <p className="pt-1 text-[15px] leading-6 text-ink-soft">{h.note}</p>}
                      <p className="pt-1 text-xs font-semibold text-primary">Progres {h.progressPercentage}%</p>
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </section>
        </div>

        <aside className="flex flex-col gap-6">
          <section className="rounded-2xl bg-surface p-6 shadow-card ring-1 ring-line">
            <h2 className="flex items-center gap-2 border-b border-line pb-3 text-lg font-bold text-ink">
              <ClipboardList className="size-5 text-primary" aria-hidden="true" /> Spesifikasi Pesanan
            </h2>
            <dl className="flex flex-col gap-4 pt-4 text-sm">
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

          {!isRental && (
            <section className="rounded-2xl bg-surface p-6 shadow-card ring-1 ring-line">
              <h2 className="flex items-center gap-2 border-b border-line pb-3 text-lg font-bold text-ink">
                <Truck className="size-5 text-primary" aria-hidden="true" /> Logistik & Pengiriman
              </h2>
              <dl className="flex flex-col gap-4 pt-4 text-sm">
                <Fact label="Ekspedisi Ditunjuk" value={order.courier || 'Ditentukan bengkel'} />
                {order.trackingNumber && <Fact label="Nomor Resi" value={order.trackingNumber} accent />}
                {meta.address && <Fact label="Alamat Pengiriman Institusi" value={meta.address} />}
              </dl>
              {(order.etaDate || order.shippedAt) && (
                <div className="mt-4 flex gap-3 rounded-xl bg-warning-bg p-4">
                  <CalendarClock className="size-5 shrink-0 text-gold-dark" aria-hidden="true" />
                  <div>
                    <p className="text-xs font-semibold text-ink-soft">{order.etaDate ? 'Estimasi Tiba di Lokasi' : 'Dikirim'}</p>
                    <p className="font-bold text-gold-dark">{formatDate(order.etaDate ?? order.shippedAt, { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  </div>
                </div>
              )}
            </section>
          )}

          <section className="rounded-2xl bg-beige-soft p-6 ring-1 ring-beige">
            <p className="flex items-center gap-2 font-bold text-ink">
              <Headset className="size-5 text-gold-dark" aria-hidden="true" /> Pusat Bantuan & Konsultasi
            </p>
            <p className="pt-3 text-[15px] leading-6 text-ink-soft">Perlu konfirmasi jadwal gladi bersih atau penyesuaian fitting?</p>
            <Link href={chatHref} className={buttonClasses({ size: 'lg', fullWidth: true, className: 'mt-5' })}>
              <MessageSquare className="size-4" aria-hidden="true" /> {isRental ? 'Hubungi Admin Sewa' : 'Hubungi Kepala Bengkel Penjahit'}
            </Link>
            <p className="flex items-center justify-center gap-1.5 pt-3 text-xs font-semibold text-ink-soft">
              <span className="size-1.5 rounded-full bg-success" /> {store?.operationalHours || 'Layanan Siap Tanggap Jam Kerja'}
            </p>
          </section>
        </aside>
      </div>
    </PageContainer>
  );
}

function ProductionTimeline({ order }: { order: Order }) {
  const idx = activeStageIndex(order);
  const pct = orderProgressPercent(order);
  return (
    <ol className="grid grid-cols-1 gap-6 pt-8 sm:grid-cols-5">
      {PRODUCTION_STAGES.map((s, i) => {
        const done = i < idx;
        const active = i === idx;
        const Icon = STAGE_ICONS[i]!;
        return (
          <li key={s.title} className="relative flex flex-row items-center gap-4 text-left sm:flex-col sm:gap-0 sm:text-center">
            {i < PRODUCTION_STAGES.length - 1 && (
              <span className={`absolute left-1/2 top-6 hidden h-1 w-full sm:block ${i < idx ? 'bg-primary' : 'bg-line'}`} aria-hidden="true" />
            )}
            <span
              className={`relative z-10 flex size-12 shrink-0 items-center justify-center rounded-full ${
                done || active ? 'bg-primary text-on-primary ring-4 ring-beige-soft' : 'bg-canvas text-muted'
              }`}
            >
              {done ? <Check className="size-5" strokeWidth={3} aria-hidden="true" /> : <Icon className="size-5" aria-hidden="true" />}
            </span>
            <span className="sm:pt-3">
              <span className={`block text-[15px] font-semibold ${active ? 'text-primary' : done ? 'text-ink' : 'text-muted'}`}>
                {i + 1}. {s.title}
              </span>
              <span className="block pt-1 text-xs">
                {done ? (
                  <span className="text-primary">Selesai</span>
                ) : active ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-0.5 font-semibold text-on-primary">
                    <span className="size-1.5 rounded-full bg-gold" /> Progres {pct}%
                  </span>
                ) : (
                  <span className="text-muted">{idx < 0 ? 'Menunggu konfirmasi' : 'Menunggu Giliran'}</span>
                )}
              </span>
            </span>
          </li>
        );
      })}
    </ol>
  );
}

function FlowTimeline({ order }: { order: Order }) {
  const idx = FLOW_STAGES.findIndex((s) => s.statuses.includes(order.status));
  return (
    <ol className="grid grid-cols-1 gap-6 pt-8 sm:grid-cols-5">
      {FLOW_STAGES.map((s, i) => {
        const done = i < idx || order.status === 'selesai';
        const active = i === idx && order.status !== 'selesai';
        return (
          <li key={s.title} className="relative flex items-center gap-4 sm:flex-col sm:gap-0 sm:text-center">
            {i < FLOW_STAGES.length - 1 && (
              <span className={`absolute left-1/2 top-6 hidden h-1 w-full sm:block ${i < idx ? 'bg-primary' : 'bg-line'}`} aria-hidden="true" />
            )}
            <span
              className={`relative z-10 flex size-12 shrink-0 items-center justify-center rounded-full ${
                done || active ? 'bg-primary text-on-primary ring-4 ring-beige-soft' : 'bg-canvas text-muted'
              }`}
            >
              {done ? <Check className="size-5" strokeWidth={3} aria-hidden="true" /> : i === 3 ? <PackageCheck className="size-5" /> : <Package className="size-5" />}
            </span>
            <span className={`text-[15px] font-semibold sm:pt-3 ${active ? 'text-primary' : done ? 'text-ink' : 'text-muted'}`}>
              {i + 1}. {s.title}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

function HeaderFact({ icon, label, value, gold = false }: { icon: React.ReactNode; label: string; value: string; gold?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <span className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${gold ? 'bg-warning-bg text-gold-dark' : 'bg-beige-soft text-primary'}`}>{icon}</span>
      <div>
        <p className="text-xs font-semibold uppercase text-ink-soft">{label}</p>
        <p className={`text-[15px] font-bold ${gold ? 'text-gold-dark' : 'text-ink'}`}>{value}</p>
      </div>
    </div>
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

