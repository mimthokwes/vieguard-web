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
}

export function ProductCard({ product, showBuyPrice = true, variant = 'full' }: ProductCardProps) {
  const rawImage = product.images?.find((img) => img.isPrimary)?.imageUrl || product.images?.[0]?.imageUrl;
  const primaryImage = formatImageUrl(rawImage);

  const badgeText = product.badgeTag || (product.basePriceBuy ? 'SEWA / BELI' : 'SEWA');
  const categoryName = product.category?.name || product.subCategoryTag || 'GAUN & COUTURE';
  
  const formattedRentPrice = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(product.basePriceRent3d || 350000);

  const formattedBuyPrice = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(product.basePriceBuy || 1450000);

  const rating = product.rating || 4.9;
  const likesCount = product.likesCount || 128;

  return (
    <div className="group bg-card rounded-[20px] p-3.5 sm:p-4 border border-[#E6E1DA] hover:border-[#C48B54] hover:shadow-xl transition-all duration-300 flex flex-col justify-between h-full relative">
      <div>
        {/* Image Container */}
        <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden bg-[#FAF7F2] mb-3.5">
          <Image
            src={primaryImage}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />

          {/* Badge */}
          <div className="absolute top-3 left-3 bg-[#161616]/90 backdrop-blur-md text-white text-[10px] font-bold uppercase px-2.5 py-1 rounded-md tracking-wider">
            {badgeText}
          </div>

          {/* Wishlist Capsule Button with Likes Count (matching Figma) */}
          <button
            type="button"
            aria-label="Simpan ke favorit"
            className="absolute top-3 right-3 bg-white/90 backdrop-blur-md hover:bg-white text-[#1C1C1C] hover:text-red-500 px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm transition-all cursor-pointer"
          >
            <Heart className="w-3.5 h-3.5 fill-red-500 text-red-500" />
            <span className="text-[11px]">{likesCount}</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-1 px-1">
          <span className="text-[10px] font-bold tracking-widest text-[#C48B54] uppercase">
            {categoryName}
          </span>
          <Link href={`/catalog/${product.id}`} className="group-hover:text-[#C48B54] transition-colors">
            <h3 className="font-serif font-bold text-base text-[#1C1C1C] line-clamp-1 leading-snug">
              {product.name}
            </h3>
          </Link>

          {/* Truncated Description snippet if available */}
          {product.description && (
            <p className="text-[11px] text-[#6B655C] line-clamp-2 mt-0.5 leading-relaxed">
              {product.description}
            </p>
          )}

          {/* Rating */}
          <div className="flex items-center gap-1.5 text-xs text-[#6B655C] my-1">
            <div className="flex items-center text-amber-500 font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 mr-0.5 inline" />
              <span>{rating}</span>
            </div>
            <span className="text-[11px] text-[#8C857B]">({likesCount} orang menyukai model ini)</span>
          </div>
        </div>
      </div>

      {/* Pricing & Actions */}
      <div className="mt-3 pt-3 border-t border-[#F3EDE6] flex flex-col gap-2.5 px-1">
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-[9px] uppercase text-[#8C857B] block font-bold tracking-wider">
              SEWA 3 HARI
            </span>
            <span className="font-bold text-sm text-[#1C1C1C]">
              {formattedRentPrice}
            </span>
          </div>
          {showBuyPrice && product.basePriceBuy > 0 && (
            <div className="text-right">
              <span className="text-[9px] uppercase text-[#8C857B] block font-bold tracking-wider">
                HARGA BELI
              </span>
              <span className="text-xs text-[#6B655C] font-semibold">
                {formattedBuyPrice}
              </span>
            </div>
          )}
        </div>

        {variant === 'full' ? (
          <Link href={`/catalog/${product.id}`} className="mt-1">
            <button className="w-full bg-[#161616] hover:bg-[#C48B54] text-white text-xs font-bold py-2.5 px-3 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm">
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Pesan / Sewa Sekarang</span>
            </button>
          </Link>
        ) : (
          <Link href={`/catalog/${product.id}`} className="self-end mt-1">
            <div className="w-8 h-8 rounded-lg bg-[#FAF7F2] border border-[#E6E1DA] hover:bg-[#161616] hover:text-white text-[#1C1C1C] flex items-center justify-center transition-colors">
              <Plus className="w-4 h-4" />
            </div>
          </Link>
        )}
      </div>
    </div>
  );
}

