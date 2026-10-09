import React from 'react';
import Link from 'next/link';
import { Music2, Disc } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full bg-[#141414] text-white pt-16 pb-8 border-t border-[#262626]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-[#262626]">
          
          {/* Brand Info */}
          <div className="md:col-span-5 flex flex-col gap-4">
            <Link href="/" className="flex flex-col">
              <span className="font-serif text-2xl font-bold tracking-[0.25em] text-white">
                VIEGUARD
              </span>
              <span className="text-[10px] tracking-[0.2em] font-semibold text-[#A0988D] uppercase -mt-1">
                Boutique & Rental
              </span>
            </Link>
            <p className="text-xs text-[#A0988D] leading-relaxed max-w-sm">
              Destinasi terpercaya kurasi busana desainer dan platform rental gaun & jas premium di Indonesia. Elegan, higienis, dan memudahkan setiap momen berharga Anda.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-3 mt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="w-8 h-8 rounded-full bg-[#222222] border border-[#333333] flex items-center justify-center text-[#A0988D] hover:text-white hover:border-[#C48B54] transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noreferrer"
                aria-label="TikTok"
                className="w-8 h-8 rounded-full bg-[#222222] border border-[#333333] flex items-center justify-center text-[#A0988D] hover:text-white hover:border-[#C48B54] transition-colors"
              >
                <Music2 className="w-4 h-4" />
              </a>
              <a
                href="https://pinterest.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Pinterest"
                className="w-8 h-8 rounded-full bg-[#222222] border border-[#333333] flex items-center justify-center text-[#A0988D] hover:text-white hover:border-[#C48B54] transition-colors"
              >
                <Disc className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links Column 1 */}
          <div className="md:col-span-3 flex flex-col gap-3">
            <h4 className="text-xs font-bold tracking-widest text-white uppercase">
              KOLEKSI
            </h4>
            <ul className="flex flex-col gap-2.5 text-xs text-[#A0988D]">
              <li>
                <Link href="/catalog?category=kebaya" className="hover:text-white transition-colors">
                  Kebaya & Encim
                </Link>
              </li>
              <li>
                <Link href="/catalog?category=batik" className="hover:text-white transition-colors">
                  Traditional Batik
                </Link>
              </li>
              <li>
                <Link href="/catalog?category=jas" className="hover:text-white transition-colors">
                  Beskap & Busana Adat
                </Link>
              </li>
              <li>
                <Link href="/catalog?category=pawai" className="hover:text-white transition-colors">
                  Kostum Pawai & Festival
                </Link>
              </li>
              <li>
                <Link href="/catalog?category=muslim" className="hover:text-white transition-colors">
                  Busana Muslim & Kaftan
                </Link>
              </li>
              <li>
                <Link href="/catalog?category=aksesoris" className="hover:text-white transition-colors">
                  Aksesoris Pesta & Clutch
                </Link>
              </li>
            </ul>
          </div>

          {/* Links Column 2 */}
          <div className="md:col-span-4 flex flex-col gap-3">
            <h4 className="text-xs font-bold tracking-widest text-white uppercase">
              BANTUAN & LAYANAN
            </h4>
            <ul className="flex flex-col gap-2.5 text-xs text-[#A0988D]">
              <li>
                <Link href="/faq" className="hover:text-white transition-colors">
                  Pusat Bantuan & FAQ
                </Link>
              </li>
              <li>
                <Link href="/size-guide" className="hover:text-white transition-colors">
                  Panduan Ukuran (Size Guide)
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Kebijakan Retur & Deposit
                </Link>
              </li>
              <li>
                <Link href="/hygiene" className="hover:text-white transition-colors">
                  Standar Higienitas Laundry
                </Link>
              </li>
              <li>
                <Link href="/booking" className="hover:text-white transition-colors">
                  Booking Fitting Room Butik
                </Link>
              </li>
              <li>
                <Link href="/chat" className="hover:text-white transition-colors">
                  Hubungi Stylist Personal
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#737373]">
          <p>© 2025 VIEGUARD Atelier & Rental Indonesia. Hak cipta dilindungi undang-undang.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-white transition-colors">
              Kebijakan Privasi
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Syarat & Ketentuan
            </Link>
            <Link href="/cookies" className="hover:text-white transition-colors">
              Kebijakan Cookie
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
