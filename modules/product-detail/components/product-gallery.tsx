"use client";

import React, { useState } from 'react';
import { BadgeCheck, Shirt } from 'lucide-react';
import { Product } from '@/types/product';
import { formatImageUrl } from '@/lib/image';

export function ProductGallery({ product, availabilityLabel }: { product: Product; availabilityLabel: string }) {
  const images = [...product.images].sort((a, b) => Number(b.isPrimary) - Number(a.isPrimary));
  const [active, setActive] = useState(0);
  const current = images[active];

  return (
    <section className="rounded-2xl bg-surface p-6 shadow-card ring-1 ring-line">
      <div className="relative flex h-[300px] items-center justify-center overflow-hidden rounded-xl bg-canvas sm:h-[488px]">
        {current ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={formatImageUrl(current.imageUrl)} alt={product.name} className="size-full object-cover" />
        ) : (
          <div className="flex flex-col items-center gap-3 text-ink-soft">
            <span className="flex size-16 items-center justify-center rounded-full bg-surface text-primary shadow-soft">
              <Shirt className="size-7" aria-hidden="true" />
            </span>
            Gambar Produk
          </div>
        )}
        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          <span className="flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-on-primary">
            <span className="size-1.5 rounded-full bg-gold-light" aria-hidden="true" /> {availabilityLabel}
          </span>
          {product.sku && <span className="rounded-full bg-surface/90 px-3 py-1 text-xs font-semibold text-ink">Kode Armada: {product.sku}</span>}
        </div>
        {product.category && (
          <span className="absolute bottom-4 right-4 flex items-center gap-1.5 rounded-full bg-surface/95 px-3 py-1 text-xs font-bold text-ink">
            <BadgeCheck className="size-3.5 text-primary" aria-hidden="true" /> {product.category.name}
          </span>
        )}
      </div>
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2 pt-4">
          {images.slice(0, 8).map((img, i) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Lihat gambar ${i + 1}`}
              aria-pressed={i === active}
              className={`h-24 overflow-hidden rounded-xl transition-all sm:h-[118px] ${i === active ? 'ring-2 ring-primary' : 'opacity-80 hover:opacity-100'}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={formatImageUrl(img.imageUrl)} alt="" className="size-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
