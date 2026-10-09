"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { Heart, Sparkles } from 'lucide-react';
import { ProductImage } from '@/types/product';
import { formatImageUrl } from '@/lib/image';

interface ProductGalleryProps {
  images?: ProductImage[];
  title: string;
}

export function ProductGallery({ images = [], title }: ProductGalleryProps) {
  const defaultLabels = ['Tampak Depan', 'Detail Drapery', 'Fitting Room', 'Serat Sutra'];

  const formattedImages = images.length > 0 
    ? images.map((img, idx) => ({
        id: String(img.id || idx),
        imageUrl: formatImageUrl(img.imageUrl),
        label: defaultLabels[idx % defaultLabels.length],
      }))
    : [
        { id: '1', imageUrl: formatImageUrl(null), label: 'Tampak Depan' },
        { id: '2', imageUrl: formatImageUrl(null), label: 'Detail Drapery' },
        { id: '3', imageUrl: formatImageUrl(null), label: 'Fitting Room' },
        { id: '4', imageUrl: formatImageUrl(null), label: 'Serat Sutra' },
      ];

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const currentImage = formattedImages[selectedImageIndex]?.imageUrl || formatImageUrl(null);

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image View */}
      <div className="relative w-full aspect-[3/4] rounded-3xl overflow-hidden bg-[#FAF7F2] border border-[#E6E1DA] shadow-lg">
        <Image
          src={currentImage}
          alt={title}
          fill
          className="object-cover transition-opacity duration-300"
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
        />

        {/* Badges in Figma */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
          <span className="bg-[#161616]/90 backdrop-blur-md text-white text-[10px] font-extrabold uppercase px-3 py-1 rounded-md tracking-widest shadow-sm">
            SEWA & BELI TERSEDIA
          </span>
          <span className="bg-white/90 backdrop-blur-md text-[#C48B54] border border-[#DDB892] text-[10px] font-extrabold uppercase px-3 py-1 rounded-md tracking-widest shadow-sm flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#C48B54]" />
            <span>BEST SELLER ATELIER</span>
          </span>
        </div>

        {/* Wishlist Button */}
        <button
          type="button"
          aria-label="Wishlist"
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-[#1C1C1C] hover:bg-white hover:text-red-500 transition-colors shadow-sm cursor-pointer"
        >
          <Heart className="w-5 h-5" />
        </button>

        {/* Product Code Tag at bottom right matching Figma */}
        <div className="absolute bottom-4 right-4 text-[10px] font-mono tracking-wider text-[#1C1C1C]/70 bg-white/70 backdrop-blur-sm px-2.5 py-1 rounded-md border border-white/50">
          MOD-2025-EMR09
        </div>
      </div>

      {/* Thumbnails Row (4 Thumbnails matching Figma) */}
      <div className="grid grid-cols-4 gap-3">
        {formattedImages.slice(0, 4).map((img, idx) => {
          const isSelected = selectedImageIndex === idx;
          return (
            <button
              key={img.id}
              type="button"
              onClick={() => setSelectedImageIndex(idx)}
              className={`relative aspect-square rounded-2xl overflow-hidden border-2 transition-all cursor-pointer ${
                isSelected ? 'border-[#C48B54] ring-2 ring-[#C48B54]/30 scale-95' : 'border-[#E6E1DA] opacity-80 hover:opacity-100'
              }`}
            >
              <Image
                src={img.imageUrl}
                alt={img.label}
                fill
                className="object-cover"
                sizes="150px"
              />
              <div className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[9px] font-semibold text-center py-1 backdrop-blur-sm truncate px-1">
                {img.label}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

