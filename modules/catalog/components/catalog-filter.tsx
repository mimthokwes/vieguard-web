"use client";

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, RotateCcw } from 'lucide-react';

export function CatalogFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || 'semua');
  const [transactionType, setTransactionType] = useState(searchParams.get('type') || 'semua');
  const [size, setSize] = useState(searchParams.get('size') || 'semua');
  const [sort, setSort] = useState(searchParams.get('sort') || 'populer');

  const categories = [
    { id: 'semua', label: 'Semua Koleksi' },
    { id: 'gaun', label: 'Gaun & Pesta' },
    { id: 'kebaya', label: 'Kebaya & Wastra' },
    { id: 'batik', label: 'Batik Tulis & Sutra' },
    { id: 'jas', label: 'Jas & Tuxedo' },
    { id: 'beskap', label: 'Beskap Tradisional' },
    { id: 'pawai', label: 'Kostum Pawai & Marching' },
    { id: 'muslim', label: 'Busana Muslim & Kaftan' },
    { id: 'aksesoris', label: 'Aksesoris' },
  ];

  const updateFilters = (newParams: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(newParams).forEach(([key, value]) => {
      if (value && value !== 'semua') {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    router.push(`/catalog?${params.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ search });
  };

  const handleCategoryClick = (catId: string) => {
    setActiveCategory(catId);
    updateFilters({ category: catId });
  };

  const handleReset = () => {
    setSearch('');
    setActiveCategory('semua');
    setTransactionType('semua');
    setSize('semua');
    setSort('populer');
    router.push('/catalog');
  };

  return (
    <div className="flex flex-col gap-6 mb-8">
      
      {/* Top Search Input */}
      <form onSubmit={handleSearchSubmit} className="relative w-full">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari berdasarkan nama busana, desainer, atau bahan (misal: Sutra, Bordir, Beludru)..."
          className="w-full bg-white border border-[#E6E1DA] rounded-2xl py-3.5 pl-12 pr-4 text-sm text-[#1C1C1C] placeholder-[#8C857B] focus:outline-none focus:border-[#C48B54] focus:ring-1 focus:ring-[#C48B54] shadow-sm transition-all"
        />
        <Search className="w-5 h-5 text-[#8C857B] absolute left-4 top-1/2 -translate-y-1/2" />
      </form>

      {/* Category Pills Row */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#1C1C1C] text-white shadow-sm'
                  : 'bg-white text-[#6B655C] border border-[#E6E1DA] hover:border-[#C48B54] hover:text-[#1C1C1C]'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Dropdown Filters Row (5 filters + Reset button matching Figma) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Tipe Transaksi */}
        <div>
          <label className="text-[10px] font-extrabold text-[#8C857B] uppercase block mb-1">
            TIPE TRANSAKSI
          </label>
          <select
            value={transactionType}
            onChange={(e) => {
              setTransactionType(e.target.value);
              updateFilters({ type: e.target.value });
            }}
            className="w-full bg-white border border-[#E6E1DA] rounded-xl px-3 py-2.5 text-xs text-[#1C1C1C] font-medium focus:outline-none focus:border-[#C48B54] shadow-sm"
          >
            <option value="semua">Semua (Beli / Sewa)</option>
            <option value="sewa">Sewa Saja</option>
            <option value="beli">Beli Saja</option>
          </select>
        </div>

        {/* Rentang Harga */}
        <div>
          <label className="text-[10px] font-extrabold text-[#8C857B] uppercase block mb-1">
            RENTANG HARGA
          </label>
          <select
            defaultValue="semua"
            className="w-full bg-white border border-[#E6E1DA] rounded-xl px-3 py-2.5 text-xs text-[#1C1C1C] font-medium focus:outline-none focus:border-[#C48B54] shadow-sm"
          >
            <option value="semua">Semua Harga</option>
            <option value="under500">&lt; Rp 500.000</option>
            <option value="500-1500">Rp 500.000 - Rp 1.500.000</option>
            <option value="over1500">&gt; Rp 1.500.000</option>
          </select>
        </div>

        {/* Ukuran */}
        <div>
          <label className="text-[10px] font-extrabold text-[#8C857B] uppercase block mb-1">
            UKURAN / SIZE
          </label>
          <select
            value={size}
            onChange={(e) => {
              setSize(e.target.value);
              updateFilters({ size: e.target.value });
            }}
            className="w-full bg-white border border-[#E6E1DA] rounded-xl px-3 py-2.5 text-xs text-[#1C1C1C] font-medium focus:outline-none focus:border-[#C48B54] shadow-sm"
          >
            <option value="semua">Semua Ukuran</option>
            <option value="S">Size S</option>
            <option value="M">Size M</option>
            <option value="L">Size L</option>
            <option value="XL">Size XL</option>
            <option value="Custom">Jahit Kustom</option>
          </select>
        </div>

        {/* Warna */}
        <div>
          <label className="text-[10px] font-extrabold text-[#8C857B] uppercase block mb-1">
            WARNA
          </label>
          <select
            defaultValue="semua"
            className="w-full bg-white border border-[#E6E1DA] rounded-xl px-3 py-2.5 text-xs text-[#1C1C1C] font-medium focus:outline-none focus:border-[#C48B54] shadow-sm"
          >
            <option value="semua">Semua Warna</option>
            <option value="emerald">Emerald</option>
            <option value="navy">Navy Blue</option>
            <option value="gold">Gold / Champagne</option>
            <option value="black">Hitam / Black</option>
            <option value="maroon">Maroon / Red</option>
          </select>
        </div>

        {/* Urutan */}
        <div>
          <label className="text-[10px] font-extrabold text-[#8C857B] uppercase block mb-1">
            URUTAN
          </label>
          <select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value);
              updateFilters({ sort: e.target.value });
            }}
            className="w-full bg-white border border-[#E6E1DA] rounded-xl px-3 py-2.5 text-xs text-[#1C1C1C] font-medium focus:outline-none focus:border-[#C48B54] shadow-sm"
          >
            <option value="populer">Paling Populer</option>
            <option value="terbaru">Produk Terbaru</option>
            <option value="harga_low">Harga Termurah</option>
            <option value="harga_high">Harga Termahal</option>
          </select>
        </div>

        {/* Reset Button */}
        <div className="flex items-end">
          <button
            onClick={handleReset}
            className="w-full bg-white hover:bg-[#FAF7F2] border border-[#E6E1DA] hover:border-[#C48B54] text-[#1C1C1C] text-xs font-bold py-2.5 px-3 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#8C857B]" />
            <span>Reset Filter</span>
          </button>
        </div>

      </div>
    </div>
  );
}

