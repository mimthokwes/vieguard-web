import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { formatImageUrl } from '@/lib/image';

interface Category {
  name: string;
  href: string;
  // Optional local image from /public, e.g. '/images/categories/kebaya.jpg'
  image?: string;
}

const CATEGORIES: Category[] = [
  { name: 'Koleksi Terbaru', href: '/catalog?category=terbaru' },
  { name: 'Kebaya Modern', href: '/catalog?category=kebaya' },
  { name: 'Traditional Batik', href: '/catalog?category=batik' },
  { name: 'Kostum Pawai', href: '/catalog?category=pawai' },
  { name: 'Beskap & Jas Adat', href: '/catalog?category=jas' },
  { name: 'Baju Kurung & Kaftan', href: '/catalog?category=muslim' },
  { name: 'Aksesoris', href: '/catalog?category=aksesoris' },
  { name: 'Best Seller', href: '/catalog?sort=populer' },
];

export function CategoriesSection() {
  return (
    <section className="w-full py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-[#1A1714] sm:text-xl">
            Kategori Pilihan
          </h2>
          <Link
            href="/catalog"
            className="flex items-center gap-1 text-xs font-medium text-[#6F675D] transition-colors hover:text-[#1A1714]"
          >
            <span>Lihat semua kategori</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Mobile: horizontal scroll. Desktop: 8 equal columns */}
        <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:-mx-6 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-8 lg:gap-2 lg:overflow-visible lg:px-0 lg:pb-0 [&::-webkit-scrollbar]:hidden">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.name}
              href={cat.href}
              className="group flex w-24 shrink-0 flex-col items-center gap-3 text-center lg:w-auto"
            >
              <div className="relative h-20 w-20 overflow-hidden rounded-full border-[3px] border-[#EADFD0] bg-[#F3ECE2] shadow-[0_2px_8px_-2px_rgba(60,40,20,0.15)] transition-all duration-300 group-hover:scale-105 group-hover:border-[#C4563A]/60 sm:h-[88px] sm:w-[88px]">
                <Image
                  src={cat.image ?? formatImageUrl(null)}
                  alt={cat.name}
                  fill
                  sizes="88px"
                  className="object-cover"
                />
              </div>
              <span className="text-[13px] font-medium leading-snug text-[#1A1714] transition-colors group-hover:text-[#C4563A]">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}