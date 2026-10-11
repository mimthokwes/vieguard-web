"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, MessageCircle, User as UserIcon, ShoppingBag, Menu, X, LogOut } from 'lucide-react';
import { User } from '@/types/user';
import { logoutAction } from '@/app/actions';

interface NavbarProps {
  user?: User | null;
  cartCount?: number;
}

// Serif font comes from next/font (--font-playfair), with a safe fallback
const SERIF = 'font-[family-name:var(--font-playfair),Georgia,serif]';

const NAV_CATEGORIES = [
  { label: 'Koleksi Terbaru', href: '/catalog?category=terbaru' },
  { label: 'Kebaya & Encim', href: '/catalog?category=kebaya' },
  { label: 'Traditional Batik', href: '/catalog?category=batik' },
  { label: 'Baju Bodo & Songket', href: '/catalog?category=songket' },
  { label: 'Kostum Pawai & Festival', href: '/catalog?category=pawai' },
  { label: 'Jas & Beskap Adat', href: '/catalog?category=jas' },
  { label: 'Busana Muslim & Kaftan', href: '/catalog?category=muslim' },
  { label: 'Aksesoris', href: '/catalog?category=aksesoris' },
  { label: 'Best Seller', href: '/catalog?category=bestseller' },
];

export function Navbar({ user, cartCount = 2 }: NavbarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim();
    router.push(query ? `/catalog?search=${encodeURIComponent(query)}` : '/catalog');
  };

  // Shared style for the icon-over-label action buttons (Chat, Akun, Keranjang)
  const actionClass =
    'group flex flex-col items-center gap-1 text-[#1A1714] transition-colors hover:text-[#C4563A]';
  const actionLabelClass = 'hidden text-[8px] font-medium leading-none sm:block';

  return (
    <header className="sticky top-3 z-50 mx-auto w-[95%] max-w-7xl px-3 pt-3 sm:px-4 lg:px-6">
      {/* Floating card */}
      <div className="rounded-sm border border-[#E8E1D6] bg-white shadow-[0_8px_24px_-12px_rgba(40,25,10,0.18)]">
        {/* Top row: logo | search | actions (same layout on every screen size) */}
        <div className="flex items-center justify-around gap-2 px-3 py-2 sm:gap-6 sm:px-8 sm:py-4">
          {/* Logo: compact on mobile, roomy from sm and up */}
          <Link
            href="/"
            className="flex shrink-0 flex-col items-center px-1 py-2 leading-none sm:ml-5 sm:p-5"
          >
            <span
              className={`${SERIF} text-sm font-bold tracking-wide text-[#1A1714] sm:text-base md:text-[1.15rem]`}
            >
              VIEGUARD
            </span>
            <span className="mt-1 text-[7px] font-semibold uppercase tracking-[0.12em] text-[#8C857B] sm:text-[9px] sm:tracking-[0.18em]">
              Pesan &amp; Rental
            </span>
          </Link>

          {/* Search: single form for all screen sizes.
              min-w-0 + flex-1 lets it shrink with the screen instead of overflowing. */}
          <form
            onSubmit={handleSearchSubmit}
            className="flex min-w-0 flex-1 items-center rounded-lg border border-[#E8E1D6] bg-[#F7F4EF] p-1 pl-2 transition-colors focus-within:border-[#1A1714]/40 sm:max-w-md sm:pl-4"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari pakaian, gaun pesta, jas, tren terkini..."
              className="w-full min-w-0 bg-transparent text-xs text-[#1A1714] placeholder-[#A39B90] placeholder:text-[10px] focus:outline-none"
            />
            <button
              type="submit"
              aria-label="Cari produk"
              className="m-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-[#161616] text-white transition-colors hover:bg-[#2E2A26] sm:m-1"
            >
              <Search className="h-4 w-4" />
            </button>
          </form>

          {/* Right actions: never shrink, so the search absorbs the remaining space */}
          <div className="flex shrink-0 items-center gap-3 sm:gap-6">
            {/* Chat */}
            <Link href="/chat" className={actionClass}>
              <MessageCircle className="h-4 w-4" strokeWidth={1.75} />
              <span className={actionLabelClass}>Chat</span>
            </Link>

            {/* Account */}
            {user ? (
              <div className="group relative">
                <button type="button" className={actionClass}>
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#1A1714] text-[10px] font-bold text-white">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </span>
                  <span className={`${actionLabelClass} max-w-[64px] truncate`}>
                    {user.name?.split(' ')[0] ?? 'Akun'}
                  </span>
                </button>

                {/* Dropdown: pt-2 (not mt-2) keeps hover alive between button and menu */}
                <div className="absolute right-0 top-full hidden pt-2 group-focus-within:block group-hover:block">
                  <div className="w-52 rounded-xl border border-[#E8E1D6] bg-white py-2 shadow-lg">
                    <div className="border-b border-[#F1ECE4] px-4 py-2">
                      <p className="truncate text-xs font-semibold text-[#1A1714]">{user.name}</p>
                      <p className="truncate text-[11px] text-[#8C857B]">{user.email}</p>
                    </div>
                    <form action={logoutAction}>
                      <button
                        type="submit"
                        className="flex w-full items-center gap-2 px-4 py-2 text-left text-xs text-red-600 transition-colors hover:bg-red-50"
                      >
                        <LogOut className="h-3.5 w-3.5" />
                        Keluar (Logout)
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            ) : (
              <Link href="/login" className={actionClass}>
                <UserIcon className="h-4 w-4" strokeWidth={1.75} />
                <span className={actionLabelClass}>Akun</span>
              </Link>
            )}

            {/* Cart */}
            <Link href="/cart" className={actionClass}>
              <span className="relative">
                <ShoppingBag className="h-4 w-4" strokeWidth={1.75} />
                {cartCount > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-3 min-w-3 items-center justify-center rounded-full bg-[#D9822B] px-1 text-[10px] font-bold leading-none text-white">
                    {cartCount}
                  </span>
                )}
              </span>
              <span className={actionLabelClass}>Keranjang</span>
            </Link>

            {/* Mobile menu toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1 text-[#1A1714] transition-colors hover:text-[#C4563A] md:hidden"
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Category sub-bar (desktop) */}
        <nav className="hidden border-t border-[#EFE9E0] md:block">
          <div className="flex items-center gap-6 px-6 py-3 sm:px-8">
            <Link
              href="/catalog"
              className="flex shrink-0 items-center gap-2 pr-6 text-[12px] font-semibold text-[#1A1714] transition-colors hover:text-[#C4563A]"
            >
              <Menu className="h-3 w-3" />
              Menu
            </Link>
            <ul className="flex items-center gap-6 overflow-x-auto whitespace-nowrap text-[9px] font-medium text-[#3D3832] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {NAV_CATEGORIES.map((cat) => (
                <li key={cat.label}>
                  <Link href={cat.href} className="transition-colors hover:text-[#C4563A]">
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* Mobile drawer */}
        {mobileMenuOpen && (
          <div className="max-h-[70vh] overflow-y-auto border-t border-[#EFE9E0] px-4 py-4 md:hidden">
            <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-[#8C857B]">
              Kategori Koleksi
            </div>
            {[{ label: 'Semua Model', href: '/catalog' }, ...NAV_CATEGORIES].map((cat) => (
              <Link
                key={cat.label}
                href={cat.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block border-b border-[#F1ECE4] py-3 text-sm font-medium text-[#1A1714] transition-colors hover:text-[#C4563A]"
              >
                {cat.label}
              </Link>
            ))}
            {!user ? (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="mt-4 block rounded-full bg-[#161616] py-3 text-center text-sm font-semibold text-white"
              >
                Masuk / Daftar Akun
              </Link>
            ) : (
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="mt-4 w-full rounded-full border border-red-200 bg-red-50 py-3 text-center text-sm font-semibold text-red-600"
                >
                  Keluar (Logout)
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </header>
  );
}