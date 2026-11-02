import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Shirt } from 'lucide-react';
import { Product } from '@/types/product';
import { buttonClasses } from '@/components/ui/button';
import { formatRupiah, toNumber } from '@/lib/format';
import { primaryImage } from '@/lib/image';

export type CatalogMode = 'all' | 'sewa' | 'beli';

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

export function isBuyOnly(product: Product) {
  return canBuy(product) && !canRent(product);
}

export function isRentOnly(product: Product) {
  return canRent(product) && !canBuy(product);
}

interface ProductCardProps {
  product: Product;
  /** Opsional — jika tidak diberikan, default ke /catalog/:id, /rental/:id, atau /order/:id */
  detailHref?: string;
  /** Opsional — menentukan apakah menampilkan harga sewa, beli, atau semua */
  mode?: CatalogMode;
}

/**
 * Global product card — digunakan di semua halaman (beranda, katalog, pembelian, sewa).
 * Layout: foto → kategori + nama → harga → tombol Pesan.
 */
export function ProductCard({ product, detailHref, mode = 'all' }: ProductCardProps) {
  const { id, name, category, basePriceBuy, basePriceRent, images, description } = product;
  const imageUrl = primaryImage(images);
  const href = detailHref ?? (mode === 'sewa' ? `/rental/${id}` : mode === 'beli' ? `/order/${id}` : `/catalog/${id}`);

  const showRent = mode === 'sewa' || (mode === 'all' && isRentOnly(product));
  const price = showRent ? basePriceRent : basePriceBuy;
  const priceLabel = toNumber(price) > 0 ? formatRupiah(price) : null;
  const priceSuffix = showRent ? '/ hari' : '';
  const isPreorder = mode === 'beli' || (!showRent && canBuy(product));
  // console.log(name, images, imageUrl);

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-line bg-surface shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-primary/40">
      {/* ─── Foto Produk ─── */}
      <Link href={href} className="relative block aspect-4/3 w-full overflow-hidden bg-beige-soft" tabIndex={-1} aria-hidden="true">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            unoptimized
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-1.5 text-primary/30">
            <Shirt className="size-8" strokeWidth={1.25} aria-hidden="true" />
            <span className="text-[11px] font-medium">Foto belum ada</span>
          </div>
        )}
        {mode === 'beli' ? (
          <span className="absolute top-2 left-2 z-10 rounded-md bg-primary/95 px-2 py-0.5 text-[10px] font-bold text-white shadow-xs backdrop-blur-xs">
            Pre-Order
          </span>
        ) : mode === 'sewa' ? (
          <span className="absolute top-2 left-2 z-10 rounded-md bg-gold-dark/95 px-2 py-0.5 text-[10px] font-bold text-white shadow-xs backdrop-blur-xs">
            Sewa
          </span>
        ) : isBuyOnly(product) ? (
          <span className="absolute top-2 left-2 z-10 rounded-md bg-primary/95 px-2 py-0.5 text-[10px] font-bold text-white shadow-xs backdrop-blur-xs">
            Pre-Order
          </span>
        ) : isRentOnly(product) ? (
          <span className="absolute top-2 left-2 z-10 rounded-md bg-gold-dark/95 px-2 py-0.5 text-[10px] font-bold text-white shadow-xs backdrop-blur-xs">
            Sewa
          </span>
        ) : null}
      </Link>

      {/* ─── Info Produk ─── */}
      <div className="flex flex-1 flex-col p-3">
        {/* Nama Produk */}
        <Link href={href}>
          <h3 className="line-clamp-2 text-xs sm:text-[13px] font-bold leading-snug text-ink transition-colors group-hover:text-primary">
            {name}
          </h3>
        </Link>

        {/* Spacer */}
        <div className="mt-auto" />

        {/* ─── Harga & Tombol Pesan ─── */}
        <div className="mt-2.5 flex items-center justify-between gap-1.5 pt-1">
          {/* Harga */}
          <div className="min-w-0">
            {priceLabel ? (
              <p className="truncate text-xs sm:text-sm font-extrabold text-primary">
                {priceLabel}
                {priceSuffix && (
                  <span className="ml-0.5 text-[10px] font-medium text-ink-soft">{priceSuffix}</span>
                )}
              </p>
            ) : (
              <p className="text-[11px] font-semibold italic text-muted">Hubungi kami</p>
            )}
          </div>

          {/* Tombol Pesan Compact */}
          <Link
            href={href}
            className="inline-flex shrink-0 items-center justify-center rounded-lg bg-primary px-2.5 py-1 text-xs font-semibold text-on-primary transition-all hover:bg-primary-hover active:scale-95"
          >
            {mode === 'beli' ? 'Beli' : mode === 'sewa' ? 'Sewa' : 'Pesan'}
          </Link>
        </div>
      </div>
    </article>
  );
}
