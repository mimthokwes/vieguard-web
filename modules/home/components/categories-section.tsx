import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { formatImageUrl } from '@/lib/image';

export function CategoriesSection() {
  const categories = [
    { name: 'Koleksi Terbaru', href: '/catalog?category=terbaru' },
    { name: 'Kebaya Modern', href: '/catalog?category=kebaya' },
    { name: 'Traditional Batik', href: '/catalog?category=batik' },
    { name: 'Kostum Pawai', href: '/catalog?category=pawai' },
    { name: 'Beskap & Jas Adat', href: '/catalog?category=jas' },
    { name: 'Baju Kurung & Kaftan', href: '/catalog?category=muslim' },
    { name: 'Aksesoris', href: '/catalog?category=aksesoris' },
    { name: 'Best Seller', href: '/catalog?sort=populer' },
  ];

  return (
    <section className="w-full py-10 bg-white border-b border-[#E6E1DA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1C1C1C]">
            Kategori Pilihan
          </h2>
          <Link
            href="/catalog"
            className="text-xs font-bold text-[#1C1C1C] hover:text-[#C48B54] flex items-center gap-1 transition-colors"
          >
            <span>Lihat semua kategori</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Category Grid (8 Circular Avatars matching Figma) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 text-center">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={cat.href}
              className="group flex flex-col items-center gap-3 p-2 rounded-2xl hover:bg-[#FAF7F2] transition-all duration-300"
            >
              <div className="relative w-20 h-20 sm:w-22 sm:h-22 rounded-full overflow-hidden border-2 border-[#E6E1DA] group-hover:border-[#C48B54] group-hover:scale-105 transition-all shadow-sm bg-[#FAF7F2] flex items-center justify-center">
                <Image
                  src={formatImageUrl(null)}
                  alt={cat.name}
                  fill
                  className="object-cover"
                  sizes="88px"
                />
              </div>
              <span className="text-xs font-bold text-[#1C1C1C] group-hover:text-[#C48B54] transition-colors leading-tight line-clamp-2 max-w-[100px]">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}

