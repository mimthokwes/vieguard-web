import React from 'react';
import { Gift } from 'lucide-react';
import { Product } from '@/types/product';
import { Breadcrumb } from '@/components/layout/breadcrumb';
import { PageContainer } from '@/components/layout/page-header';
import { canBuy, canRent, rentStock, buyStock } from '@/components/product/product-card';
import { formatRupiah } from '@/lib/format';
import { ProductGallery } from '../components/product-gallery';
import { ProductTabs } from '../components/product-accordions';
import { BookingPanel } from '../components/product-info-panel';

interface ProductDetailViewProps {
  product: Product;
  mode: 'sewa' | 'all';
  initialDate?: string;
  isLoggedIn: boolean;
  currentPath: string;
}

export function ProductDetailView({ product, mode, initialDate, isLoggedIn, currentPath }: ProductDetailViewProps) {
  const rentable = canRent(product);
  const buyable = canBuy(product);
  const modes: ('sewa' | 'beli')[] = mode === 'sewa' ? ['sewa'] : [...(rentable ? ['sewa' as const] : []), ...(buyable ? ['beli' as const] : [])];
  const primaryMode = modes[0];
  const stock = primaryMode === 'beli' ? buyStock(product) : rentStock(product);
  const price = primaryMode === 'beli' ? product.basePriceBuy : product.basePriceRent;

  return (
    <PageContainer>
      <Breadcrumb
        items={[
          mode === 'sewa' ? { label: 'Katalog Sewa', href: '/rental' } : { label: 'Katalog', href: '/catalog' },
          { label: mode === 'sewa' ? 'Detail Armada & Booking' : product.name },
        ]}
      />

      <div className="grid grid-cols-1 gap-6 pt-8 lg:grid-cols-[1fr_492px]">
        <div className="flex flex-col gap-8">
          <ProductGallery product={product} availabilityLabel={stock > 0 ? (primaryMode === 'beli' ? 'Tersedia untuk Dibeli' : 'Tersedia untuk Disewa') : 'Stok Sedang Kosong'} />

          <section className="rounded-2xl bg-surface p-6 shadow-card ring-1 ring-line">
            <p className="flex flex-wrap items-center gap-2 text-xs text-ink-soft">
              {product.category && <span className="rounded bg-beige-soft px-2 py-0.5 font-semibold text-primary">Kategori: {product.category.name}</span>}
              <span>• Siap Pakai {stock} Unit</span>
            </p>
            <h1 className="pt-3 text-3xl font-extrabold leading-tight tracking-tight text-ink sm:text-4xl">{product.name}</h1>
            {primaryMode && (
              <div className="mt-5 flex flex-wrap items-center gap-3 rounded-xl bg-canvas px-4 py-4">
                <p className="text-ink-soft">
                  <span className="text-4xl font-extrabold text-primary">{formatRupiah(price)}</span>{' '}
                  <span className="text-sm">{primaryMode === 'sewa' ? '/ unit / hari' : '/ unit'}</span>
                </p>
                {rentable && buyable && mode === 'all' && (
                  <span className="flex items-center gap-1.5 rounded-full bg-warning-bg px-3 py-1 text-[13px] font-semibold text-gold-dark">
                    <Gift className="size-3.5" aria-hidden="true" /> Bisa disewa atau dibeli
                  </span>
                )}
              </div>
            )}
          </section>

          <ProductTabs product={product} />
        </div>

        <aside className="lg:sticky lg:top-28 lg:h-fit">
          {modes.length > 0 ? (
            <BookingPanel
              product={product}
              modes={modes}
              initialDate={initialDate}
              isLoggedIn={isLoggedIn}
              loginHref={`/login?next=${encodeURIComponent(currentPath)}`}
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
