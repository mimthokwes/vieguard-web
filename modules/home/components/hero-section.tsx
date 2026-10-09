import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, Sparkles, Zap, ArrowRight } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="w-full bg-[#FAF7F2] py-8 sm:py-12 border-b border-[#E6E1DA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Text Content */}
          <div className="lg:col-span-7 flex flex-col gap-5">
            <span className="text-xs font-bold tracking-[0.25em] text-[#C48B54] uppercase">
              ELEGANCE. CURATED. ACCESSIBLE.
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1C1C1C] leading-[1.15]">
              Tampil Menawan di Setiap Momen Istimewa.
            </h1>
            <p className="text-xs sm:text-sm text-[#6B655C] leading-relaxed max-w-xl">
              Beli koleksi pakaian desainer atau sewa gaun & jas premium untuk pernikahan, pesta, dan momen karir Anda dengan kualitas higienis berstandar tinggi.
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link href="/catalog">
                <button className="bg-[#161616] hover:bg-[#C48B54] text-white font-bold text-xs sm:text-sm px-6 py-3.5 rounded-xl transition-all flex items-center gap-2 shadow-sm cursor-pointer">
                  <span>Jelajahi Koleksi</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
              <Link href="/catalog" className="text-xs sm:text-sm font-bold text-[#1C1C1C] hover:text-[#C48B54] transition-colors py-3.5 px-4 underline decoration-[#C48B54]/40 underline-offset-4">
                Cara Kerja Rental
              </Link>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-[#E6E1DA] text-xs font-semibold text-[#1C1C1C]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#C48B54]" />
                <span>Higienis & Dry Cleaned</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#C48B54]" />
                <span>Kualitas Desainer</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#C48B54]" />
                <span>Pengiriman Kilat</span>
              </div>
            </div>
          </div>

          {/* Right Image Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-[#E6E1DA] bg-[#F3EDE6] flex items-center justify-center">
              <Image
                src="/placeholder-product.svg"
                alt="Vieguard Collection"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              {/* Overlay Glass Banner */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-white/60 flex items-center justify-between shadow-lg">
                <div>
                  <span className="text-[9px] font-bold tracking-widest text-[#C48B54] uppercase block">
                    SPRING/SUMMER &apos;25
                  </span>
                  <h3 className="font-serif text-xs sm:text-sm font-bold text-[#1C1C1C]">
                    The Celestial Silk Gala Collection
                  </h3>
                </div>
                <Link href="/catalog">
                  <button className="bg-[#161616] hover:bg-[#C48B54] text-white text-xs font-bold py-2 px-3.5 rounded-lg transition-colors whitespace-nowrap cursor-pointer shadow-sm">
                    Lihat Detail
                  </button>
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

