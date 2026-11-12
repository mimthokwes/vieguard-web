'use client';

import React, { useMemo, useState } from 'react';
import {
  BadgeCheck,
  CalendarCheck,
  CalendarDays,
  CircleHelp,
  ClipboardList,
  MessagesSquare,
  RefreshCw,
  Scissors,
  Search,
} from 'lucide-react';
import { Order } from '@/types/order';
import { PageContainer } from '@/components/layout/page-header';
import { ButtonLink } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { ErrorMessage } from '@/components/ui/error-message';
import { orderTitle, parseOrderMeta, totalQuantity } from '@/lib/order-status';
import { OrderCard } from '../components/order-card';
import { useOrders } from '../hooks/use-orders';

type Tab = 'all' | 'production' | 'rental' | 'done';
type DateRange = 'all' | '30' | '90' | 'year';

const isActiveOrder = (o: Order) => o.status !== 'selesai' && o.status !== 'dibatalkan';

export function OrdersListView({
  orders: initialOrders,
  userName,
  error: initialError,
}: {
  orders: Order[];
  userName: string;
  error?: string;
}) {
  const { orders, isFetching, error: fetchError, refetch } = useOrders({ initialOrders });
  const error = fetchError || initialError;

  const [tab, setTab] = useState<Tab>('all');
  const [query, setQuery] = useState('');
  const [range, setRange] = useState<DateRange>('all');
  // Cutoff timestamp is computed when the filter changes, keeping render pure.
  const [since, setSince] = useState(0);

  const stats = useMemo(() => {
    const active = orders.filter(isActiveOrder);
    const sewing = orders.filter((o) => o.requiresProduction && o.status === 'diproses');
    const rentals = orders.filter(
      (o) => o.orderType === 'sewa' && o.rental && (o.rental.status === 'dipesan' || o.rental.status === 'diambil')
    );
    return {
      active: active.length,
      sewing: sewing.length,
      sewingUnits: sewing.reduce((s, o) => s + totalQuantity(o), 0),
      rentals: rentals.length,
      rentalUnits: rentals.reduce((s, o) => s + totalQuantity(o), 0),
      done: orders.filter((o) => o.status === 'selesai').length,
    };
  }, [orders]);

  const counts: Record<Tab, number> = {
    all: orders.length,
    production: orders.filter((o) => o.orderType !== 'sewa' && isActiveOrder(o)).length,
    rental: orders.filter((o) => o.orderType === 'sewa' && isActiveOrder(o)).length,
    done: orders.filter((o) => !isActiveOrder(o)).length,
  };

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return orders.filter((o) => {
      if (tab === 'production' && !(o.orderType !== 'sewa' && isActiveOrder(o))) return false;
      if (tab === 'rental' && !(o.orderType === 'sewa' && isActiveOrder(o))) return false;
      if (tab === 'done' && isActiveOrder(o)) return false;
      if (new Date(o.createdAt).getTime() < since) return false;
      if (!q) return true;
      return [o.orderNumber, orderTitle(o), parseOrderMeta(o).institution ?? ''].some((t) => t.toLowerCase().includes(q));
    });
  }, [orders, tab, query, since]);

  const TABS: { key: Tab; label: string }[] = [
    { key: 'all', label: 'Semua' },
    { key: 'production', label: 'Pre-Order' },
    { key: 'rental', label: 'Sewa' },
    { key: 'done', label: 'Selesai' },
  ];

  return (
    <PageContainer>
      <section className="relative mt-6 overflow-hidden rounded-2xl bg-surface p-6 shadow-card ring-1 ring-line sm:p-7">
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="rounded-full bg-beige-soft px-2.5 py-0.5 text-xs font-bold uppercase text-primary">Pesanan • {userName}</span>
            <h1 className="pt-2 text-2xl font-extrabold tracking-tight text-ink">Riwayat Pesanan</h1>
            <p className="pt-1 text-xs text-ink-soft">Pantau progres produksi, jadwal sewa, dan status pesanan Anda.</p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => refetch()}
              disabled={isFetching}
              title="Segarkan status pesanan"
              className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface px-3 py-2 text-xs font-semibold text-ink-soft shadow-xs transition-colors hover:bg-beige-soft hover:text-primary disabled:opacity-50"
            >
              <RefreshCw className={`size-3.5 ${isFetching ? 'animate-spin text-primary' : ''}`} aria-hidden="true" />
              <span className="hidden sm:inline">{isFetching ? 'Memeriksa...' : 'Segarkan'}</span>
            </button>
            <ButtonLink
              href="/chat?topic=Bantuan%20pesanan"
              variant="outline"
              size="sm"
              className="!border-primary !text-primary hover:!bg-primary/5"
            >
              <MessagesSquare className="size-4" aria-hidden="true" /> Chat Admin
            </ButtonLink>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-2 gap-4 pt-6 lg:grid-cols-4">
        <StatCard label="Pesanan Aktif" value={`${stats.active}`} note="Sedang diproses" icon={<ClipboardList className="size-5" />} />
        <StatCard label="Dalam Jahit" value={`${stats.sewing}`} note={`${stats.sewingUnits} stel`} icon={<Scissors className="size-5" />} />
        <StatCard
          label="Kostum Sewa"
          value={`${stats.rentals}`}
          note={`${stats.rentalUnits} unit`}
          icon={<CalendarCheck className="size-5" />}
          gold
        />
        <StatCard label="Selesai" value={`${stats.done}`} note="Pesanan tuntas" icon={<BadgeCheck className="size-5" />} muted />
      </div>

      <div className="mt-8 flex flex-col gap-4 rounded-2xl bg-surface p-4 shadow-card ring-1 ring-line 2xl:flex-row 2xl:items-center 2xl:justify-between print:hidden">
        <div className="flex gap-1 overflow-x-auto scrollbar-none" role="tablist">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              role="tab"
              aria-selected={tab === t.key}
              onClick={() => setTab(t.key)}
              className={`whitespace-nowrap rounded-lg px-4 py-2.5 text-[15px] font-semibold transition-colors ${
                tab === t.key ? 'bg-primary text-on-primary' : 'text-ink-soft hover:bg-beige-soft hover:text-primary'
              }`}
            >
              {t.label} ({counts[t.key]})
            </button>
          ))}
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <label className="relative">
            <span className="sr-only">Cari pesanan</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari nomor pesanan atau instansi..."
              className="h-11 w-full rounded-lg bg-beige-soft pl-10 pr-3 text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary sm:w-72"
            />
          </label>
          <label className="relative">
            <span className="sr-only">Filter tanggal</span>
            <CalendarDays className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink" aria-hidden="true" />
            <select
              value={range}
              onChange={(e) => {
                const value = e.target.value as DateRange;
                setRange(value);
                setSince(
                  value === 'all'
                    ? 0
                    : value === 'year'
                      ? new Date(new Date().getFullYear(), 0, 1).getTime()
                      : Date.now() - Number(value) * 86400000
                );
              }}
              className="h-11 w-full cursor-pointer rounded-lg bg-beige-soft pl-9 pr-4 text-sm font-semibold text-ink focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">Semua Tanggal</option>
              <option value="30">30 Hari Terakhir</option>
              <option value="90">90 Hari Terakhir</option>
              <option value="year">Tahun Ini</option>
            </select>
          </label>
        </div>
      </div>

      <ErrorMessage message={error ? `Gagal memuat pesanan: ${error}` : undefined} className="mt-6" />

      <div className="flex flex-col gap-6 pt-6">
        {visible.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
        {visible.length === 0 && !error && (
          <EmptyState
            icon={<ClipboardList className="size-7" aria-hidden="true" />}
            title={orders.length === 0 ? 'Belum ada pesanan' : 'Tidak ditemukan'}
            description={orders.length === 0 ? 'Mulai buat pesanan seragam baru atau sewa kostum.' : 'Ubah kata kunci atau filter tanggal.'}
            actionText={orders.length === 0 ? 'Pesan Sekarang' : undefined}
            actionHref={orders.length === 0 ? '/order' : undefined}
          />
        )}
      </div>

      <aside className="mt-8 flex flex-col gap-4 rounded-2xl bg-beige-soft p-5 sm:flex-row sm:items-center sm:justify-between print:hidden">
        <div className="flex items-center gap-3.5">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-beige text-primary">
            <CircleHelp className="size-5" aria-hidden="true" />
          </span>
          <div>
            <p className="font-bold text-ink">Butuh Bantuan Pesanan?</p>
            <p className="text-xs text-ink-soft">Hubungi admin untuk revisi ukuran, penambahan unit, atau perpanjangan sewa.</p>
          </div>
        </div>
        <div className="flex shrink-0 gap-2">
          <ButtonLink href="/order" variant="soft" size="sm" className="!h-9 border-0 bg-surface">
            Pesan Baru
          </ButtonLink>
          <ButtonLink href="/chat" variant="dark" size="sm" className="!h-9">
            Chat Admin
          </ButtonLink>
        </div>
      </aside>
    </PageContainer>
  );
}

function StatCard({
  label,
  value,
  note,
  icon,
  gold = false,
  muted = false,
}: {
  label: string;
  value: string;
  note: React.ReactNode;
  icon: React.ReactNode;
  gold?: boolean;
  muted?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl bg-surface p-6 shadow-card ring-1 ring-line">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">{label}</p>
        <p className={`pt-1 text-3xl font-extrabold ${gold ? 'text-gold-dark' : muted ? 'text-ink' : 'text-primary'}`}>{value}</p>
        <p className="pt-1 text-xs text-ink-soft">{note}</p>
      </div>
      <span
        className={`flex size-14 shrink-0 items-center justify-center rounded-xl ${
          gold ? 'bg-warning-bg text-gold-dark' : muted ? 'bg-canvas text-ink-soft' : 'bg-beige-soft text-primary'
        }`}
      >
        {icon}
      </span>
    </div>
  );
}
