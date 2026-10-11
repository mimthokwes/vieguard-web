import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Product } from '@/types/product';
import { ProductCard } from '@/components/product/product-card';

interface RecommendedSectionProps {
  products: Product[];
}

export function RecommendedSection({ products }: RecommendedSectionProps) {
  return (
    <section className="w-full py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-[#1A1714] sm:text-xl">
              Rekomendasi Untuk Anda
            </h2>
            <p className="mt-1 text-xs text-[#8C857B] sm:text-[13px]">
              Disesuaikan dengan selera dan agenda istimewa Anda
            </p>
          </div>
          <Link
            href="/catalog"
            className="flex shrink-0 items-center gap-1 pt-1 text-xs font-medium text-[#6F675D] transition-colors hover:text-[#1A1714]"
          >
            <span className="hidden sm:inline">Lihat semua rekomendasi</span>
            <span className="sm:hidden">Lihat semua</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Product grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
            {products.slice(0, 5).map((prod) => (
              <ProductCard
                key={String(prod.id)}
                product={prod}
                variant="compact"
                showBadge={false}
              />
            ))}
          </div>
        ) : (
          <p className="rounded-xl border border-dashed border-[#E8E1D6] py-10 text-center text-sm text-[#8C857B]">
            Belum ada rekomendasi untuk ditampilkan.
          </p>
        )}
      </div>
    </section>
  );
}