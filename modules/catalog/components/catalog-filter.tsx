"use client";

import React from 'react';
import { ArrowDownWideNarrow, CalendarDays, Search } from 'lucide-react';

export type SortKey = 'newest' | 'price-asc' | 'price-desc' | 'stock';

interface CatalogFilterProps {
  query: string;
  onQuery: (v: string) => void;
  date: string;
  onDate: (v: string) => void;
  sort: SortKey;
  onSort: (v: SortKey) => void;
  categories: { id: string; name: string; count: number }[];
  category: string;
  onCategory: (id: string) => void;
  total: number;
}

const control = 'h-11 w-full rounded-lg border border-line bg-surface text-sm text-ink focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary';

export function CatalogFilter({ query, onQuery, date, onDate, sort, onSort, categories, category, onCategory, total }: CatalogFilterProps) {
  return (
    <div className="border-y border-line bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-2 md:grid-cols-[1fr_260px_220px]">
          <label className="relative">
            <span className="sr-only">Cari armada</span>
            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden="true" />
            <input type="search" value={query} onChange={(e) => onQuery(e.target.value)} placeholder="Cari seragam, topi shako, atau instrumen..." className={`${control} pl-10 pr-3`} />
          </label>
          <label className="relative">
            <span className="sr-only">Tanggal acara / pemakaian</span>
            <CalendarDays className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden="true" />
            <input
              type="date"
              value={date}
              min={new Date().toISOString().slice(0, 10)}
              onChange={(e) => onDate(e.target.value)}
              aria-label="Pilih tanggal acara / pemakaian"
              className={`${control} pl-10 pr-3`}
            />
          </label>
          <label className="relative">
            <span className="sr-only">Urutkan</span>
            <ArrowDownWideNarrow className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden="true" />
            <select value={sort} onChange={(e) => onSort(e.target.value as SortKey)} className={`${control} cursor-pointer pl-10 pr-3`}>
              <option value="newest">Urutkan: Terbaru</option>
              <option value="stock">Urutkan: Stok Terbanyak</option>
              <option value="price-asc">Urutkan: Harga Terendah</option>
              <option value="price-desc">Urutkan: Harga Tertinggi</option>
            </select>
          </label>
        </div>
        <div className="mt-3 flex gap-2 overflow-x-auto border-t border-line pt-3 scrollbar-none" role="group" aria-label="Kategori">
          {[{ id: '', name: 'Semua Kategori', count: total }, ...categories].map((c) => {
            const active = c.id === category;
            return (
              <button
                key={c.id || 'all'}
                type="button"
                aria-pressed={active}
                onClick={() => onCategory(c.id)}
                className={`whitespace-nowrap rounded-lg px-4 py-2 text-[15px] font-semibold transition-colors ${
                  active ? 'bg-primary text-on-primary shadow-button' : 'border border-line bg-surface text-ink hover:border-primary hover:text-primary'
                }`}
              >
                {c.name} ({c.count})
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
