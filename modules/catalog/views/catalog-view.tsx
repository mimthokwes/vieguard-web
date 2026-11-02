"use client";

import React, { useMemo, useState } from 'react';
import { ArrowRight, ChevronDown, Download, MessageSquare, PackageSearch, PencilRuler } from 'lucide-react';
import { Product, ProductCategory, SmartSearchResult } from '@/types/product';
import { Button, ButtonLink } from '@/components/ui/button';
import { CtaBanner } from '@/components/ui/cta-banner';
import { EmptyState } from '@/components/ui/empty-state';
import { CatalogMode, ProductCard, canRent, canBuy, rentStock, buyStock } from '@/components/product/product-card';
import { toNumber } from '@/lib/format';
import { CatalogFilter, PRICE_OPTIONS, PriceKey, SortKey } from '../components/catalog-filter';
import { useCatalog } from '../hooks/use-catalog';

const PAGE_SIZE = 12;
const SIZE_ORDER = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];

interface CatalogViewProps {
  products: Product[];
  categories: ProductCategory[];
  mode: CatalogMode;
  initialQuery?: string;
  initialCategory?: string;
  smartResult?: SmartSearchResult | null;
}

export function CatalogView({
  products: initialProducts,
  categories: initialCategories,
  mode,
  initialQuery = '',
  initialCategory = '',
  smartResult = null,
}: CatalogViewProps) {
  const products = initialProducts;
  const categories = initialCategories;

  // The search box lives in navbar and query comes directly from URL prop
  const query = initialQuery;

  const [category, setCategory] = useState(initialCategory);
  const [sort, setSort] = useState<SortKey>('newest');
  const [price, setPrice] = useState<PriceKey>('all');
  const [availableOnly, setAvailableOnly] = useState(false);
  const [limit, setLimit] = useState(PAGE_SIZE);

  // Sync category and reset pagination limit when search query or initialCategory changes
  React.useEffect(() => {
    setCategory(initialCategory);
    setLimit(PAGE_SIZE);
  }, [initialQuery, initialCategory]);

  const pool = useMemo(() => {
    if (mode === 'sewa') return products.filter(canRent);
    if (mode === 'beli') return products.filter(canBuy);
    return products;
  }, [products, mode]);

  const priceOf = (p: Product) => toNumber(mode === 'sewa' ? p.basePriceRent : p.basePriceBuy);
  const stockOf = (p: Product) => (mode === 'sewa' ? rentStock(p) : buyStock(p));

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const range = PRICE_OPTIONS.find((o) => o.value === price) ?? PRICE_OPTIONS[0];

    const list = pool.filter((p) => {
      if (category && p.categoryId !== category) return false;
      // Jika smart search dari backend aktif, jangan batalkan hasil koreksi typo dengan string includes lokal
      if (!smartResult && q && ![p.name, p.description ?? '', p.sku ?? '', p.category?.name ?? ''].some((t) => t.toLowerCase().includes(q))) {
        return false;
      }
      const priceValue = priceOf(p);
      if (priceValue < range.min || priceValue >= range.max) return false;
      if (availableOnly && stockOf(p) <= 0) return false;
      return true;
    });

    const sorted = [...list];
    if (sort === 'price-asc') sorted.sort((a, b) => priceOf(a) - priceOf(b));
    if (sort === 'price-desc') sorted.sort((a, b) => priceOf(b) - priceOf(a));
    if (sort === 'stock') sorted.sort((a, b) => stockOf(b) - stockOf(a));
    return sorted;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pool, query, category, price, availableOnly, sort, mode, smartResult]);

  // Only categories that still have products; the filter component only needs id and name now
  const categoryChips = categories
    .filter((c) => pool.some((p) => p.categoryId === c.id))
    .map((c) => ({ id: c.id, name: c.name }));

  const visible = filtered.slice(0, limit);
  const detailHref = (p: Product) => {
    return mode === 'sewa' ? `/rental/${p.id}` : mode === 'beli' ? `/order/${p.id}` : `/catalog/${p.id}`;
  };

  const resetLimit = () => setLimit(PAGE_SIZE);

  return (
    <main className="pt-6 pb-12 sm:pt-8">

      <CatalogFilter
        price={price}
        onPrice={(v) => {
          setPrice(v);
          resetLimit();
        }}
        availableOnly={availableOnly}
        onAvailableOnly={(v) => {
          setAvailableOnly(v);
          resetLimit();
        }}
        sort={sort}
        onSort={setSort}
        categories={categoryChips}
        category={category}
        onCategory={(id) => {
          setCategory(id);
          resetLimit();
        }}
        totalProducts={filtered.length}
      />

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {visible.length > 0 ? (
          // Mobile: 2 kolom, tablet: 3 kolom, desktop: 4 kolom berjejer
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
            {visible.map((p) => (
              <ProductCard key={p.id} product={p} mode={mode} detailHref={detailHref(p)} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<PackageSearch className="size-7" aria-hidden="true" />}
            title={
              products.length === 0
                ? 'Katalog belum tersedia'
                : mode === 'beli'
                ? 'Belum ada produk pembelian'
                : 'Produk tidak ditemukan'
            }
            description={
              products.length === 0
                ? 'Data katalog belum bisa dimuat. Pastikan server backend berjalan atau coba beberapa saat lagi.'
                : 'Coba ubah filter harga atau kategori, atau gunakan kata kunci lain di kolom pencarian atas.'
            }
          />
        )}

        {filtered.length > limit && (
          <div className="flex justify-center pt-8">
            <Button variant="outline" onClick={() => setLimit((l) => l + PAGE_SIZE)} className="border-line shadow-soft">
              <ChevronDown className="size-4" aria-hidden="true" /> Tampilkan {Math.min(PAGE_SIZE, filtered.length - limit)} Lainnya
            </Button>
          </div>
        )}

        {mode === 'beli' && (
          <div className="pt-8">
            <aside className="flex flex-col gap-4 rounded-2xl bg-surface p-5 shadow-card ring-1 ring-line sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3.5">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-beige-soft text-primary">
                  <PencilRuler className="size-5" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="font-bold text-ink text-sm sm:text-base">Punya Desain Seragam Sendiri?</h3>
                  <p className="text-xs text-ink-soft">
                    Ajukan pesanan custom dengan model & bahan pilihan Anda. Desain akan ditinjau langsung oleh admin.
                  </p>
                </div>
              </div>
              <ButtonLink href="/custom" variant="outline" size="sm" className="shrink-0 !border-primary !text-primary hover:!bg-primary/5">
                Ajukan Pesanan Custom <ArrowRight className="size-4" aria-hidden="true" />
              </ButtonLink>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return <span className="rounded-lg border border-line bg-canvas px-3 py-2 text-[15px] text-ink">{children}</span>;
}