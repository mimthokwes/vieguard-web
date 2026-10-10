"use client";

import React, { useMemo, useState, useTransition } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  BadgeCheck,
  Bell,
  CalendarClock,
  Check,
  CheckCheck,
  Clock,
  CreditCard,
  FileText,
  Loader2,
  MailOpen,
  PackageCheck,
  ReceiptText,
  Scissors,
  Truck,
  XCircle,
} from 'lucide-react';
import { AppNotification } from '@/types/notification';
import { Breadcrumb } from '@/components/layout/breadcrumb';
import { PageContainer } from '@/components/layout/page-header';
import { EmptyState } from '@/components/ui/empty-state';
import { ErrorMessage } from '@/components/ui/error-message';
import { relativeTime } from '@/lib/format';
import { markAllReadAction, markReadAction } from '../actions';

type Group = 'order' | 'rental' | 'quote';

const TYPE_META: Record<string, { label: string; group: Group; icon: React.ElementType; cta: string }> = {
  ORDER_CONFIRMED: { label: 'Pesanan Dikonfirmasi', group: 'order', icon: BadgeCheck, cta: 'Lihat Detail Pesanan' },
  ORDER_STATUS_CHANGED: { label: 'Status Pesanan', group: 'order', icon: PackageCheck, cta: 'Lihat Detail Pesanan' },
  ORDER_PROGRESS_UPDATE: { label: 'Produksi Aktif', group: 'order', icon: Scissors, cta: 'Lihat Detail Progres' },
  ORDER_SHIPPED: { label: 'Pengiriman', group: 'order', icon: Truck, cta: 'Lihat Jadwal Pengiriman' },
  ORDER_AUTO_CANCELLED: { label: 'Dibatalkan', group: 'order', icon: XCircle, cta: 'Lihat Pesanan' },
  ORDER_QUOTED: { label: 'Penawaran Siap', group: 'quote', icon: ReceiptText, cta: 'Buka Ruang Penawaran' },
  PAYMENT_VERIFIED: { label: 'Pembayaran', group: 'quote', icon: CreditCard, cta: 'Lihat Pembayaran' },
  PAYMENT_REJECTED: { label: 'Pembayaran Ditolak', group: 'quote', icon: CreditCard, cta: 'Unggah Ulang Bukti' },
  PAYMENT_REMINDER: { label: 'Pengingat Bayar', group: 'quote', icon: CreditCard, cta: 'Bayar Sekarang' },
  RENTAL_HANDOVER: { label: 'Logistik Sewa', group: 'rental', icon: CalendarClock, cta: 'Lihat Jadwal Sewa' },
  RENTAL_REFUNDED: { label: 'Refund Sewa', group: 'rental', icon: ReceiptText, cta: 'Lihat Detail Sewa' },
};

function metaFor(type: string) {
  return (
    TYPE_META[type] ?? {
      label: 'Informasi',
      group: type.startsWith('RENTAL') ? 'rental' : type.startsWith('PAYMENT') ? 'quote' : 'order',
      icon: Bell,
      cta: 'Lihat Detail',
    }
  );
}

type Tab = 'all' | 'unread' | Group;

