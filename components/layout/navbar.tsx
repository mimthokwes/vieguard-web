"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, MessageSquare, User as UserIcon, ShoppingBag, Menu, X, LogOut } from 'lucide-react';
import { User } from '@/types/user';
import { logoutAction } from '@/app/actions';

interface NavbarProps {
  user?: User | null;
  cartCount?: number;
}

export function Navbar({ user, cartCount = 2 }: NavbarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/catalog?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/catalog');
    }
  };

  const navCategories = [
    { label: 'Semua Model', href: '/catalog' },
    { label: 'Koleksi Terbaru', href: '/catalog?category=terbaru' },
    { label: 'Kebaya & Encim', href: '/catalog?category=kebaya' },
    { label: 'Traditional Batik', href: '/catalog?category=batik' },
    { label: 'Baju Bodo & Songket', href: '/catalog?category=songket' },
    { label: 'Kostum Pawai & Festival', href: '/catalog?category=pawai' },
    { label: 'Jas & Beskap Adat', href: '/catalog?category=jas' },
    { label: 'Busana Muslim & Kaftan', href: '/catalog?category=muslim' },
    { label: 'Aksesoris', href: '/catalog?category=aksesoris' },
  ];

  return (
    <header className="w-full bg-white border-b border-[#E6E1DA] sticky top-0 z-50">
      {/* Main Top Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-4">

          {/* Logo */}
          <Link href="/" className="flex flex-col flex-shrink-0 group">
            <span className="font-serif text-xl sm:text-2xl font-bold tracking-[0.25em] text-[#1C1C1C] group-hover:text-[#C48B54] transition-colors">
              VIEGUARD
            </span>
            <span className="text-[9px] sm:text-[10px] tracking-[0.2em] font-semibold text-[#8C857B] uppercase -mt-1">
              Boutique & Rental
            </span>
          </Link>

          {/* Search Bar (Desktop & Tablet) */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex flex-1 max-w-xl mx-4 items-center bg-[#FAF7F2] border border-[#E6E1DA] rounded-full overflow-hidden focus-within:border-[#C48B54] focus-within:ring-1 focus-within:ring-[#C48B54] transition-all"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari pakaian, gaun pesta, jas, tren terkini..."
              className="w-full px-5 py-2.5 text-xs sm:text-sm bg-transparent text-[#1C1C1C] placeholder-[#8C857B] focus:outline-none"
            />
            <button
              type="submit"
              aria-label="Cari produk"
              className="bg-[#1C1C1C] hover:bg-[#C48B54] text-white p-2.5 px-4 transition-colors flex items-center justify-center"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>

          {/* Right Action Icons */}
          <div className="flex items-center gap-3 sm:gap-6">

            {/* Chat */}
            <Link
              href="/chat"
              className="flex items-center gap-1.5 text-xs font-semibold text-[#1C1C1C] hover:text-[#C48B54] transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-[#FAF7F2] border border-[#E6E1DA] flex items-center justify-center">
                <MessageSquare className="w-4 h-4" />
              </div>
              <span className="hidden lg:inline">Chat</span>
            </Link>

            {/* Account / User Menu */}
            {user ? (
              <div className="relative group">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#1C1C1C] cursor-pointer">
                  <div className="w-8 h-8 rounded-full bg-[#FAF2EA] border border-[#DDB892] text-[#C48B54] flex items-center justify-center font-bold">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="hidden lg:inline max-w-[100px] truncate">{user.name}</span>
                </div>
                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-48 bg-white border border-[#E6E1DA] rounded-xl shadow-lg py-2 hidden group-hover:block z-50">
                  <div className="px-4 py-2 border-b border-[#F3EDE6]">
                    <p className="text-xs font-bold text-[#1C1C1C] truncate">{user.name}</p>
                    <p className="text-[10px] text-[#8C857B] truncate">{user.email}</p>
                  </div>
                  <form action={logoutAction}>
                    <button
                      type="submit"
                      className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Keluar (Logout)
                    </button>
                  </form>
                </div>
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-1.5 text-xs font-semibold text-[#1C1C1C] hover:text-[#C48B54] transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-[#FAF7F2] border border-[#E6E1DA] flex items-center justify-center">
                  <UserIcon className="w-4 h-4" />
                </div>
                <span className="hidden lg:inline">Akun</span>
              </Link>
            )}

            {/* Cart */}
            <Link
              href="/cart"
              className="flex items-center gap-1.5 text-xs font-semibold text-[#1C1C1C] hover:text-[#C48B54] transition-colors relative"
            >
              <div className="w-8 h-8 rounded-full bg-[#FAF7F2] border border-[#E6E1DA] flex items-center justify-center relative">
                <ShoppingBag className="w-4 h-4" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#C48B54] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden lg:inline">Keranjang</span>
            </Link>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[#1C1C1C] hover:text-[#C48B54]"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

          </div>

        </div>

        {/* Mobile Search Bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="mt-3 md:hidden flex items-center bg-[#FAF7F2] border border-[#E6E1DA] rounded-full overflow-hidden"
        >
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari pakaian, gaun pesta, jas..."
            className="w-full px-4 py-2 text-xs bg-transparent text-[#1C1C1C] focus:outline-none"
          />
          <button
            type="submit"
            aria-label="Cari"
            className="bg-[#1C1C1C] text-white p-2 px-3 flex items-center justify-center"
          >
            <Search className="w-3.5 h-3.5" />
          </button>
        </form>

      </div>

      {/* Category Links Sub-bar (Desktop) */}
      <nav className="border-t border-[#F3EDE6] bg-[#FAF7F2] hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ul className="flex items-center gap-6 overflow-x-auto py-2.5 text-xs font-semibold text-[#6B655C] whitespace-nowrap scrollbar-none">
            <li className="flex items-center gap-1.5 text-[#1C1C1C] font-bold hover:text-[#C48B54] cursor-pointer">
              <Menu className="w-3.5 h-3.5" />
              <span>Menu</span>
            </li>
            {navCategories.map((cat) => (
              <li key={cat.label}>
                <Link
                  href={cat.href}
                  className="hover:text-[#1C1C1C] hover:underline transition-colors"
                >
                  {cat.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E6E1DA] bg-white px-4 py-4 space-y-3 shadow-xl">
          <div className="text-xs font-bold text-[#8C857B] uppercase tracking-wider mb-2">
            Kategori Koleksi
          </div>
          {navCategories.map((cat) => (
            <Link
              key={cat.label}
              href={cat.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-medium text-[#1C1C1C] py-2 border-b border-[#F3EDE6] hover:text-[#C48B54]"
            >
              {cat.label}
            </Link>
          ))}
          {!user ? (
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-center bg-[#1C1C1C] text-white py-2.5 rounded-xl text-xs font-semibold mt-4"
            >
              Masuk / Daftar Akun
            </Link>
          ) : (
            <form action={logoutAction}>
              <button
                type="submit"
                className="w-full text-center bg-red-50 text-red-600 border border-red-200 py-2.5 rounded-xl text-xs font-semibold mt-4"
              >
                Keluar (Logout)
              </button>
            </form>
          )}
        </div>
      )}
    </header>
  );
}
