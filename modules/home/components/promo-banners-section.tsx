import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { formatImageUrl } from '@/lib/image';

// Optional local images from /public, e.g. '/images/promo/gaun-pesta.jpg'.
// When undefined, the placeholder from formatImageUrl is used.
const GAUN_IMAGE: string | undefined = undefined;
const ARRIVALS_IMAGE: string | undefined = undefined;

// Shared pieces so the three cards stay consistent
const CARD_BASE =
  'group flex items-center justify-between gap-4 rounded-2xl border p-5 sm:p-6 transition-shadow duration-300 hover:shadow-[0_10px_24px_-14px_rgba(40,25,10,0.35)]';
const EYEBROW = 'text-[10px] font-semibold uppercase tracking-[0.16em]';
const TITLE = 'text-[17px] font-bold leading-snug';
const ARROW =
  'h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5';

export function PromoBannersSection() {
  return (
    <section className="w-full py-4 sm:py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:gap-5">
          {/* Banner 1: limited rental */}
          <div
            className={`${CARD_BASE} border-[#EAE1D7] bg-gradient-to-br from-[#F8F3EC] to-[#F1E9DF]`}
          >
            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
              <span className={`${EYEBROW} text-[#C4563A]`}>Sewa Terbatas</span>
              <h3 className={`${TITLE} text-[#1A1714]`}>
                Hemat Hingga 50% Gaun Pesta Malam
              </h3>
              <p className="text-xs leading-relaxed text-[#6F675D]">
                Khusus reservasi slot sewa akhir pekan ini
              </p>
              <Link
                href="/catalog?category=gaun"
                className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#1A1714] transition-colors hover:text-[#C4563A]"
              >
                Cek Gaun Pilihan
                <ArrowRight className={ARROW} />
              </Link>
            </div>
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-white shadow-md ring-1 ring-black/5 sm:h-28 sm:w-28">
              <Image
                src={GAUN_IMAGE ?? formatImageUrl(null)}
                alt="Gaun pesta malam"
                fill
                sizes="112px"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          </div>

          {/* Banner 2: new arrivals */}
          <div className={`${CARD_BASE} border-[#EAE1D7] bg-[#FBF8F3]`}>
            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
              <span className={`${EYEBROW} text-[#6F675D]`}>
                Koleksi Musim Baru
              </span>
              <h3 className={`${TITLE} text-[#1A1714]`}>
                Fresh Designer Arrivals
              </h3>
              <p className="text-xs leading-relaxed text-[#6F675D]">
                Eksplor siluet terkini dari runway lokal &amp; global
              </p>
              <Link
                href="/catalog?category=terbaru"
                className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#1A1714] transition-colors hover:text-[#C4563A]"
              >
                Lihat Sekarang
                <ArrowRight className={ARROW} />
              </Link>
            </div>
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-[#F3ECE2] shadow-md ring-1 ring-black/5 sm:h-28 sm:w-28">
              <Image
                src={ARRIVALS_IMAGE ?? formatImageUrl(null)}
                alt="Koleksi terbaru"
                fill
                sizes="112px"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          </div>

          {/* Banner 3: VIP member privilege */}
          <div className={`${CARD_BASE} border-[#262626] bg-[#161616]`}>
            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
              <span className={`${EYEBROW} text-[#E3A23B]`}>
                Member Privilege
              </span>
              <h3 className={`${TITLE} text-white`}>
                Ekstra 15% Off &amp; Free Fitting
              </h3>
              <p className="text-xs leading-relaxed text-[#A8A097]">
                Gunakan kode eksklusif:
                <br />
                <span className="font-semibold tracking-wider text-white">
                  ATELIERVIP
                </span>
              </p>
              <Link
                href="/register"
                className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#E3A23B] transition-colors hover:text-white"
              >
                Gabung Member
                <ArrowRight className={ARROW} />
              </Link>
            </div>

            {/* VIP badge */}
            <div
              aria-hidden="true"
              className="flex h-24 w-24 shrink-0 flex-col items-center justify-center rounded-full border-2 border-dashed border-[#E3A23B]/70 text-center sm:h-28 sm:w-28"
            >
              <span className="text-[10px] font-semibold uppercase tracking-widest text-[#E3A23B]">
                VIP
              </span>
              <span className="text-2xl font-bold leading-none text-white">
                15%
              </span>
              <span className="mt-0.5 text-[10px] font-semibold uppercase tracking-widest text-[#E3A23B]">
                Off
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}