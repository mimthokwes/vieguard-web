import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Product } from '@/types/product';
import { ProductCard } from '@/components/product/product-card';

interface StylistPicksSectionProps {
  products: Product[];
}

export function StylistPicksSection({ products }: StylistPicksSectionProps) {
  return (
    <section className="w-full py-12 bg-white border-b border-[#E6E1DA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1C1C1C]">
              Tren Pilihan Stylist
            </h2>
            <p className="text-xs sm:text-sm text-[#6B655C] mt-1">
              Paling banyak dipesan & disewa minggu ini
            </p>
          </div>
          <Link
            href="/catalog"
            className="text-xs font-bold text-[#1C1C1C] hover:text-[#C48B54] flex items-center gap-1 transition-colors whitespace-nowrap"
          >
            <span>Lihat semua produk</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {products.slice(0, 5).map((prod) => (
            <ProductCard key={String(prod.id)} product={prod} />
          ))}
        </div>

      </div>
    </section>
  );
}