export function NotificationsView({ notifications }: { notifications: AppNotification[] }) {
  const [tab, setTab] = useState<Tab>('all');
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [markingAll, startMarkAll] = useTransition();

  const items = useMemo(() => notifications.map((n) => ({ ...n, isRead: n.isRead || readIds.has(n.id) })), [notifications, readIds]);
  const unread = items.filter((n) => !n.isRead).length;
  const today = items.filter((n) => new Date(n.createdAt).toDateString() === new Date().toDateString()).length;
  const count = (t: Tab) =>
    t === 'all' ? items.length : t === 'unread' ? unread : items.filter((n) => metaFor(n.type).group === t).length;
  const visible = items.filter((n) => (tab === 'all' ? true : tab === 'unread' ? !n.isRead : metaFor(n.type).group === tab));

  const markRead = async (id: string) => {
    setPendingId(id);
    setError('');
    const r = await markReadAction(id);
    setPendingId(null);
    if (r.error) setError(r.error);
    else setReadIds((s) => new Set(s).add(id));
  };

  const markAll = () =>
    startMarkAll(async () => {
      setError('');
      const r = await markAllReadAction();
      if (r.error) setError(r.error);
      else setReadIds(new Set(items.map((n) => n.id)));
    });

  const TABS: { key: Tab; label: string }[] = [
    { key: 'all', label: 'Semua Notifikasi' },
    { key: 'unread', label: 'Belum Dibaca' },
    { key: 'order', label: 'Pesanan & Produksi' },
    { key: 'rental', label: 'Penyewaan Armada' },
    { key: 'quote', label: 'Penawaran & Pembayaran' },
  ];

  return (
    <PageContainer>
      <Breadcrumb items={[{ label: 'Pusat Notifikasi' }]} />

      <header className="flex flex-col gap-6 py-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-beige-soft px-2.5 py-1 text-xs font-semibold text-primary">
            <span className="size-1.5 rounded-full bg-gold" aria-hidden="true" /> Sistem Aktivitas & Log Terpadu
          </span>
          <h1 className="pt-3 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">Pusat Notifikasi Aktivitas</h1>
          <p className="pt-2 text-base leading-relaxed text-ink-soft">
            Pemberitahuan resmi terkait status produksi pesanan, jadwal sewa armada, draf penawaran, dan instruksi penjahit.
          </p>
        </div>
        <button
          type="button"
          onClick={markAll}
          disabled={markingAll || unread === 0}
          className="flex items-center gap-2 self-start rounded-xl bg-surface px-4 py-2.5 text-sm font-semibold text-primary shadow-card ring-1 ring-line transition-colors hover:bg-beige-soft disabled:opacity-50 lg:self-auto"
        >
          {markingAll ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <CheckCheck className="size-4" aria-hidden="true" />}
          Tandai Semua Sudah Dibaca
        </button>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard icon={<MailOpen className="size-5" />} label="Notifikasi Belum Dibaca" value={`${unread} Menunggu`} badge={unread > 0 ? 'Prioritas' : undefined} />
        <StatCard icon={<Clock className="size-5" />} label="Notifikasi Hari Ini" value={`${today} Aktivitas`} />
        <StatCard icon={<Bell className="size-5" />} label="Total Notifikasi" value={`${items.length} Tercatat`} />
      </div>

      <div className="mt-8 flex gap-1 overflow-x-auto rounded-2xl bg-surface p-2 shadow-card ring-1 ring-line scrollbar-none" role="tablist">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            role="tab"
            aria-selected={tab === t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-[15px] font-semibold transition-colors ${
              tab === t.key ? 'bg-primary text-on-primary' : 'text-ink-soft hover:bg-beige-soft hover:text-primary'
            }`}
          >
            {t.label}
            <span
              className={`rounded-md px-1.5 text-xs font-bold ${
                tab === t.key ? 'bg-white/20 text-white' : t.key === 'unread' && unread > 0 ? 'bg-warning-bg text-gold-dark' : 'bg-canvas text-ink-soft'
              }`}
            >
              {count(t.key)}
            </span>
          </button>
        ))}
      </div>

      <ErrorMessage message={error} className="mt-6" />

      <ul className="flex flex-col gap-4 pt-6">
        {visible.map((n) => {
          const meta = metaFor(n.type);
          const Icon = meta.icon;
          return (
            <li
              key={n.id}
              className={`rounded-2xl p-6 shadow-card transition-colors sm:p-8 ${
                n.isRead ? 'bg-surface ring-1 ring-line' : 'border-l-4 border-primary bg-beige-soft/60 ring-1 ring-beige'
              }`}
            >
              <div className="flex gap-4">
                <span className={`flex size-12 shrink-0 items-center justify-center rounded-xl ${n.isRead ? 'bg-canvas text-ink-soft' : 'bg-surface text-primary shadow-soft'}`}>
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="flex items-center gap-2">
                      <span
                        className={`rounded-md px-2.5 py-0.5 text-[11px] font-bold uppercase ${
                          n.isRead ? 'bg-canvas text-ink-soft' : meta.group === 'rental' ? 'bg-gold-dark text-white' : 'bg-primary text-on-primary'
                        }`}
                      >
                        {meta.label}
                      </span>
                      {!n.isRead && <span className="size-2 rounded-full bg-primary" aria-label="Belum dibaca" />}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs text-ink-soft">
                      <Clock className="size-3.5" aria-hidden="true" /> {relativeTime(n.createdAt)}
                    </span>
                  </div>
                  <h2 className="pt-2 text-lg font-bold text-ink">{n.title}</h2>
                  <p className="pt-1 text-[15px] leading-6 text-ink-soft">{n.message}</p>
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-5">
                    {n.relatedOrderId ? (
                      <Link
                        href={`/orders/${n.relatedOrderId}`}
                        onClick={() => !n.isRead && markRead(n.id)}
                        className="flex items-center gap-1.5 text-[15px] font-semibold text-primary hover:underline"
                      >
                        {meta.cta} <ArrowRight className="size-4" aria-hidden="true" />
                      </Link>
                    ) : (
                      <span className="flex items-center gap-1.5 text-sm text-ink-soft">
                        <FileText className="size-4" aria-hidden="true" /> Informasi umum
                      </span>
                    )}
                    {n.isRead ? (
                      <span className="flex items-center gap-1 text-[13px] text-ink-soft">
                        <Check className="size-3.5" aria-hidden="true" /> Dibaca
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => markRead(n.id)}
                        disabled={pendingId === n.id}
                        className="text-xs font-semibold text-ink-soft hover:text-primary disabled:opacity-50"
                      >
                        {pendingId === n.id ? 'Menyimpan...' : 'Tandai Dibaca'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      {visible.length === 0 && (
        <EmptyState
          icon={<Bell className="size-7" aria-hidden="true" />}
          title={items.length === 0 ? 'Belum ada notifikasi' : 'Tidak ada notifikasi di tab ini'}
          description={
            items.length === 0
              ? 'Notifikasi tentang konfirmasi pesanan, progres produksi, dan pembayaran akan muncul di sini.'
              : 'Pilih tab lain untuk melihat notifikasi lainnya.'
          }
        />
      )}
    </PageContainer>
  );
}

function StatCard({ icon, label, value, badge }: { icon: React.ReactNode; label: string; value: string; badge?: string }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl bg-surface p-4 shadow-card ring-1 ring-line">
      <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-beige-soft text-primary">{icon}</span>
      <div className="flex-1">
        <p className="text-[13px] text-ink-soft">{label}</p>
        <p className="text-2xl font-bold text-ink">{value}</p>
      </div>
      {badge && <span className="rounded-full bg-warning-bg px-2.5 py-1 text-xs font-semibold text-gold-dark">{badge}</span>}
    </div>
  );
}
