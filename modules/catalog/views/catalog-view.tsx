"use client";

import React, { useMemo, useState } from 'react';
import { ChevronDown, Download, MessageSquare, PackageSearch } from 'lucide-react';
import { Product, ProductCategory } from '@/types/product';
import { Button, ButtonLink } from '@/components/ui/button';
import { CtaBanner } from '@/components/ui/cta-banner';
import { EmptyState } from '@/components/ui/empty-state';
import { CatalogMode, ProductCard, canRent, rentStock, buyStock } from '@/components/product/product-card';
import { toNumber } from '@/lib/format';
import { CatalogFilter, PRICE_OPTIONS, PriceKey, SortKey } from '../components/catalog-filter';
import { RentalGuarantees } from '../components/tailoring-cta';
import { useCatalog } from '../hooks/use-catalog';

const PAGE_SIZE = 9;
const SIZE_ORDER = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];

interface CatalogViewProps {
  products: Product[];
  categories: ProductCategory[];
  mode: CatalogMode;
  initialQuery?: string;
  initialCategory?: string;
}

export function CatalogView({
  products: initialProducts,
  categories: initialCategories,
  mode,
  initialQuery = '',
  initialCategory = '',
}: CatalogViewProps) {
  const { products, categories } = useCatalog({
    initialProducts,
    initialCategories,
  });

  // The search box now lives in the navbar, so the query comes straight from the URL prop.
  // Using the prop directly (not useState) keeps the list in sync when the navbar search changes it.
  const query = initialQuery;

  const [category, setCategory] = useState(initialCategory);
  const [sort, setSort] = useState<SortKey>('newest');
  const [date, setDate] = useState('');
  const [price, setPrice] = useState<PriceKey>('all');
  const [availableOnly, setAvailableOnly] = useState(false);
  const [limit, setLimit] = useState(PAGE_SIZE);

  const pool = useMemo(() => (mode === 'sewa' ? products.filter(canRent) : products), [products, mode]);
  const priceOf = (p: Product) => toNumber(mode === 'sewa' || canRent(p) ? p.basePriceRent : p.basePriceBuy);
  const stockOf = (p: Product) => (mode === 'sewa' || canRent(p) ? rentStock(p) : buyStock(p));

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const range = PRICE_OPTIONS.find((o) => o.value === price) ?? PRICE_OPTIONS[0];

    const list = pool.filter((p) => {
      if (category && p.categoryId !== category) return false;
      if (q && ![p.name, p.description ?? '', p.sku ?? '', p.category?.name ?? ''].some((t) => t.toLowerCase().includes(q))) {
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
  }, [pool, query, category, price, availableOnly, sort, mode]);

  // Only categories that still have products; the filter component only needs id and name now
  const categoryChips = categories
    .filter((c) => pool.some((p) => p.categoryId === c.id))
    .map((c) => ({ id: c.id, name: c.name }));

  // const totalStock = pool.reduce((s, p) => s + stockOf(p), 0);
  // const sizes = Array.from(new Set(pool.flatMap((p) => p.variants.map((v) => v.size.toUpperCase()))));
  // const knownSizes = SIZE_ORDER.filter((s) => sizes.includes(s));
  // const sizeRange = knownSizes.length > 1 ? `Ukuran ${knownSizes[0]} - ${knownSizes.at(-1)}` : sizes.length ? `Ukuran ${sizes.join(', ')}` : null;

  const visible = filtered.slice(0, limit);
  const detailHref = (p: Product) => {
    const base = mode === 'sewa' ? `/rental/${p.id}` : `/catalog/${p.id}`;
    return date ? `${base}?date=${date}` : base;
  };

  const isRental = mode === 'sewa';
  const resetLimit = () => setLimit(PAGE_SIZE);

  return (
    <main>
      <CatalogFilter
        date={date}
        onDate={setDate}
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
      />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {visible.length > 0 ? (
          // Mobile: 2 columns with a tighter gap, tablet: 2 columns, desktop: 3 columns
          <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3">
            {visible.map((p) => (
              <ProductCard key={p.id} product={p} mode={mode} detailHref={detailHref(p)} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<PackageSearch className="size-7" aria-hidden="true" />}
            title={products.length === 0 ? 'Katalog belum tersedia' : 'Produk tidak ditemukan'}
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

        <div className="flex flex-col gap-8 pt-8">
          <RentalGuarantees />
        </div>
      </div>
    </main>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return <span className="rounded-lg border border-line bg-canvas px-3 py-2 text-[15px] text-ink">{children}</span>;
}