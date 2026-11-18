"use client";

import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowDownWideNarrow,
  Check,
  ChevronDown,
  Coins,
  Crown,
  RotateCcw,
  Sparkles,
  Tag,
  TrendingUp,
  X,
} from 'lucide-react';

export type SortKey = 'newest' | 'price-asc' | 'price-desc' | 'stock';
export type PriceKey = 'all' | 'low' | 'mid' | 'high';

export interface PriceOption {
  value: PriceKey;
  label: string;
  tierTitle: string;
  desc: string;
  min: number;
  max: number;
}

export const PRICE_OPTIONS: PriceOption[] = [
  {
    value: 'all',
    label: 'Semua Harga',
    tierTitle: 'Semua Harga',
    desc: 'Tanpa batas budget',
    min: 0,
    max: Infinity,
  },
  {
    value: 'low',
    label: 'Di bawah Rp 150.000',
    tierTitle: '< Rp 150.000',
    desc: 'Ekonomis & Aksesori',
    min: 0,
    max: 150_000,
  },
  {
    value: 'mid',
    label: 'Rp 150.000 - 300.000',
    tierTitle: 'Rp 150rb - 300rb',
    desc: 'Paling Populer',
    min: 150_000,
    max: 300_000,
  },
  {
    value: 'high',
    label: 'Di atas Rp 300.000',
    tierTitle: '> Rp 300.000',
    desc: 'Seragam Lengkap',
    min: 300_000,
    max: Infinity,
  },
];

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'newest', label: 'Terbaru' },
  { value: 'stock', label: 'Stok Terbanyak' },
  { value: 'price-asc', label: 'Harga: Terendah' },
  { value: 'price-desc', label: 'Harga: Tertinggi' },
];

interface CatalogFilterProps {
  price: PriceKey;
  onPrice: (v: PriceKey) => void;
  availableOnly: boolean;
  onAvailableOnly: (v: boolean) => void;
  sort: SortKey;
  onSort: (v: SortKey) => void;
  categories: { id: string; name: string }[];
  category: string;
  onCategory: (id: string) => void;
  totalProducts?: number;
}

