"use client";

import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowDownWideNarrow,
  Check,
  ChevronDown,
  Coins,
  Crown,
  RotateCcw,
  SlidersHorizontal,
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
  const [isOpen, setIsOpen] = useState(false);
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
        setIsOpen(false);
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
        <div ref={barRef} className="relative z-30 flex min-h-11 items-center justify-between gap-3 border-b border-line pb-3 overflow-visible">
          {!isOpen ? (
            /* ─── Mode Tertutup: Info di Kiri & Tombol Filter di Kanan ─── */
            <>
              {/* Info & Tag Aktif */}
              <div className="flex flex-wrap items-center gap-2">
                {typeof totalProducts === 'number' && (
                  <span className="text-xs sm:text-sm font-semibold text-ink-soft">
                    {totalProducts} produk
                  </span>
                )}

                {category && (
                  <button
                    type="button"
                    onClick={() => onCategory('')}
                    className="inline-flex items-center gap-1 rounded-full border border-primary/25 bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary hover:bg-primary/20 transition-colors"
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
                  >
                    <span>Tersedia saja</span>
                    <X className="size-3" />
                  </button>
                )}

                {activeFiltersCount > 0 && (
                  <button
                    type="button"
                    onClick={resetAll}
                    className="ml-1 text-xs font-semibold text-muted hover:text-danger transition-colors"
                  >
                    Reset
                  </button>
                )}
              </div>

              {/* Tombol Filter di Kanan */}
              <div className="ml-auto">
                <button
                  type="button"
                  onClick={() => setIsOpen(true)}
                  aria-label="Buka Filter Produk"
                  title="Filter Produk"
                  className={`group relative flex size-11 items-center justify-center rounded-xl border transition-all active:scale-95 ${
                    activeFiltersCount > 0
                      ? 'border-primary bg-primary/10 text-primary shadow-xs hover:bg-primary hover:text-on-primary'
                      : 'border-line bg-surface text-ink shadow-xs hover:border-primary hover:text-primary hover:shadow-sm'
                  }`}
                >
                  <SlidersHorizontal className="size-5 transition-transform group-hover:scale-110" />
                  {activeFiltersCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white shadow-xs">
                      {activeFiltersCount}
                    </span>
                  )}
                </button>
              </div>
            </>
          ) : (
            /* ─── Mode Terbuka: Responsif untuk Mobile & Desktop ─── */
            <>
              {/* 1. Tampilan Terbuka Desktop (sm:flex): Toolbar 1 Baris Memanjang ke Kiri */}
              <div className="relative z-40 hidden sm:flex h-11 w-full items-center justify-between rounded-xl border border-line bg-surface px-2.5 shadow-sm transition-all animate-in slide-in-from-right duration-200 overflow-visible">
                {/* Baris Tombol Dropdown Filter */}
                <div className="flex flex-1 items-center gap-2 overflow-visible">
                  {/* Dropdown Kategori */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setActiveDropdown(activeDropdown === 'category' ? null : 'category')}
                      className={`inline-flex h-8 items-center gap-1.5 rounded-lg border px-3 text-xs font-semibold transition-all ${
                        category
                          ? 'border-primary bg-primary text-on-primary shadow-xs'
                          : activeDropdown === 'category'
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-line bg-canvas text-ink hover:border-primary/50'
                      }`}
                    >
                      <Tag className="size-3" />
                      <span>{category ? activeCategoryName : 'Kategori'}</span>
                      <ChevronDown className={`size-3 transition-transform ${activeDropdown === 'category' ? 'rotate-180' : ''}`} />
                    </button>

                    {activeDropdown === 'category' && (
                      <div className="absolute left-0 top-full z-50 mt-2 min-w-56 max-w-xs rounded-xl border border-line bg-surface p-2 shadow-2xl animate-in fade-in slide-in-from-top-1">
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
                              <span>{c.name}</span>
                              {c.id === category && <Check className="size-3 text-primary" />}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Dropdown Rentang Harga */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setActiveDropdown(activeDropdown === 'price' ? null : 'price')}
                      className={`inline-flex h-8 items-center gap-1.5 rounded-lg border px-3 text-xs font-semibold transition-all ${
                        price !== 'all'
                          ? 'border-primary bg-primary text-on-primary shadow-xs'
                          : activeDropdown === 'price'
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-line bg-canvas text-ink hover:border-primary/50'
                      }`}
                    >
                      <Sparkles className="size-3" />
                      <span>{price !== 'all' ? activePriceOption?.tierTitle : 'Rentang Harga'}</span>
                      <ChevronDown className={`size-3 transition-transform ${activeDropdown === 'price' ? 'rotate-180' : ''}`} />
                    </button>

                    {activeDropdown === 'price' && (
                      <div className="absolute left-0 top-full z-50 mt-2 w-72 sm:w-80 rounded-xl border border-line bg-surface p-2.5 shadow-2xl animate-in fade-in slide-in-from-top-1">
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

                  {/* Dropdown Urutan */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setActiveDropdown(activeDropdown === 'sort' ? null : 'sort')}
                      className={`inline-flex h-8 items-center gap-1.5 rounded-lg border px-3 text-xs font-semibold transition-all ${
                        sort !== 'newest'
                          ? 'border-primary bg-primary text-on-primary shadow-xs'
                          : activeDropdown === 'sort'
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-line bg-canvas text-ink hover:border-primary/50'
                      }`}
                    >
                      <ArrowDownWideNarrow className="size-3" />
                      <span>{sort !== 'newest' ? activeSortLabel : 'Urutan'}</span>
                      <ChevronDown className={`size-3 transition-transform ${activeDropdown === 'sort' ? 'rotate-180' : ''}`} />
                    </button>

                    {activeDropdown === 'sort' && (
                      <div className="absolute left-0 top-full z-50 mt-2 w-48 rounded-xl border border-line bg-surface p-1.5 shadow-2xl animate-in fade-in slide-in-from-top-1">
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

                  {/* Tombol Tersedia Saja */}
                  <button
                    type="button"
                    onClick={() => onAvailableOnly(!availableOnly)}
                    className={`inline-flex h-8 shrink-0 items-center gap-1.5 rounded-lg border px-3 text-xs font-semibold transition-all ${
                      availableOnly
                        ? 'border-primary bg-primary text-on-primary shadow-xs'
                        : 'border-line bg-canvas text-ink hover:border-primary/50'
                    }`}
                  >
                    <Check className={`size-3 ${availableOnly ? 'opacity-100' : 'opacity-40'}`} />
                    <span>Tersedia Saja</span>
                  </button>

                  {/* Tombol Reset */}
                  {activeFiltersCount > 0 && (
                    <button
                      type="button"
                      onClick={resetAll}
                      title="Reset Filter"
                      className="inline-flex h-8 shrink-0 items-center gap-1 rounded-lg border border-line bg-canvas px-2.5 text-xs font-semibold text-muted hover:border-danger hover:text-danger transition-colors"
                    >
                      <RotateCcw className="size-3" />
                      <span>Reset</span>
                    </button>
                  )}
                </div>

                {/* Tombol Tutup Desktop */}
                <div className="ml-2 pl-2 border-l border-line shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false);
                      setActiveDropdown(null);
                    }}
                    aria-label="Tutup Toolbar Filter"
                    title="Tutup Filter"
                    className="flex size-8 items-center justify-center rounded-lg text-ink-soft hover:bg-beige-soft hover:text-ink transition-colors"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              </div>

              {/* 2. Tampilan Terbuka Mobile (sm:hidden): Panel Filter Pas 100% Lebar Layar */}
              <div className="relative z-40 flex sm:hidden w-full flex-col rounded-2xl border border-line bg-surface p-3.5 shadow-card transition-all animate-in fade-in slide-in-from-top-1 duration-200">
                {/* Header Mobile: Judul + Reset + Tutup */}
                <div className="flex items-center justify-between border-b border-line pb-3">
                  <div className="flex items-center gap-2">
                    <span className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <SlidersHorizontal className="size-4" />
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-ink">Filter Produk</h3>
                      {typeof totalProducts === 'number' && (
                        <p className="text-[11px] text-ink-soft">{totalProducts} produk tersedia</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {activeFiltersCount > 0 && (
                      <button
                        type="button"
                        onClick={resetAll}
                        className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold text-muted hover:text-danger"
                      >
                        <RotateCcw className="size-3" />
                        <span>Reset</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setIsOpen(false)}
                      className="flex size-8 items-center justify-center rounded-lg text-ink-soft hover:bg-beige-soft hover:text-ink"
                      aria-label="Tutup filter"
                    >
                      <X className="size-4" />
                    </button>
                  </div>
                </div>

                {/* Konten Filter Mobile */}
                <div className="space-y-3.5 pt-3">
                  {/* 1. Kategori */}
                  <div className="space-y-1.5">
                    <label htmlFor="mobile-filter-category" className="flex items-center gap-1.5 text-xs font-bold text-ink">
                      <Tag className="size-3.5 text-primary" /> Kategori
                    </label>
                    <select
                      id="mobile-filter-category"
                      value={category}
                      onChange={(e) => onCategory(e.target.value)}
                      className="h-9 w-full rounded-lg border border-line bg-canvas px-3 text-xs font-semibold text-ink focus:border-primary focus:outline-none"
                    >
                      <option value="">Semua Kategori</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* 2. Rentang Harga (Visual Cards 2x2) */}
                  <div className="space-y-1.5">
                    <span className="flex items-center gap-1.5 text-xs font-bold text-ink">
                      <Sparkles className="size-3.5 text-gold-dark" /> Rentang Harga
                    </span>
                    <div className="grid grid-cols-2 gap-1.5">
                      {PRICE_OPTIONS.map((opt) => {
                        const active = price === opt.value;
                        return (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => onPrice(opt.value)}
                            className={`flex flex-col items-start rounded-lg border p-2 text-left transition-all ${
                              active
                                ? 'border-primary bg-primary/10 ring-1 ring-primary'
                                : 'border-line bg-canvas hover:border-primary/40'
                            }`}
                          >
                            <div className="flex w-full items-center justify-between">
                              <span className={`text-[11px] font-bold ${active ? 'text-primary' : 'text-ink'}`}>
                                {opt.tierTitle}
                              </span>
                              {active && <Check className="size-3 text-primary" />}
                            </div>
                            <span className="text-[10px] text-muted line-clamp-1">{opt.desc}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 3. Urutan */}
                  <div className="space-y-1.5">
                    <label htmlFor="mobile-filter-sort" className="flex items-center gap-1.5 text-xs font-bold text-ink">
                      <ArrowDownWideNarrow className="size-3.5 text-primary" /> Urutan
                    </label>
                    <select
                      id="mobile-filter-sort"
                      value={sort}
                      onChange={(e) => onSort(e.target.value as SortKey)}
                      className="h-9 w-full rounded-lg border border-line bg-canvas px-3 text-xs font-semibold text-ink focus:border-primary focus:outline-none"
                    >
                      {SORT_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* 4. Tersedia Saja Toggle */}
                  <button
                    type="button"
                    onClick={() => onAvailableOnly(!availableOnly)}
                    className={`flex w-full items-center justify-between rounded-lg border p-2.5 text-xs font-semibold transition-all ${
                      availableOnly
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-line bg-canvas text-ink hover:border-primary/40'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Check className={`size-3.5 ${availableOnly ? 'text-primary' : 'text-muted'}`} />
                      Hanya Produk Tersedia
                    </span>
                    <span
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                        availableOnly ? 'bg-primary' : 'bg-line-strong'
                      }`}
                    >
                      <span
                        className={`inline-block size-4 transform rounded-full bg-white shadow transition duration-200 ease-in-out ${
                          availableOnly ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </span>
                  </button>

                  {/* Tombol Terapkan */}
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="w-full h-9 rounded-lg bg-primary font-bold text-xs text-on-primary shadow-xs hover:bg-primary-light transition-colors"
                  >
                    Terapkan Filter
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}