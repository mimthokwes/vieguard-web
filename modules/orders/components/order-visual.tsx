import React from 'react';
import Image from 'next/image';
import { Order } from '@/types/order';
import { formatImageUrl, primaryImage } from '@/lib/image';

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

/** Product photo for an order (first item with an image), falling back to workshop photo or portfolio. */
export function OrderVisual({ order, className = 'h-56', showBadge = true }: { order: Order; className?: string; showBadge?: boolean }) {
  // 1. Ambil foto asli produk dari item pesanan
  const fromItems = order.items.map((i) => primaryImage(i.product?.images)).find(Boolean);

  // 2. Ambil foto asli dokumentasi workshop pesanan jika ada
  const fromPhotos = order.orderPhotos?.[0]?.imageUrl ? formatImageUrl(order.orderPhotos[0].imageUrl) : null;

  // 3. Ambil foto referensi desain jika pesanan custom memiliki berkas gambar
  const ref = order.customOrderDetail?.designReference;
  const isImageRef = ref && (ref.startsWith('http') || ref.startsWith('/uploads') || ref.startsWith('data:image'));
  const fromDesign = isImageRef ? formatImageUrl(ref) : null;

  // 4. Ambil foto aksesori jika pesanan berisi aksesori
  const fromAccessories = order.items.map((i) => (i.accessory?.imageUrl ? formatImageUrl(i.accessory.imageUrl) : null)).find(Boolean);

  const realImage = fromItems || fromPhotos || fromDesign || fromAccessories;
  const src = realImage ?? TYPE_FALLBACK[order.orderType];
  const badge = TYPE_BADGE[order.orderType];

  return (
    <div className={`relative overflow-hidden rounded-xl bg-beige-soft ${className}`}>
      <Image
        src={src}
        alt={order.items[0]?.product?.name || order.orderNumber}
        fill
        sizes="(min-width: 1024px) 288px, 100vw"
        className="object-cover"
        unoptimized={!!realImage}
      />
      {showBadge && <span className={`absolute left-3 top-3 rounded px-2 py-0.5 text-xs font-semibold ${badge.className}`}>{badge.label}</span>}
    </div>
  );
}
