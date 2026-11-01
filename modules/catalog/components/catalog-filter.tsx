"use client";

import React, { useState } from 'react';
import { ArrowDownWideNarrow, CalendarDays, ChevronDown, SlidersHorizontal, Tag } from 'lucide-react';

export type SortKey = 'newest' | 'price-asc' | 'price-desc' | 'stock';
export type PriceKey = 'all' | 'low' | 'mid' | 'high';

// Price ranges are shared with the parent so it can filter with the same min/max values.
// Adjust the numbers to match your real product prices (per day, in IDR).
export const PRICE_OPTIONS: { value: PriceKey; label: string; min: number; max: number }[] = [
  { value: 'all', label: 'Semua Harga', min: 0, max: Infinity },
  { value: 'low', label: 'Di bawah Rp 150.000', min: 0, max: 150_000 },
  { value: 'mid', label: 'Rp 150.000 - 300.000', min: 150_000, max: 300_000 },
  { value: 'high', label: 'Di atas Rp 300.000', min: 300_000, max: Infinity },
];

interface CatalogFilterProps {
  date: string;
  onDate: (v: string) => void;
  price: PriceKey;
  onPrice: (v: PriceKey) => void;
  availableOnly: boolean;
  onAvailableOnly: (v: boolean) => void;
  sort: SortKey;
  onSort: (v: SortKey) => void;
  categories: { id: string; name: string }[];
  category: string;
  onCategory: (id: string) => void;
}

const control =
  'h-10 w-full rounded-lg border border-line bg-surface text-sm text-ink focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary md:h-11';

export function CatalogFilter({
  date,
  onDate,
  price,
  onPrice,
  availableOnly,
  onAvailableOnly,
  sort,
  onSort,
  categories,
  category,
  onCategory,
}: CatalogFilterProps) {
  // Mobile only: whether the secondary filters (date, price, availability) are expanded
  const [open, setOpen] = useState(false);

  // Number of active secondary filters, shown as a badge on the mobile Filter button
  const activeCount = (date ? 1 : 0) + (price !== 'all' ? 1 : 0) + (availableOnly ? 1 : 0);
  const hasActiveFilter = activeCount > 0;

  const resetFilters = () => {
    onDate('');
    onPrice('all');
    onAvailableOnly(false);
  };

  return (
    <div className="">
      <div className="mx-auto max-w-7xl px-4 py-2 sm:px-6 md:py-3 lg:px-8">
        <div className="flex flex-wrap items-center gap-2">
          {/* Mobile: toggle button for the secondary filters */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="catalog-secondary-filters"
            className={`order-1 flex h-10 flex-none items-center gap-2 rounded-lg border px-3 text-sm font-semibold transition-colors md:hidden ${
              hasActiveFilter ? 'border-primary text-primary' : 'border-line text-ink'
            }`}
          >
            <SlidersHorizontal className="size-4" aria-hidden="true" />
            Filter
            {hasActiveFilter && (
              <span className="grid size-5 place-items-center rounded-full bg-primary text-xs text-on-primary">{activeCount}</span>
            )}
            <ChevronDown className={`size-4 transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
          </button>

          {/* Sort: beside the Filter button on mobile, pushed to the far right on desktop */}
          <label className="relative order-2 min-w-0 flex-1 md:order-last md:ml-auto md:w-56 md:flex-none">
            <span className="sr-only">Urutkan</span>
            <ArrowDownWideNarrow
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted"
              aria-hidden="true"
            />
            <select
              value={sort}
              onChange={(e) => onSort(e.target.value as SortKey)}
              className={`${control} cursor-pointer truncate pl-9 pr-2 md:pl-10 md:pr-3`}
            >
              <option value="newest">Urutkan: Terbaru</option>
              <option value="stock">Urutkan: Stok Terbanyak</option>
              <option value="price-asc">Urutkan: Harga Terendah</option>
              <option value="price-desc">Urutkan: Harga Tertinggi</option>
            </select>
          </label>

          {/* Secondary filters: collapsible on mobile, always inline on desktop (md:contents) */}
          <div
            id="catalog-secondary-filters"
            className={`${open ? 'grid' : 'hidden'} order-3 w-full grid-cols-2 gap-2 md:contents`}
          >
            {/* Rental date */}
            <label className="relative col-span-2 md:col-auto md:w-60">
              <span className="sr-only">Tanggal sewa</span>
              <CalendarDays
                className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted"
                aria-hidden="true"
              />
              <input
                type="date"
                value={date}
                min={new Date().toISOString().slice(0, 10)}
                onChange={(e) => onDate(e.target.value)}
                aria-label="Pilih tanggal sewa"
                className={`${control} pl-10 pr-3`}
              />
            </label>

            {/* Price range */}
            <label className="relative col-span-2 md:col-auto md:w-56">
              <span className="sr-only">Rentang harga</span>
              <Tag
                className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted"
                aria-hidden="true"
              />
              <select
                value={price}
                onChange={(e) => onPrice(e.target.value as PriceKey)}
                className={`${control} cursor-pointer pl-10 pr-3`}
              >
                {PRICE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.value === 'all' ? 'Harga: Semua' : o.label}
                  </option>
                ))}
              </select>
            </label>

            {/* Availability toggle */}
            <label
              className={`flex h-10 cursor-pointer select-none items-center gap-2 rounded-lg border px-4 text-sm transition-colors md:h-11 ${
                availableOnly
                  ? 'border-primary bg-primary/10 font-semibold text-primary'
                  : 'border-line bg-surface text-ink hover:border-primary'
              }`}
            >
              <input
                type="checkbox"
                checked={availableOnly}
                onChange={(e) => onAvailableOnly(e.target.checked)}
                className="size-4 accent-primary"
              />
              Tersedia saja
            </label>

            {hasActiveFilter && (
              <button
                type="button"
                onClick={resetFilters}
                className="h-10 px-2 text-left text-sm font-semibold text-primary hover:underline md:h-11 md:text-center"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Categories (name only, no counts) */}
        <div
          className="mt-2 flex gap-2 overflow-x-auto border-t border-line pt-2 scrollbar-none md:mt-3 md:pt-3"
          role="group"
          aria-label="Kategori"
        >
          {[{ id: '', name: 'Semua Kategori' }, ...categories].map((c) => {
            const active = c.id === category;
            return (
              <button
                key={c.id || 'all'}
                type="button"
                aria-pressed={active}
                onClick={() => onCategory(c.id)}
                className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors md:px-4 md:py-2 md:text-[15px] ${
                  active
                    ? 'bg-primary text-on-primary shadow-button'
                    : 'border border-line bg-surface text-ink hover:border-primary hover:text-primary'
                }`}
              >
                {c.name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}