import React from 'react';
import { Product } from '@/types/product';
import { ProductCard } from '@/components/product/product-card';
import { EmptyState } from '@/components/ui/empty-state';
import { CatalogFilter } from '../components/catalog-filter';
import { TailoringCta } from '../components/tailoring-cta';

interface CatalogViewProps {
  products: Product[];
}

export function CatalogView({ products }: CatalogViewProps) {
  return (
    <div className="w-full min-h-screen bg-[#FAF7F2] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Title */}
        <div className="mb-6">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1C1C1C]">
            Katalog Koleksi Busana
          </h1>
          <p className="text-xs sm:text-sm text-[#6B655C] mt-1">
            Temukan gaun pesta desainer, beskap adat, batik tulis, dan jas premium untuk momen istimewa Anda.
          </p>
        </div>

        {/* Filter Bar */}
        <CatalogFilter />

        {/* Products Grid */}
        {products.length === 0 ? (
          <EmptyState
            title="Tidak Ada Produk Ditemukan"
            description="Maaf, tidak ada busana yang sesuai dengan kata kunci atau filter yang Anda pilih. Silakan coba filter lainnya."
            actionText="Lihat Semua Koleksi"
            actionHref="/catalog"
          />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((prod) => (
                <ProductCard key={String(prod.id)} product={prod} />
              ))}
            </div>

            {/* Pagination Bar */}
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-[#E6E1DA] text-xs text-[#6B655C]">
              <p>Menampilkan 1 - {products.length} dari {products.length} produk busana</p>
              <div className="flex items-center gap-1.5 font-bold">
                <button className="w-8 h-8 rounded-lg bg-white border border-[#E6E1DA] flex items-center justify-center text-[#1C1C1C] hover:bg-[#FAF7F2]">
                  ‹
                </button>
                <button className="w-8 h-8 rounded-lg bg-[#1C1C1C] text-white flex items-center justify-center">
                  1
                </button>
                <button className="w-8 h-8 rounded-lg bg-white border border-[#E6E1DA] flex items-center justify-center text-[#1C1C1C] hover:bg-[#FAF7F2]">
                  2
                </button>
                <button className="w-8 h-8 rounded-lg bg-white border border-[#E6E1DA] flex items-center justify-center text-[#1C1C1C] hover:bg-[#FAF7F2]">
                  ›
                </button>
              </div>
            </div>
          </>
        )}

        {/* Custom Tailoring CTA */}
        <TailoringCta />

      </div>
    </div>
  );
}
