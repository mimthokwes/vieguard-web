import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { formatImageUrl } from '@/lib/image';

export function PromoBannersSection() {
  return (
    <section className="w-full py-10 bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Banner 1 */}
          <div className="bg-[#FAF2EA] border border-[#E8D9C8] rounded-2xl p-5 flex items-center justify-between gap-4 relative overflow-hidden group shadow-sm hover:border-[#C48B54] transition-all">
            <div className="flex flex-col gap-1.5 z-10 max-w-[60%]">
              <span className="text-[10px] font-extrabold tracking-widest text-[#C48B54] uppercase">
                SEWA TERBATAS
              </span>
              <h3 className="font-serif font-bold text-base text-[#1C1C1C] leading-snug">
                Hemat Hingga 50% Gaun Pesta Malam
              </h3>
              <p className="text-[11px] text-[#6B655C]">
                Khusus reservasi slot sewa akhir pekan ini
              </p>
              <Link
                href="/catalog?category=gaun"
                className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-[#1C1C1C] hover:text-[#C48B54] transition-colors"
              >
                <span>Cek Gaun Pilihan</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="relative w-28 h-28 rounded-xl overflow-hidden shadow-md border border-white flex-shrink-0 bg-white">
              <Image
                src={formatImageUrl(null)}
                alt="Gaun Pesta"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="112px"
              />
            </div>
          </div>

          {/* Banner 2 */}
          <div className="bg-white border border-[#E6E1DA] rounded-2xl p-5 flex items-center justify-between gap-4 relative overflow-hidden group shadow-sm hover:border-[#C48B54] transition-all">
            <div className="flex flex-col gap-1.5 z-10 max-w-[60%]">
              <span className="text-[10px] font-extrabold tracking-widest text-[#8C857B] uppercase">
                KOLEKSI MUSIM BARU
              </span>
              <h3 className="font-serif font-bold text-base text-[#1C1C1C] leading-snug">
                Fresh Designer Arrivals
              </h3>
              <p className="text-[11px] text-[#6B655C]">
                Eksplor siluet terkini dari runway lokal & global
              </p>
              <Link
                href="/catalog?category=terbaru"
                className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-[#1C1C1C] hover:text-[#C48B54] transition-colors"
              >
                <span>Lihat Sekarang</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="relative w-28 h-28 rounded-xl overflow-hidden shadow-md border border-[#E6E1DA] flex-shrink-0 bg-[#FAF7F2]">
              <Image
                src={formatImageUrl(null)}
                alt="New Arrivals"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="112px"
              />
            </div>
          </div>

          {/* Banner 3 - VIP Privilese (Matching Figma) */}
          <div className="bg-[#161616] text-white rounded-2xl p-5 flex items-center justify-between gap-4 relative overflow-hidden group shadow-md hover:border-[#C48B54] border border-[#262626] transition-all">
            <div className="flex flex-col gap-1.5 z-10">
              <span className="text-[10px] font-extrabold tracking-widest text-[#C48B54] uppercase">
                MEMBER PRIVILESE
              </span>
              <h3 className="font-serif font-bold text-base text-white leading-snug">
                Ekstra 15% Off & Free Fitting
              </h3>
              <p className="text-[11px] text-[#A0988D]">
                Gunakan kode eksklusif: <span className="font-bold text-white tracking-wider">ATELIERVIP</span>
              </p>
              <Link
                href="/register"
                className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-[#C48B54] hover:text-white transition-colors"
              >
                <span>Gabung Member</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            {/* VIP Round Circle Badge matching Figma */}
            <div className="w-20 h-20 rounded-full border-2 border-dashed border-[#C48B54] flex flex-col items-center justify-center text-center p-2 flex-shrink-0 bg-[#222222]">
              <span className="text-[8px] font-bold text-[#C48B54] tracking-widest uppercase">VIP</span>
              <span className="text-base font-black text-white leading-none">15%</span>
              <span className="text-[8px] text-[#A0988D] uppercase font-bold">OFF</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

