import React from 'react';
import Link from 'next/link';
import { Product } from '@/types/product';
import { ProductGallery } from '../components/product-gallery';
import { ProductInfoPanel } from '../components/product-info-panel';
import { ProductAccordions } from '../components/product-accordions';
import { ProductCard } from '@/components/product/product-card';

interface ProductDetailViewProps {
  product: Product;
  relatedProducts?: Product[];
}

export function ProductDetailView({ product, relatedProducts = [] }: ProductDetailViewProps) {
  const categoryName = product.category?.name || product.subCategoryTag || 'Katalog Gaun & Couture';

  return (
    <div className="w-full min-h-screen bg-[#FAF7F2] py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs text-[#8C857B] mb-6 overflow-x-auto whitespace-nowrap">
          <Link href="/" className="hover:text-[#1C1C1C] transition-colors">
            Beranda
          </Link>
          <span>/</span>
          <Link href="/catalog" className="hover:text-[#1C1C1C] transition-colors">
            {categoryName}
          </Link>
          <span>/</span>
          <span className="font-bold text-[#1C1C1C]">{product.name}</span>
        </nav>

        {/* Main 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column (Gallery + Accordions) */}
          <div className="lg:col-span-7 flex flex-col">
            <ProductGallery images={product.images || []} title={product.name} />
            <ProductAccordions product={product} />
          </div>

          {/* Right Column (Interactive Booking Panel) */}
          <div className="lg:col-span-5 sticky top-24">
            <ProductInfoPanel product={product} />
          </div>

        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 pt-10 border-t border-[#E6E1DA]">
            <div className="mb-6">
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#1C1C1C] uppercase tracking-wider">
                MUNGKIN DISUKAI
              </h3>
              <p className="text-xs text-[#6B655C]">
                model yang mungkin anda sukai
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.slice(0, 4).map((rel) => (
                <ProductCard key={String(rel.id)} product={rel} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
