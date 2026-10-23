import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
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

interface ProductCardProps {
  product: Product;
  /** Opsional — jika tidak diberikan, default ke /catalog/:id */
  detailHref?: string;
  /** Opsional — menentukan apakah menampilkan harga sewa atau beli */
  mode?: CatalogMode;
}

/**
 * Global product card — digunakan di semua halaman (beranda, katalog, dll).
 * Layout: foto → kategori + nama → harga → tombol Pesan.
 */
export function ProductCard({ product, detailHref, mode = 'all' }: ProductCardProps) {
  const { id, name, category, basePriceBuy, basePriceRent, images, description } = product;
  const imageUrl = primaryImage(images);
  const href = detailHref ?? `/catalog/${id}`;

  const showRent = mode === 'sewa' || (mode === 'all' && canRent(product) && !canBuy(product));
  const price = showRent ? basePriceRent : basePriceBuy;
  const priceLabel = toNumber(price) > 0 ? formatRupiah(price) : null;
  const priceSuffix = showRent ? '/ hari' : '';

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-line-strong bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
      {/* ─── Foto Produk ─── */}
      <Link href={href} className="relative block aspect-[4/3] w-full overflow-hidden bg-beige-soft" tabIndex={-1} aria-hidden="true">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-primary/30">
            <ShoppingBag className="size-12" strokeWidth={1.25} aria-hidden="true" />
            <span className="text-xs font-medium">Foto belum tersedia</span>
          </div>
        )}
      </Link>

      {/* ─── Info Produk ─── */}
      <div className="flex flex-1 flex-col gap-0 p-4">
        {/* Nama */}
        <Link href={href}>
          <h3 className="line-clamp-2 text-sm font-bold leading-snug text-ink transition-colors group-hover:text-primary">
            {name}
          </h3>
        </Link>

        {/* Deskripsi singkat (opsional) */}
        {description && (
          <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-muted">{description}</p>
        )}

        {/* Spacer */}
        <div className="mt-auto" />

        {/* ─── Harga & Tombol Pesan (sejajar di bawah) ─── */}
        <div className="mt-3 flex items-center justify-between gap-2">
          {/* Harga */}
          <div>
            {priceLabel ? (
              <p className="text-sm font-extrabold text-primary">
                {priceLabel}
                {priceSuffix && (
                  <span className="ml-0.5 text-[10px] font-medium text-ink-soft">{priceSuffix}</span>
                )}
              </p>
            ) : (
              <p className="text-xs font-semibold italic text-muted">Hubungi kami</p>
            )}
          </div>

          {/* Tombol Pesan */}
          <Link
            href={href}
            className={buttonClasses({ size: 'sm', className: '!rounded-xl shrink-0' })}
          >
            Pesan
          </Link>
        </div>
      </div>
    </article>
  );
}
