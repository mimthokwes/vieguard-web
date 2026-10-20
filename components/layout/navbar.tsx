'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bell, LogOut, Menu, MessageCircle, Package, Search, ShoppingCart, User as UserIcon, X } from 'lucide-react';
import { User } from '@/types/user';
import { logoutAction } from '@/app/actions';
import { ButtonLink } from '@/components/ui/button';
import { initials } from '@/lib/format';
import { Logo } from './logo';
import { NAV_LINKS } from '@/components/layout/nav-links';

interface NavbarProps {
  user?: User | null;
  unreadCount?: number; // notifikasi
  cartCount?: number; // jumlah item keranjang pesanan
  chatUnreadCount?: number; // chat belum dibaca
}

function isActive(pathname: string, href: string) {
  const path = href.split('?')[0];
  if (path === '/') return pathname === '/';
  return pathname === path || pathname.startsWith(`${path}/`);
}

function IconLink({ href, label, count = 0, children }: { href: string; label: string; count?: number; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      aria-label={count > 0 ? `${label}, ${count}` : label}
      className="flex flex-col items-center gap-0.5 rounded-lg px-2 py-1 text-ink-soft transition-colors hover:bg-beige-soft hover:text-primary"
    >
      <span className="relative">
        {children}
        {count > 0 && (
          <span className="absolute -right-2 -top-1.5 flex min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-bold leading-4 text-white">
            {count > 99 ? '99+' : count}
          </span>
        )}
      </span>
      <span className="text-[10px] font-medium leading-none">{label}</span>
    </Link>
  );
}

export function Navbar({ user, unreadCount = 0, cartCount = 0, chatUnreadCount = 0 }: NavbarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const activeHref = NAV_LINKS.find((l) => isActive(pathname, l.href))?.href;

  return (
    <header className="top-1 z-50 w-full flex flex-col mt-2">
      <div className="mx-auto flex h-10 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Logo />

        {/* Search input */}
        <div className="flex flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <input
              type="search"
              id="navbar-search"
              placeholder="Cari kostume..."
              className="w-full rounded-md border border-line bg-surface pl-2 pr-4 py-1.5 text-sm text-ink placeholder:text-muted outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              aria-label="Cari produk"
            />
            <button className='absolute right-0 rounded-md top-1/2 bg-black h-full w-8 -translate-y-1/2 cursor-pointer flex items-center justify-center'>
              <Search
                className="size-4"
                color='#ffffff'
              />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {user ? (
            <>
              <IconLink href="/orders" label="Keranjang" count={cartCount}>
                <ShoppingCart className="size-5" />
              </IconLink>

              <IconLink href="/chat" label="Chat" count={chatUnreadCount}>
                <MessageCircle className="size-5" />
              </IconLink>

              {/* Hover card akun */}
              <div className="group relative">
                <button
                  type="button"
                  aria-haspopup="menu"
                  className="relative flex flex-col items-center gap-0.5 rounded-lg px-2 py-1 transition-colors hover:bg-beige-soft"
                >
                  <span className="flex size-5 items-center justify-center rounded-full border border-gold-light bg-maroon-gradient text-[9px] font-extrabold text-gold-light">
                    {initials(user.name)}
                  </span>
                  <span className="text-[10px] font-medium leading-none text-ink-soft">Akun</span>
                  {unreadCount > 0 && <span className="absolute right-1.5 top-0.5 size-2.5 rounded-full border border-surface bg-danger" />}
                </button>

                {/* pt-2 (bukan mt-2) supaya tidak ada celah yang memutus hover */}
                <div className="invisible absolute right-0 top-full pt-2 opacity-0 transition-opacity duration-150 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                  <div role="menu" className="w-60 overflow-hidden rounded-xl border border-line bg-surface py-1 shadow-card">
                    <div className="border-b border-line px-4 py-3">
                      <p className="truncate text-sm font-bold text-ink">{user.name}</p>
                      <p className="truncate text-xs text-muted">{user.email}</p>
                    </div>
                    <Link
                      role="menuitem"
                      href="/profile"
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-ink-soft hover:bg-beige-soft hover:text-primary"
                    >
                      <UserIcon className="size-4" /> Profil & Ukuran Tersimpan
                    </Link>

                    <Link
                      role="menuitem"
                      href="/notifications"
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-ink-soft hover:bg-beige-soft hover:text-primary"
                    >
                      <Bell className="size-4" /> Notifikasi
                      {unreadCount > 0 && (
                        <span className="ml-auto rounded-full bg-danger px-1.5 text-[10px] font-bold leading-4 text-white">
                          {unreadCount > 99 ? '99+' : unreadCount}
                        </span>
                      )}
                    </Link>

                    <Link
                      role="menuitem"
                      href="/orders"
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-ink-soft hover:bg-beige-soft hover:text-primary"
                    >
                      <Package className="size-4" /> Pesanan & Sewa Saya
                    </Link>
                    <form action={logoutAction} className="border-t border-line">
                      <button
                        role="menuitem"
                        type="submit"
                        className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-danger hover:bg-danger-bg"
                      >
                        <LogOut className="size-4" /> Keluar
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <span className="hidden sm:block">
                <ButtonLink href="/login">Masuk / Daftar</ButtonLink>
              </span>
              <Link
                href="/login"
                aria-label="Akun"
                className="flex size-9 items-center justify-center rounded-full bg-primary text-on-primary"
              >
                <UserIcon className="size-4" />
              </Link>
            </>
          )}

          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="flex size-10 items-center justify-center rounded-lg text-ink min-[400px]:hidden hover:bg-beige-soft"
            aria-label={mobileOpen ? 'Tutup menu' : 'Buka menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      <div className="hidden min-[400px]:block">
        <nav
          className="mx-auto py-2  flex max-w-7xl items-center justify-around gap-1 overflow-x-auto px-4 sm:px-6 [scrollbar-width:none]"
          aria-label="Navigasi utama"
        >
          {NAV_LINKS.map((link) => {
            const active = link.href === activeHref;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? 'page' : undefined}
                className={`whitespace-nowrap rounded-lg px-3 text-[13px] transition-colors ${active ? 'bg-beige-soft font-bold text-primary' : 'font-medium text-ink-soft hover:bg-beige-soft hover:text-primary'
                  }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {mobileOpen && (
        <nav className="border-t border-line bg-surface px-4 py-3 min-[400px]:hidden" aria-label="Navigasi utama (seluler)">
          <ul className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => {
              const active = link.href === activeHref;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`block rounded-lg px-4 py-2.5 text-sm ${active ? 'bg-primary font-bold text-on-primary' : 'text-ink-soft hover:bg-beige-soft hover:text-primary'
                      }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
          {!user && (
            <ButtonLink href="/login" fullWidth className="mt-3">
              Masuk / Daftar
            </ButtonLink>
          )}
        </nav>
      )}
    </header>
  );
}
