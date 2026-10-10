import React from 'react';
import { Order } from '@/types/order';
import { ORDER_STATUS_META, PRODUCTION_STAGES, activeStageIndex, isAwaitingQuote } from '@/lib/order-status';

const TONE_CLASS = {
  warning: 'bg-warning-bg text-warning',
  info: 'bg-primary text-on-primary',
  success: 'bg-success-bg text-success',
  danger: 'bg-danger-bg text-danger',
  neutral: 'bg-canvas text-ink-soft',
  primary: 'bg-primary text-on-primary',
  gold: 'bg-gold-dark text-white',
} as const;

/** Rounded status pill used in order headers ("Proses Penjahitan (Langkah 3/5)"). */
export function OrderStatusPill({ order }: { order: Order }) {
  let label = ORDER_STATUS_META[order.status].label;
  let tone: keyof typeof TONE_CLASS = ORDER_STATUS_META[order.status].tone;

  if (isAwaitingQuote(order)) {
    label = 'Menunggu Penawaran Harga';
    tone = 'warning';
  } else if (order.status === 'diproses' && order.requiresProduction) {
    const idx = activeStageIndex(order);
    if (idx >= 0 && idx < PRODUCTION_STAGES.length) label = `${PRODUCTION_STAGES[idx]!.title} (Langkah ${idx + 1}/${PRODUCTION_STAGES.length})`;
  } else if (order.orderType === 'sewa' && order.status === 'siap_diambil') {
    label = 'Armada Siap Diambil / Dikirim';
    tone = 'gold';
  }

  return (
    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${TONE_CLASS[tone]}`}>
      <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
      {label}
    </span>
  );
}
