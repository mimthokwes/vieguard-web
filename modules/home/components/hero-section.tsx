import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, Sparkles, Clock, ArrowRight } from 'lucide-react';

// Replace with your real showroom photo, e.g. '/images/hero-showroom.jpg'
const HERO_IMAGE_SRC = '/placeholder-product.svg';

// Serif font comes from next/font (--font-playfair), with a safe fallback
const SERIF = 'font-[family-name:var(--font-playfair),Georgia,serif]';

const TRUST_BADGES = [
  { icon: ShieldCheck, label: 'Higienis & Dry Cleaned' },
  { icon: Sparkles, label: 'Kualitas Desainer' },
  { icon: Clock, label: 'Pengiriman Kilat' },
];

export function HeroSection() {
  return (
    <section className="w-full pb-10 pt-4 sm:pb-14 sm:pt-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Hero card */}
        <div className="rounded-[28px] border border-[#EAE1D7] bg-gradient-to-br from-[#F8F3EC] to-[#F1E9DF] p-6 shadow-[0_1px_2px_rgba(60,40,20,0.04)] sm:p-10 lg:p-12">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-14">
            {/* Left: text content */}
            <div className="flex flex-col">
              <span className="mb-5 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#C4563A]">
                Elegance. Curated. Accessible.
              </span>

              <h1
                className={`${SERIF} mb-5 text-[2.5rem] font-bold leading-[1.08] tracking-tight text-[#1A1714] sm:text-5xl lg:text-[3.5rem]`}
              >
                Tampil Menawan di
                <br className="hidden lg:block" /> Setiap Momen
                <br className="hidden lg:block" /> Istimewa.
              </h1>

              <p className="mb-8 max-w-md text-sm leading-relaxed text-[#5F584F] sm:text-base">
                Beli koleksi pakaian desainer atau sewa gaun &amp; jas premium
                untuk pernikahan, pesta, dan momen karir Anda dengan kualitas
                higienis berstandar tinggi.
              </p>

              {/* Actions: styled Links, no <button> nested inside <Link> */}
              <div className="flex flex-wrap items-center gap-5">
                <Link
                  href="/catalog"
                  className="inline-flex items-center gap-2 rounded-full bg-[#161616] px-7 py-3.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#2E2A26]"
                >
                  Jelajahi Koleksi
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/catalog"
                  className="text-sm font-semibold text-[#1A1714] underline decoration-[#1A1714]/40 underline-offset-4 transition-colors hover:text-[#C4563A] hover:decoration-[#C4563A]"
                >
                  Cara Kerja Rental
                </Link>
              </div>

              {/* Trust badges */}
              <ul className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-[#E3D9CD] pt-6 text-xs font-medium text-[#4A443D]">
                {TRUST_BADGES.map(({ icon: Icon, label }) => (
                  <li key={label} className="flex items-center gap-2">
                    <Icon className="h-4 w-4" strokeWidth={1.75} />
                    <span>{label}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: image showcase */}
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-[#E9DFD3] shadow-[0_20px_40px_-12px_rgba(40,25,10,0.35)] ring-1 ring-black/5 lg:aspect-[10/7]">
              <Image
                src={HERO_IMAGE_SRC}
                alt="Vieguard Spring/Summer collection showroom"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />

              {/* Soft gradient so the glass card stays readable on any photo */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/25 to-transparent" />

              {/* Floating glass card */}
              <div className="absolute inset-x-4 bottom-4 flex items-center justify-between gap-3 rounded-xl border border-white/60 bg-white/80 px-4 py-3 shadow-lg backdrop-blur-md">
                <div className="min-w-0">
                  <span className="block text-[10px] font-semibold uppercase tracking-widest text-[#C4563A]">
                    Spring/Summer &apos;25
                  </span>
                  <h3
                    className={`${SERIF} truncate text-sm font-bold text-[#1A1714]`}
                  >
                    The Celestial Silk Gala Collection
                  </h3>
                </div>
                <Link
                  href="/catalog"
                  className="shrink-0 rounded-md bg-[#161616] px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#2E2A26]"
                >
                  Lihat Detail
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}