export function CatalogFilter({
  price,
  onPrice,
  availableOnly,
  onAvailableOnly,
  sort,
  onSort,
  categories,
  category,
  onCategory,
  totalProducts,
}: CatalogFilterProps) {
  const [activeDropdown, setActiveDropdown] = useState<'category' | 'price' | 'sort' | null>(null);
  const barRef = useRef<HTMLDivElement>(null);

  const activeFiltersCount =
    (category ? 1 : 0) +
    (price !== 'all' ? 1 : 0) +
    (availableOnly ? 1 : 0) +
    (sort !== 'newest' ? 1 : 0);

  const resetAll = () => {
    onCategory('');
    onPrice('all');
    onAvailableOnly(false);
    onSort('newest');
    setActiveDropdown(null);
  };

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (barRef.current && !barRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveDropdown(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const activeCategoryName = categories.find((c) => c.id === category)?.name;
  const activePriceOption = PRICE_OPTIONS.find((p) => p.value === price);
  const activeSortLabel = SORT_OPTIONS.find((s) => s.value === sort)?.label;

  return (
    <div className="w-full">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          ref={barRef}
          className="relative z-30 flex flex-col gap-2.5 rounded-2xl border border-line bg-surface p-3 sm:p-3.5 shadow-2xs"
        >
          {/* Main Controls Row */}
          <div className="flex flex-wrap items-center justify-between gap-2.5">
            {/* Filter Buttons Group */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Product Count (Desktop / Tablet) */}
              {typeof totalProducts === 'number' && (
                <div className="mr-1 hidden sm:flex items-center gap-1.5 text-xs font-bold text-ink">
                  <span>{totalProducts}</span>
                  <span className="font-normal text-muted">produk</span>
                  <span className="ml-1 text-line-strong">|</span>
                </div>
              )}

              {/* 1. Kategori Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setActiveDropdown(activeDropdown === 'category' ? null : 'category')}
                  className={`inline-flex h-8.5 items-center gap-1.5 rounded-lg border px-3 text-xs font-semibold transition-all ${
                    category
                      ? 'border-primary bg-primary text-on-primary shadow-xs'
                      : activeDropdown === 'category'
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-line bg-canvas text-ink hover:border-primary/50'
                  }`}
                  aria-expanded={activeDropdown === 'category'}
                >
                  <Tag className="size-3" />
                  <span className="max-w-[130px] truncate sm:max-w-none">
                    {category ? activeCategoryName : 'Kategori'}
                  </span>
                  <ChevronDown className={`size-3 transition-transform ${activeDropdown === 'category' ? 'rotate-180' : ''}`} />
                </button>

                {activeDropdown === 'category' && (
                  <div className="absolute left-0 top-full z-50 mt-1.5 min-w-56 max-w-[calc(100vw-2rem)] rounded-xl border border-line bg-surface p-2 shadow-2xl animate-in fade-in slide-in-from-top-1">
                    <p className="mb-1.5 px-2 text-[10px] font-bold uppercase tracking-wider text-muted">
                      Pilih Kategori
                    </p>
                    <div className="flex flex-col gap-0.5 max-h-56 overflow-y-auto">
                      <button
                        type="button"
                        onClick={() => {
                          onCategory('');
                          setActiveDropdown(null);
                        }}
                        className={`flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all ${
                          !category ? 'bg-primary/10 font-bold text-primary' : 'text-ink hover:bg-beige-soft'
                        }`}
                      >
                        <span>Semua Kategori</span>
                        {!category && <Check className="size-3 text-primary" />}
                      </button>
                      {categories.map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => {
                            onCategory(c.id);
                            setActiveDropdown(null);
                          }}
                          className={`flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all ${
                            c.id === category ? 'bg-primary/10 font-bold text-primary' : 'text-ink hover:bg-beige-soft'
                          }`}
                        >
                          <span className="truncate">{c.name}</span>
                          {c.id === category && <Check className="size-3 text-primary shrink-0 ml-2" />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* 2. Rentang Harga Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setActiveDropdown(activeDropdown === 'price' ? null : 'price')}
                  className={`inline-flex h-8.5 items-center gap-1.5 rounded-lg border px-3 text-xs font-semibold transition-all ${
                    price !== 'all'
                      ? 'border-primary bg-primary text-on-primary shadow-xs'
                      : activeDropdown === 'price'
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-line bg-canvas text-ink hover:border-primary/50'
                  }`}
                  aria-expanded={activeDropdown === 'price'}
                >
                  <Sparkles className="size-3" />
                  <span>{price !== 'all' ? activePriceOption?.tierTitle : 'Rentang Harga'}</span>
                  <ChevronDown className={`size-3 transition-transform ${activeDropdown === 'price' ? 'rotate-180' : ''}`} />
                </button>

                {activeDropdown === 'price' && (
                  <div className="absolute left-0 sm:left-auto top-full z-50 mt-1.5 w-72 sm:w-80 max-w-[calc(100vw-2rem)] rounded-xl border border-line bg-surface p-2.5 shadow-2xl animate-in fade-in slide-in-from-top-1">
                    <p className="mb-2 px-1 text-[10px] font-bold uppercase tracking-wider text-muted">
                      Pilih Rentang Harga
                    </p>
                    <div className="grid grid-cols-2 gap-1.5">
                      {PRICE_OPTIONS.map((opt) => {
                        const active = price === opt.value;
                        const isBudget = opt.value === 'low';
                        const isStandard = opt.value === 'mid';
                        const isPremium = opt.value === 'high';

                        return (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => {
                              onPrice(opt.value);
                              setActiveDropdown(null);
                            }}
                            className={`group flex flex-col items-start rounded-lg border p-2 text-left transition-all ${
                              active
                                ? 'border-primary bg-primary/10 ring-1 ring-primary'
                                : 'border-line bg-canvas hover:border-primary/50'
                            }`}
                          >
                            <div className="flex w-full items-center justify-between">
                              <span
                                className={`flex size-4 items-center justify-center rounded ${
                                  active ? 'text-primary' : 'text-muted'
                                }`}
                              >
                                {isPremium ? (
                                  <Crown className="size-3 text-gold-dark" />
                                ) : isStandard ? (
                                  <TrendingUp className="size-3" />
                                ) : isBudget ? (
                                  <Coins className="size-3" />
                                ) : (
                                  <Sparkles className="size-3" />
                                )}
                              </span>
                              {active && <Check className="size-3 text-primary" />}
                            </div>
                            <p className={`mt-1 text-xs font-bold ${active ? 'text-primary' : 'text-ink'}`}>
                              {opt.tierTitle}
                            </p>
                            <p className="text-[10px] text-muted line-clamp-1">{opt.desc}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* 3. Urutan Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setActiveDropdown(activeDropdown === 'sort' ? null : 'sort')}
                  className={`inline-flex h-8.5 items-center gap-1.5 rounded-lg border px-3 text-xs font-semibold transition-all ${
                    sort !== 'newest'
                      ? 'border-primary bg-primary text-on-primary shadow-xs'
                      : activeDropdown === 'sort'
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-line bg-canvas text-ink hover:border-primary/50'
                  }`}
                  aria-expanded={activeDropdown === 'sort'}
                >
                  <ArrowDownWideNarrow className="size-3" />
                  <span>{sort !== 'newest' ? activeSortLabel : 'Urutan'}</span>
                  <ChevronDown className={`size-3 transition-transform ${activeDropdown === 'sort' ? 'rotate-180' : ''}`} />
                </button>

                {activeDropdown === 'sort' && (
                  <div className="absolute right-0 sm:left-0 top-full z-50 mt-1.5 w-48 max-w-[calc(100vw-2rem)] rounded-xl border border-line bg-surface p-1.5 shadow-2xl animate-in fade-in slide-in-from-top-1">
                    {SORT_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => {
                          onSort(opt.value);
                          setActiveDropdown(null);
                        }}
                        className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all ${
                          sort === opt.value
                            ? 'bg-primary/10 font-bold text-primary'
                            : 'text-ink hover:bg-beige-soft'
                        }`}
                      >
                        <span>{opt.label}</span>
                        {sort === opt.value && <Check className="size-3 text-primary" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* 4. Tersedia Saja Toggle */}
              <button
                type="button"
                onClick={() => onAvailableOnly(!availableOnly)}
                className={`inline-flex h-8.5 shrink-0 items-center gap-1.5 rounded-lg border px-3 text-xs font-semibold transition-all ${
                  availableOnly
                    ? 'border-primary bg-primary text-on-primary shadow-xs'
                    : 'border-line bg-canvas text-ink hover:border-primary/50'
                }`}
              >
                <Check className={`size-3 ${availableOnly ? 'opacity-100' : 'opacity-40'}`} />
                <span>Tersedia Saja</span>
              </button>

              {/* Reset Button (If active) */}
              {activeFiltersCount > 0 && (
                <button
                  type="button"
                  onClick={resetAll}
                  title="Reset Filter"
                  className="inline-flex h-8.5 shrink-0 items-center gap-1 rounded-lg border border-line bg-canvas px-2.5 text-xs font-semibold text-muted hover:border-danger hover:text-danger transition-colors"
                >
                  <RotateCcw className="size-3" />
                  <span>Reset</span>
                </button>
              )}
            </div>

            {/* Product Count (Mobile only) */}
            {typeof totalProducts === 'number' && (
              <div className="flex sm:hidden items-center text-xs font-semibold text-ink-soft">
                <span>{totalProducts} produk</span>
              </div>
            )}
          </div>

          {/* Active Filter Chips Row (Visible if any filter is active) */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-line/60">
              <span className="text-[11px] font-medium text-muted mr-1">Filter aktif:</span>

              {category && (
                <button
                  type="button"
                  onClick={() => onCategory('')}
                  className="inline-flex items-center gap-1 rounded-full border border-primary/25 bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary hover:bg-primary/20 transition-colors"
                  title="Hapus filter kategori"
                >
                  <span>{activeCategoryName || 'Kategori'}</span>
                  <X className="size-3" />
                </button>
              )}

              {price !== 'all' && (
                <button
                  type="button"
                  onClick={() => onPrice('all')}
                  className="inline-flex items-center gap-1 rounded-full border border-gold-dark/25 bg-gold-light/20 px-2.5 py-0.5 text-xs font-semibold text-gold-dark hover:bg-gold-light/30 transition-colors"
                  title="Hapus filter harga"
                >
                  <span>{activePriceOption?.tierTitle}</span>
                  <X className="size-3" />
                </button>
              )}

              {availableOnly && (
                <button
                  type="button"
                  onClick={() => onAvailableOnly(false)}
                  className="inline-flex items-center gap-1 rounded-full border border-primary/25 bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary hover:bg-primary/20 transition-colors"
                  title="Hapus filter ketersediaan"
                >
                  <span>Tersedia saja</span>
                  <X className="size-3" />
                </button>
              )}

              {sort !== 'newest' && (
                <button
                  type="button"
                  onClick={() => onSort('newest')}
                  className="inline-flex items-center gap-1 rounded-full border border-primary/25 bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary hover:bg-primary/20 transition-colors"
                  title="Reset urutan"
                >
                  <span>{activeSortLabel}</span>
                  <X className="size-3" />
                </button>
              )}

              <button
                type="button"
                onClick={resetAll}
                className="ml-auto text-xs font-semibold text-muted hover:text-danger transition-colors"
              >
                Hapus Semua
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
