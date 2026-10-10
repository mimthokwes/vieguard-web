import React from 'react';
import Link from 'next/link';
import { ArrowRight, Archive, Shirt } from 'lucide-react';
import { Product } from '@/types/product';
import { buttonClasses } from '@/components/ui/button';
import { formatRupiah, toNumber } from '@/lib/format';
import { primaryImage } from '@/lib/image';

export type CatalogMode = 'all' | 'sewa';

export function rentStock(product: Product) {
  return product.variants.reduce((s, v) => s + Math.max(0, v.stockRent - (v.stockInService ?? 0)), 0);
}

export function buyStock(product: Product) {
  return product.variants.reduce((s, v) => s + Math.max(0, v.stockBuy), 0);
}

export function canRent(product: Product) {
  return toNumber(product.basePriceRent) > 0;
}

export function canBuy(product: Product) {
  return toNumber(product.basePriceBuy) > 0;
}

export function ProductCard({ product, mode, detailHref }: { product: Product; mode: CatalogMode; detailHref: string }) {
  const image = primaryImage(product.images);
  const rentable = canRent(product);
  const showRent = mode === 'sewa' || rentable;
  const price = showRent ? product.basePriceRent : product.basePriceBuy;
  const stock = showRent ? rentStock(product) : buyStock(product);

  return (
    <article className="flex flex-col rounded-2xl bg-surface p-5 shadow-card ring-1 ring-line">
      <div className="relative flex h-48 items-center justify-center overflow-hidden rounded-xl bg-canvas ring-1 ring-line">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt={product.name} className="size-full object-cover" loading="lazy" />
        ) : (
          <div className="flex flex-col items-center gap-3 text-ink-soft">
            <span className="flex size-12 items-center justify-center rounded-full bg-surface text-primary shadow-soft">
              <Shirt className="size-5" aria-hidden="true" />
            </span>
            Gambar Produk
          </div>
        )}
      </div>

      <div className="flex items-center justify-between gap-2 pt-5">
        <span className="rounded-md border border-beige bg-beige-soft px-2.5 py-0.5 text-[11px] font-bold uppercase text-primary">
          {product.category?.name ?? 'Armada'}
        </span>
        {product.sku && <span className="font-mono text-xs tracking-wider text-muted">KODE: {product.sku}</span>}
      </div>
      <h3 className="pt-4 text-[15px] font-bold text-ink">{product.name}</h3>

      {product.description && (
        <div className="mt-4 rounded-xl bg-canvas p-3.5 ring-1 ring-line">
          <p className="flex items-center gap-1.5 text-sm font-semibold text-ink">
            <Archive className="size-4 text-gold-dark" aria-hidden="true" /> Komponen Termasuk:
          </p>
          <p className="line-clamp-2 pt-1 text-sm leading-6 text-ink-soft">{product.description}</p>
        </div>
      )}

      <div className="mt-auto">
        <div className="mt-4 border-t border-line pt-4">
          <p className="text-ink-soft">
            <span className="text-xl font-extrabold text-primary">{toNumber(price) > 0 ? formatRupiah(price) : 'Hubungi Admin'}</span>{' '}
            {toNumber(price) > 0 && <span className="text-sm">{showRent ? '/ unit / hari' : '/ unit'}</span>}
          </p>
          <p className={`flex items-center gap-1.5 pt-1 text-sm font-semibold ${stock > 0 ? 'text-success' : 'text-danger'}`}>
            <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
            {stock > 0 ? `Tersedia: ${stock} unit` : 'Stok sedang kosong'}
          </p>
        </div>
        <Link href={detailHref} className={buttonClasses({ fullWidth: true, className: 'mt-4 !h-11' })}>
          {showRent ? 'Cek Tanggal & Sewa' : 'Lihat Detail & Beli'} <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
