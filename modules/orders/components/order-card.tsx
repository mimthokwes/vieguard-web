import React from 'react';
import Link from 'next/link';
import { Clock, FileText, Hourglass, MessageSquare, PackageCheck, ShieldCheck, TrendingUp, Warehouse } from 'lucide-react';
import { Order } from '@/types/order';
import { buttonClasses } from '@/components/ui/button';
import { formatDate, formatRupiah, toNumber } from '@/lib/format';
import {
  PRODUCTION_STAGES,
  activeStageIndex,
  isAwaitingQuote,
  latestProgress,
  orderProgressPercent,
  orderTitle,
  parseOrderMeta,
  totalQuantity,
} from '@/lib/order-status';
import { OrderStatusPill } from './order-status-pill';
import { OrderVisual } from './order-visual';

export function OrderCard({ order }: { order: Order }) {
  const meta = parseOrderMeta(order);
  const qty = totalQuantity(order);
  const awaitingQuote = isAwaitingQuote(order);
  const isRental = order.orderType === 'sewa';
  const total = toNumber(order.totalPrice);

  return (
    <article className="overflow-hidden rounded-2xl bg-surface shadow-card ring-1 ring-line">
      <header className="flex flex-wrap items-center justify-between gap-3 bg-canvas px-6 py-4">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <p className="text-[13px] text-ink-soft">
            Nomor Transaksi:{' '}
            <span className={`text-lg font-extrabold ${isRental ? 'text-gold-dark' : 'text-primary'}`}>{order.orderNumber}</span>
          </p>
          <span className="hidden h-5 w-px bg-line-strong sm:block" aria-hidden="true" />
          <p className="flex items-center gap-1.5 text-[13px] font-semibold text-ink-soft">
            <Clock className="size-3.5" aria-hidden="true" /> {formatDate(order.createdAt)}
          </p>
        </div>
        <OrderStatusPill order={order} />
      </header>

      <div className="flex flex-col gap-6 p-6 md:flex-row">
        <OrderVisual order={order} className="h-56 w-full shrink-0 md:w-72" />

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <h2 className="text-xl font-bold text-ink">{orderTitle(order)}</h2>
            {isRental && order.rental && (
              <span className="rounded bg-warning-bg px-2 py-1 text-xs font-bold uppercase text-gold-dark">
                Durasi {rentalDays(order)} Hari Sewa
              </span>
            )}
          </div>
          <p className="flex flex-wrap items-center gap-x-2 pt-1 text-sm font-semibold">
            {meta.institution && <span className="text-primary">Instansi: {meta.institution}</span>}
            {meta.institution && <Dot />}
            <span className="font-normal text-ink-soft">
              {qty} {order.orderType === 'custom' ? 'Stel' : 'Unit'}
            </span>
            {(meta.eventDate || order.rental) && <Dot />}
            {isRental && order.rental ? (
              <span className="text-gold-dark">
                Tanggal Sewa: {formatDate(order.rental.pickupDate, { day: 'numeric', month: 'short' })}–{formatDate(order.rental.returnDate)}
              </span>
            ) : (
              meta.eventDate && <span className="text-primary">Target Acara: {formatDate(meta.eventDate)}</span>
            )}
          </p>

          <div className="mt-4">
            {awaitingQuote ? (
              <InfoBlock icon={<Hourglass className="size-5" />} tone="warning" title="Menunggu Penawaran Harga dari Admin">
                Data pesanan sedang ditinjau master tailor. Penawaran resmi akan dikirim lewat notifikasi.
              </InfoBlock>
            ) : order.requiresProduction && (order.status === 'diproses' || order.status === 'dikonfirmasi') ? (
              <ProductionProgress order={order} />
            ) : isRental && order.rental ? (
              <InfoBlock
                icon={<Warehouse className="size-5" />}
                tone="gold"
                title={order.status === 'siap_diambil' ? 'Armada Sudah Disterilisasi & Siap di Hub Logistik' : 'Jadwal Sewa Tercatat'}
                aside={
                  <span className="text-right">
                    <span className="block text-xs text-muted">Batas Waktu Pengembalian</span>
                    <span className="block text-sm font-bold text-gold-dark">
                      {formatDate(order.rental.returnDate)}
                      {order.rental.returnTime ? `, ${order.rental.returnTime} WIB` : ''}
                    </span>
                  </span>
                }
              >
                Pengambilan {formatDate(order.rental.pickupDate, { weekday: 'long', day: 'numeric', month: 'long' })}
                {order.rental.pickupTime ? ` pukul ${order.rental.pickupTime} WIB` : ''}.
              </InfoBlock>
            ) : order.status === 'siap_diambil' ? (
              <InfoBlock icon={<PackageCheck className="size-5" />} tone="primary" title="Pesanan Siap Dikirim / Diambil">
                {order.trackingNumber ? `Resi ${order.courier ?? ''} ${order.trackingNumber}` : 'Admin akan menginformasikan jadwal pengiriman.'}
              </InfoBlock>
            ) : null}
          </div>

          {meta.rosterFile && (
            <p className="mt-4 flex w-fit items-center gap-2 rounded-lg bg-beige-soft px-4 py-2 text-sm text-ink-soft">
              <FileText className="size-4 text-primary" aria-hidden="true" /> Berkas Terkait:{' '}
              <span className="font-semibold text-primary underline">{meta.rosterFile}</span>
            </p>
          )}

          <div className="mt-auto flex flex-col gap-4 pt-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[13px] text-ink-soft">
                {isRental ? 'Total Biaya Sewa' : 'Total Biaya'}:{' '}
                <span className={`text-2xl font-extrabold ${isRental ? 'text-gold-dark' : 'text-primary'}`}>
                  {total > 0 ? formatRupiah(total) : 'Menunggu penawaran'}
                </span>
              </p>
              <p className="flex items-center gap-1.5 pt-0.5 text-xs font-semibold text-ink-soft">
                <ShieldCheck className="size-3.5" aria-hidden="true" /> {paymentNote(order)}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href={`/orders/${order.id}`} className={buttonClasses({ size: 'md' })}>
                <TrendingUp className="size-4" aria-hidden="true" /> {awaitingQuote ? 'Lihat Status Penawaran' : 'Lacak Progres'}
              </Link>
              <Link
                href={`/chat?topic=${encodeURIComponent(`Pesanan ${order.orderNumber}`)}`}
                aria-label="Hubungi admin tentang pesanan ini"
                className={buttonClasses({ variant: 'soft', className: 'border-0 !px-3' })}
              >
                <MessageSquare className="size-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

function ProductionProgress({ order }: { order: Order }) {
  const pct = orderProgressPercent(order);
  const idx = activeStageIndex(order);
  const latest = latestProgress(order);
  return (
    <div className="rounded-xl bg-beige-soft p-4">
      <div className="flex flex-wrap justify-between gap-2 text-xs font-semibold">
        <span className="text-primary">Progres Pengerjaan Workshop ({pct}%)</span>
        {latest && <span className="text-ink-soft">{latest.statusLabel}</span>}
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-line-strong" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
        <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
      </div>
      <ol className="hidden justify-between pt-2.5 text-xs sm:flex">
        {PRODUCTION_STAGES.map((s, i) => (
          <li key={s.title} className={i < idx ? 'font-semibold text-ink' : i === idx ? 'font-bold text-primary' : 'text-muted'}>
            {i + 1}. {s.title}
          </li>
        ))}
      </ol>
    </div>
  );
}

function InfoBlock({
  icon,
  title,
  tone,
  aside,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  tone: 'warning' | 'gold' | 'primary';
  aside?: React.ReactNode;
  children: React.ReactNode;
}) {
  const iconClass = tone === 'primary' ? 'bg-surface text-primary' : 'bg-warning-bg text-gold-dark';
  return (
    <div className="flex items-center gap-4 rounded-xl bg-beige-soft p-4">
      <span className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${iconClass}`}>{icon}</span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-ink">{title}</p>
        <p className="text-[13px] text-ink-soft">{children}</p>
      </div>
      {aside}
    </div>
  );
}

function Dot() {
  return <span className="text-muted" aria-hidden="true">•</span>;
}

function rentalDays(order: Order) {
  if (!order.rental) return 0;
  const ms = new Date(order.rental.returnDate).getTime() - new Date(order.rental.pickupDate).getTime();
  return Math.max(1, Math.round(ms / 86400000) + 1);
}

export function paymentNote(order: Order) {
  if (order.isLunas) return 'Lunas';
  const verified = (order.payments ?? []).filter((p) => p.status === 'terverifikasi' && p.paymentType !== 'refund');
  if (verified.length > 0) return `DP Terverifikasi (${formatRupiah(verified.reduce((s, p) => s + toNumber(p.amount), 0))})`;
  if ((order.payments ?? []).some((p) => p.status === 'menunggu')) return 'Bukti pembayaran menunggu verifikasi';
  if (toNumber(order.dpAmount) > 0) return `Menunggu pembayaran DP ${formatRupiah(order.dpAmount)}`;
  return 'Belum ada pembayaran';
}

