"use client";

import React, { useState } from 'react';
import { Gift } from 'lucide-react';
import { Product } from '@/types/product';
import { PageContainer } from '@/components/layout/page-header';
import { canBuy, canRent, rentStock, buyStock } from '@/components/product/product-card';
import { formatRupiah } from '@/lib/format';
import { ProductGallery } from '../components/product-gallery';
import { ProductTabs, SizeFileAttachment } from '../components/product-accordions';
import { BookingPanel } from '../components/product-info-panel';

interface ProductDetailViewProps {
  product: Product;
  mode: 'sewa' | 'all' | 'beli';
  initialDate?: string;
  isLoggedIn: boolean;
  currentPath: string;
}

export function ProductDetailView({ product, mode, initialDate, isLoggedIn, currentPath }: ProductDetailViewProps) {
  const rentable = canRent(product);
  const buyable = canBuy(product);
  const modes: ('sewa' | 'beli')[] =
    mode === 'sewa'
      ? ['sewa']
      : mode === 'beli'
      ? ['beli']
      : [...(rentable ? ['sewa' as const] : []), ...(buyable ? ['beli' as const] : [])];
  const primaryMode = modes[0] ?? (buyable ? 'beli' : 'sewa');
  const stock = primaryMode === 'beli' ? buyStock(product) : rentStock(product);
  const price = primaryMode === 'beli' ? product.basePriceBuy : product.basePriceRent;

  const [sizeFile, setSizeFile] = useState<SizeFileAttachment | null>(null);
  const [activeTab, setActiveTab] = useState<'components' | 'sizes'>('components');

  return (
    <PageContainer>
      <div className="grid grid-cols-1 gap-6 pt-6 sm:pt-8 lg:grid-cols-[1fr_492px]">
        <div className="flex flex-col gap-6 sm:gap-8">
          <ProductGallery
            product={product}
            availabilityLabel={
              primaryMode === 'beli'
                ? 'Tersedia untuk Pre-Order'
                : stock > 0
                ? 'Tersedia untuk Disewa'
                : 'Stok Sedang Kosong'
            }
          />

          <section className="rounded-2xl bg-surface p-4 sm:p-6 shadow-card ring-1 ring-line">
            <p className="flex flex-wrap items-center gap-2 text-xs text-ink-soft">
              {product.category && (
                <span className="rounded bg-beige-soft px-2 py-0.5 font-semibold text-primary">
                  Kategori: {product.category.name}
                </span>
              )}
              <span>• {primaryMode === 'beli' ? 'Skema Pre-Order (Dipesan Baru Dibuat)' : `Siap Pakai ${stock} Unit`}</span>
            </p>
            <h1 className="pt-2 sm:pt-3 text-xl sm:text-2xl md:text-3xl font-extrabold leading-tight tracking-tight text-ink break-words">
              {product.name}
            </h1>
            {primaryMode && (
              <div className="mt-3 sm:mt-5 flex flex-wrap items-baseline gap-2 sm:gap-3 rounded-xl bg-canvas p-3 sm:px-4 sm:py-4">
                <span className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-primary">
                  {formatRupiah(price)}
                </span>
                <span className="text-xs sm:text-sm text-ink-soft">
                  {primaryMode === 'sewa' ? '/ unit / hari' : '/ unit'}
                </span>
                {rentable && buyable && mode === 'all' && (
                  <span className="flex items-center gap-1.5 rounded-full bg-warning-bg px-2.5 py-0.5 text-xs font-semibold text-gold-dark mt-1 sm:mt-0">
                    <Gift className="size-3.5" aria-hidden="true" /> Bisa disewa atau dibeli
                  </span>
                )}
              </div>
            )}
          </section>

          <ProductTabs
            product={product}
            mode={primaryMode}
            sizeFile={sizeFile}
            onSizeFileChange={setSizeFile}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </div>

        <aside className="lg:sticky lg:top-28 lg:h-fit">
          {modes.length > 0 ? (
            <BookingPanel
              product={product}
              modes={modes}
              initialDate={initialDate}
              isLoggedIn={isLoggedIn}
              loginHref={`/login?next=${encodeURIComponent(currentPath)}`}
              sizeFile={sizeFile}
              onSizeFileChange={setSizeFile}
              onOpenSizeTab={() => {
                setActiveTab('sizes');
                const el = document.getElementById('product-tabs');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            />
          ) : (
            <p className="rounded-2xl bg-surface p-6 text-sm text-ink-soft shadow-card ring-1 ring-line">
              Produk ini belum memiliki harga. Hubungi admin melalui Obrolan untuk penawaran.
            </p>
          )}
        </aside>
      </div>
    </PageContainer>
  );
}
