import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types/product';
import { formatImageUrl } from '@/lib/image';
import { Heart, Plus, ShoppingBag, Star } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  showBuyPrice?: boolean;
  variant?: 'compact' | 'full';
  showBadge?: boolean;
}

const formatRupiah = (value: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value);

export function ProductCard({
  product,
  showBuyPrice = true,
  variant = 'full',
  showBadge = true,
}: ProductCardProps) {
  const rawImage =
    product.images?.find((img) => img.isPrimary)?.imageUrl ||
    product.images?.[0]?.imageUrl;
  const primaryImage = formatImageUrl(rawImage);

  const rent = Number(product.basePriceRent3d) || 0;
  const buy = Number(product.basePriceBuy) || 0;
  const rating = Number(product.rating) || 0;
  const likes = Number(product.likesCount) || 0;

  const badgeText = product.badgeTag || (buy > 0 ? 'SEWA / BELI' : 'SEWA');
  // Rental badges are dark, "buy / special" badges use the accent color
  const badgeClass = badgeText.toUpperCase().startsWith('SEWA')
    ? 'bg-[#161616]/85'
    : 'bg-[#C4563A]';

  const categoryName = product.category?.name || product.subCategoryTag;

  // One primary price, like the design: rent first, otherwise buy price
  const primaryPrice =
    rent > 0
      ? { label: 'Sewa 3 Hari', value: rent }
      : buy > 0
        ? { label: 'Harga Beli', value: buy }
        : null;

  const detailHref = `/catalog/${product.id}`;

  return (
    <div className="group relative flex h-full flex-col rounded-xl border border-[#E8E1D6] bg-white p-3 transition-shadow duration-300 hover:shadow-[0_12px_28px_-16px_rgba(40,25,10,0.35)]">
      {/* Image */}
      <div className="relative">
        <Link
          href={detailHref}
          className="relative block aspect-[4/5] overflow-hidden rounded-lg bg-[#F3ECE2]"
        >
          <Image
            src={primaryImage}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>

        {showBadge && (
          <span
            className={`pointer-events-none absolute left-2.5 top-2.5 rounded-md px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-white backdrop-blur-sm ${badgeClass}`}
          >
            {badgeText}
          </span>
        )}

        {/* Wishlist: sibling of the image Link, so no interactive element is nested */}
        <button
          type="button"
          aria-label="Simpan ke favorit"
          className="absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-[#1A1714] shadow-sm backdrop-blur-sm transition-colors hover:bg-white hover:text-[#C4563A]"
        >
          <Heart className="h-4 w-4" strokeWidth={1.75} />
        </button>
      </div>

      {/* Info */}
      <div className="mt-3 flex flex-1 flex-col gap-1 px-0.5">
        {categoryName && (
          <span className="text-[10px] font-medium uppercase tracking-wide text-[#8C857B]">
            {categoryName}
          </span>
        )}

        <Link href={detailHref}>
          <h3 className="line-clamp-1 text-sm font-semibold text-[#1A1714] transition-colors group-hover:text-[#C4563A]">
            {product.name}
          </h3>
        </Link>

        {rating > 0 && (
          <div className="flex items-center gap-1.5 text-xs">
            <span className="flex items-center gap-1 font-semibold text-[#E08A1E]">
              <Star className="h-3 w-3 fill-current" />
              {rating.toFixed(1)}
            </span>
            {likes > 0 && (
              <span className="text-[11px] text-[#A39B90]">({likes} suka)</span>
            )}
          </div>
        )}
      </div>

      {/* Price + action */}
      <div className="mt-3 border-t border-[#F1ECE4] pt-3">
        <div className="flex items-end justify-between gap-2 px-0.5">
          <div className="min-w-0">
            <span className="block text-[11px] text-[#8C857B]">
              {primaryPrice ? primaryPrice.label : 'Harga'}
            </span>
            <span className="block truncate text-[15px] font-bold text-[#1A1714]">
              {primaryPrice ? formatRupiah(primaryPrice.value) : 'Hubungi kami'}
            </span>
          </div>

          {variant === 'compact' ? (
            <Link
              href={detailHref}
              aria-label={`Lihat detail ${product.name}`}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#E8E1D6] bg-white text-[#1A1714] transition-colors hover:border-[#161616] hover:bg-[#161616] hover:text-white"
            >
              <Plus className="h-4 w-4" />
            </Link>
          ) : (
            showBuyPrice &&
            rent > 0 &&
            buy > 0 && (
              <div className="text-right">
                <span className="block text-[11px] text-[#8C857B]">Harga Beli</span>
                <span className="block text-xs font-semibold text-[#5F584F]">
                  {formatRupiah(buy)}
                </span>
              </div>
            )
          )}
        </div>

        {variant === 'full' && (
          <Link
            href={detailHref}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-[#161616] px-3 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#2E2A26]"
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            Pesan / Sewa Sekarang
          </Link>
        )}
      </div>
    </div>
  );
}