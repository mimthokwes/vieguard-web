"use client";

import React, { useState } from 'react';
import { ChevronDown, Star } from 'lucide-react';
import { Product } from '@/types/product';

interface ProductAccordionsProps {
  product: Product;
}

export function ProductAccordions({ product }: ProductAccordionsProps) {
  const [openSection, setOpenSection] = useState<'desc' | 'size' | 'hygiene' | null>('desc');

  const toggle = (section: 'desc' | 'size' | 'hygiene') => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <div className="flex flex-col gap-4 mt-6">
      {/* Section 1: Description */}
      <div className="bg-white rounded-2xl border border-[#E6E1DA] overflow-hidden">
        <button
          onClick={() => toggle('desc')}
          className="w-full px-6 py-4 flex items-center justify-between font-serif font-bold text-sm text-[#1C1C1C] text-left hover:bg-[#FAF7F2] transition-colors"
        >
          <span>Deskripsi & Karakteristik Bahan</span>
          <ChevronDown
            className={`w-4 h-4 text-[#8C857B] transition-transform duration-300 ${
              openSection === 'desc' ? 'rotate-180' : ''
            }`}
          />
        </button>
        {openSection === 'desc' && (
          <div className="px-6 pb-6 border-t border-[#F3EDE6] pt-4 flex flex-col gap-4 text-xs text-[#6B655C] leading-relaxed">
            <p>
              {product.description ||
                'Dirancang untuk menghadirkan aura keanggunan abadi di perhelatan prestisius. Siluet Aurelia Gown menonjolkan drapery pundak asimetris yang mengalir jatuh mengikuti kontur tubuh tanpa membatasi pergerakan.'}
            </p>
            <div className="grid grid-cols-2 gap-4 bg-[#FAF7F2] p-4 rounded-xl border border-[#E6E1DA]">
              <div>
                <span className="text-[10px] font-bold text-[#8C857B] uppercase block mb-0.5">
                  KOMPOSISI KAIN
                </span>
                <span className="font-bold text-[#1C1C1C]">
                  {product.fabricComposition || '100% Emerald Mulberry Silk Satin'}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-[#8C857B] uppercase block mb-0.5">
                  LAPISAN DALAM
                </span>
                <span className="font-bold text-[#1C1C1C]">
                  {product.innerLining || 'Breathable Silk-Habotai Lining'}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-[#8C857B] uppercase block mb-0.5">
                  KONSTRUKSI CORSETRY
                </span>
                <span className="font-bold text-[#1C1C1C]">
                  {product.corsetryConstruct || 'Internal Soft Boning & Molded Cups'}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-[#8C857B] uppercase block mb-0.5">
                  PANJANG TRAIN
                </span>
                <span className="font-bold text-[#1C1C1C]">
                  {product.trainLength || 'Floor Length + 25 cm Sweep Train'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Section 2: Size Guide */}
      <div className="bg-white rounded-2xl border border-[#E6E1DA] overflow-hidden">
        <button
          onClick={() => toggle('size')}
          className="w-full px-6 py-4 flex items-center justify-between font-serif font-bold text-sm text-[#1C1C1C] text-left hover:bg-[#FAF7F2] transition-colors"
        >
          <span>Panduan Ukuran (Size Guide)</span>
          <ChevronDown
            className={`w-4 h-4 text-[#8C857B] transition-transform duration-300 ${
              openSection === 'size' ? 'rotate-180' : ''
            }`}
          />
        </button>
        {openSection === 'size' && (
          <div className="px-6 pb-6 border-t border-[#F3EDE6] pt-4 text-xs text-[#6B655C]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E6E1DA] text-[#1C1C1C] font-bold">
                  <th className="py-2">Size</th>
                  <th className="py-2">Lingkar Dada</th>
                  <th className="py-2">Lingkar Pinggang</th>
                  <th className="py-2">Lingkar Pinggul</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F3EDE6]">
                <tr><td className="py-2 font-bold">S</td><td>82 - 86 cm</td><td>64 - 68 cm</td><td>88 - 92 cm</td></tr>
                <tr><td className="py-2 font-bold">M</td><td>86 - 90 cm</td><td>68 - 72 cm</td><td>92 - 96 cm</td></tr>
                <tr><td className="py-2 font-bold">L</td><td>90 - 96 cm</td><td>72 - 78 cm</td><td>96 - 102 cm</td></tr>
                <tr><td className="py-2 font-bold">XL</td><td>96 - 102 cm</td><td>78 - 84 cm</td><td>102 - 108 cm</td></tr>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Section 3: Hygiene Standard */}
      <div className="bg-white rounded-2xl border border-[#E6E1DA] overflow-hidden">
        <button
          onClick={() => toggle('hygiene')}
          className="w-full px-6 py-4 flex items-center justify-between font-serif font-bold text-sm text-[#1C1C1C] text-left hover:bg-[#FAF7F2] transition-colors"
        >
          <span>Standar Higienitas & Perawatan Premium</span>
          <ChevronDown
            className={`w-4 h-4 text-[#8C857B] transition-transform duration-300 ${
              openSection === 'hygiene' ? 'rotate-180' : ''
            }`}
          />
        </button>
        {openSection === 'hygiene' && (
          <div className="px-6 pb-6 border-t border-[#F3EDE6] pt-4 text-xs text-[#6B655C] leading-relaxed">
            <p>
              Setiap busana VIEGUARD menjalani 5 tahap sterilisasi medis eco-dry-cleaning, penyetrikaan uap suhu tinggi 120°C, dan penyegelan kantong garment vakum antibakteri sebelum dikirim ke tangan Anda.
            </p>
          </div>
        )}
      </div>

      {/* Verified Reviews Box */}
      <div className="bg-white rounded-2xl border border-[#E6E1DA] p-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-center justify-center bg-[#FAF2EA] border border-[#DDB892] rounded-xl px-3 py-2">
            <span className="font-serif font-bold text-base text-[#1C1C1C]">4.9</span>
            <span className="text-[9px] font-bold text-[#8C857B]">/ 5.0</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-0.5 text-amber-500 mb-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-current" />
              ))}
            </div>
            <span className="text-xs font-bold text-[#1C1C1C]">
              Berdasarkan 128 ulasan pelanggan terverifikasi
            </span>
            <p className="text-[11px] text-[#6B655C] italic mt-0.5">
              "Jatuh kainnya magis, harum bersih tanpa bau apek, persis seperti foto."
            </p>
          </div>
        </div>
        <button type="button" className="text-xs font-bold text-[#C48B54] hover:underline whitespace-nowrap">
          Lihat Semua Ulasan
        </button>
      </div>

    </div>
  );
}
