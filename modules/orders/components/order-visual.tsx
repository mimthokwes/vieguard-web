import React from 'react';
import Image from 'next/image';
import { Order } from '@/types/order';
import { primaryImage } from '@/lib/image';

const TYPE_FALLBACK: Record<Order['orderType'], string> = {
  custom: '/images/portfolio/project-1.webp',
  beli: '/images/portfolio/project-6.webp',
  sewa: '/images/portfolio/project-2.webp',
};

const TYPE_BADGE: Record<Order['orderType'], { label: string; className: string }> = {
  custom: { label: 'Pesanan Jahit', className: 'bg-primary text-on-primary' },
  beli: { label: 'Pembelian', className: 'bg-primary-dark text-on-primary' },
  sewa: { label: 'Penyewaan Armada', className: 'bg-gold-dark text-white' },
};

/** Product photo for an order (first item with an image), falling back to a sample photo per order type. */
export function OrderVisual({ order, className = 'h-56', showBadge = true }: { order: Order; className?: string; showBadge?: boolean }) {
  const fromItems = order.items.map((i) => primaryImage(i.product?.images)).find(Boolean);
  const src = fromItems ?? TYPE_FALLBACK[order.orderType];
  const badge = TYPE_BADGE[order.orderType];
  return (
    <div className={`relative overflow-hidden rounded-xl bg-beige-soft ${className}`}>
      <Image src={src} alt="" fill sizes="(min-width: 1024px) 288px, 100vw" className="object-cover" unoptimized={!!fromItems} />
      {showBadge && <span className={`absolute left-3 top-3 rounded px-2 py-0.5 text-xs font-semibold ${badge.className}`}>{badge.label}</span>}
    </div>
  );
}
