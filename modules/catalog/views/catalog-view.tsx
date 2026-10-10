"use client";

import React, { useMemo, useState } from 'react';
import { ChevronDown, CircleCheck, Download, MessageSquare, PackageSearch, ShieldCheck } from 'lucide-react';
import { Product, ProductCategory } from '@/types/product';
import { Breadcrumb } from '@/components/layout/breadcrumb';
import { Button, ButtonLink } from '@/components/ui/button';
import { CtaBanner } from '@/components/ui/cta-banner';
import { EmptyState } from '@/components/ui/empty-state';
import { CatalogMode, ProductCard, canRent, rentStock, buyStock } from '@/components/product/product-card';
import { toNumber } from '@/lib/format';
import { CatalogFilter, SortKey } from '../components/catalog-filter';
import { RentalGuarantees } from '../components/tailoring-cta';

const PAGE_SIZE = 9;
const SIZE_ORDER = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];

interface CatalogViewProps {
  products: Product[];
  categories: ProductCategory[];
  mode: CatalogMode;
  initialQuery?: string;
  initialCategory?: string;
}

export function CatalogView({ products, categories, mode, initialQuery = '', initialCategory = '' }: CatalogViewProps) {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory);
  const [sort, setSort] = useState<SortKey>('newest');
  const [date, setDate] = useState('');
  const [limit, setLimit] = useState(PAGE_SIZE);

  const pool = useMemo(() => (mode === 'sewa' ? products.filter(canRent) : products), [products, mode]);
  const priceOf = (p: Product) => toNumber(mode === 'sewa' || canRent(p) ? p.basePriceRent : p.basePriceBuy);
  const stockOf = (p: Product) => (mode === 'sewa' || canRent(p) ? rentStock(p) : buyStock(p));

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = pool.filter(
      (p) =>
        (!category || p.categoryId === category) &&
        (!q || [p.name, p.description ?? '', p.sku ?? '', p.category?.name ?? ''].some((t) => t.toLowerCase().includes(q)))
    );
    const sorted = [...list];
    if (sort === 'price-asc') sorted.sort((a, b) => priceOf(a) - priceOf(b));
    if (sort === 'price-desc') sorted.sort((a, b) => priceOf(b) - priceOf(a));
    if (sort === 'stock') sorted.sort((a, b) => stockOf(b) - stockOf(a));
    return sorted;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pool, query, category, sort]);

  const categoryChips = categories
    .map((c) => ({ id: c.id, name: c.name, count: pool.filter((p) => p.categoryId === c.id).length }))
    .filter((c) => c.count > 0);

  const totalStock = pool.reduce((s, p) => s + stockOf(p), 0);
  const sizes = Array.from(new Set(pool.flatMap((p) => p.variants.map((v) => v.size.toUpperCase()))));
  const knownSizes = SIZE_ORDER.filter((s) => sizes.includes(s));
  const sizeRange = knownSizes.length > 1 ? `Ukuran ${knownSizes[0]} - ${knownSizes.at(-1)}` : sizes.length ? `Ukuran ${sizes.join(', ')}` : null;

  const visible = filtered.slice(0, limit);
  const detailHref = (p: Product) => {
    const base = mode === 'sewa' ? `/rental/${p.id}` : `/catalog/${p.id}`;
    return date ? `${base}?date=${date}` : base;
  };

  const isRental = mode === 'sewa';

  return (
    <main>
      <div className="mx-auto max-w-7xl px-4 pb-6 pt-8 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: isRental ? 'Penyewaan Armada' : 'Katalog Produk' }]} />
        <div className="flex flex-col gap-6 pt-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-ink">
              {isRental ? 'Katalog Penyewaan Armada Seragam, Topi Shako & Instrumen Marching Band' : 'Katalog Seragam & Perlengkapan Drum Band'}
            </h1>
            <p className="pt-2 text-base leading-relaxed text-ink-soft">
              {isRental
                ? 'Solusi cepat untuk festival, karnaval hari besar nasional, dan seragam darurat. Bersih, steril, dan inspeksi fungsi terjamin.'
                : 'Set seragam siap pakai, bendera color guard, topi shako, sepatu parade — tersedia untuk dibeli maupun disewa.'}
            </p>
          </div>
          <div className="flex max-w-sm flex-wrap gap-2">
            {totalStock > 0 && <Chip>{totalStock}+ Unit Siap Pakai</Chip>}
            {sizeRange && <Chip>{sizeRange}</Chip>}
            <span className="flex items-center gap-1.5 rounded-lg border border-gold-light bg-warning-bg px-3 py-2 text-[15px] text-gold-dark">
              <span className="size-1.5 rounded-full bg-gold" aria-hidden="true" /> Pengiriman Kilat H-2
            </span>
          </div>
        </div>
      </div>

      <CatalogFilter
        query={query}
        onQuery={(v) => {
          setQuery(v);
          setLimit(PAGE_SIZE);
        }}
        date={date}
        onDate={setDate}
        sort={sort}
        onSort={setSort}
        categories={categoryChips}
        category={category}
        onCategory={(id) => {
          setCategory(id);
          setLimit(PAGE_SIZE);
        }}
        total={pool.length}
      />

      <div className="border-b border-line bg-beige-soft">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-3 text-[15px] sm:px-6 lg:px-8">
          <p className="flex items-center gap-2 font-semibold text-primary">
            <span className="size-2 rounded-full bg-primary" aria-hidden="true" />
            Menampilkan {visible.length} dari {filtered.length} {isRental ? 'Unit Armada Tersedia' : 'Produk'}
          </p>
          <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-ink-soft">
            <span className="flex items-center gap-1.5"><CircleCheck className="size-3.5" aria-hidden="true" /> Standar Kebersihan: Sterilisasi Uap 100°C & Siap Pakai</span>
            <span className="hidden h-4 w-px bg-line-strong sm:block" aria-hidden="true" />
            <span className="flex items-center gap-1.5"><ShieldCheck className="size-3.5" aria-hidden="true" /> Kebijakan Deposit Fleksibel: SPK Resmi Sekolah Diterima</span>
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {visible.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
                : 'Coba kata kunci lain atau pilih kategori berbeda.'
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
          <CtaBanner
            compact
            title="Butuh Paket Lengkap untuk Korps Penuh 40-70 Personel?"
            description="Konsultasikan spesifikasi armada lengkap, kebutuhan durasi sewa, dan pengumpulan data ukuran siswa bersama admin kami."
            actions={
              <>
                <ButtonLink href="/order/standard?step=2" variant="outline" className="!border-white/30 !bg-white/10 !text-white hover:!bg-white/20">
                  <Download className="size-4" aria-hidden="true" /> Template Data Ukuran
                </ButtonLink>
                <ButtonLink href="/chat?topic=Penawaran%20sewa%20kolektif" variant="gold">
                  <MessageSquare className="size-4" aria-hidden="true" /> Konsultasi & Penawaran Kolektif
                </ButtonLink>
              </>
            }
          />
        </div>
      </div>
    </main>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return <span className="rounded-lg border border-line bg-canvas px-3 py-2 text-[15px] text-ink">{children}</span>;
}
