'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bell, ChevronDown, LogOut, Menu, Package, User as UserIcon, X } from 'lucide-react';
import { User } from '@/types/user';
import { logoutAction } from '@/app/actions';
import { ButtonLink } from '@/components/ui/button';
import { initials } from '@/lib/format';
import { Logo } from './logo';
import { NAV_LINKS } from '@/components/layout/nav-links';

interface NavbarProps {
  user?: User | null;
  unreadCount?: number;
}

function isActive(pathname: string, href: string) {
  const path = href.split('?')[0];
  if (path === '/') return pathname === '/';
  return pathname === path || pathname.startsWith(`${path}/`);
}

export function Navbar({ user, unreadCount = 0 }: NavbarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const activeHref = NAV_LINKS.find((l) => isActive(pathname, l.href))?.href;

  return (
    <header className="sticky top-1 z-50 w-full flex flex-col">
      <div className="mx-auto flex h-10 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Logo />

        <div className="flex items-center gap-2.5">
          <Link
            href="/notifications"
            aria-label={unreadCount > 0 ? `Notifikasi, ${unreadCount} belum dibaca` : 'Notifikasi'}
            className="relative flex size-10 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-beige-soft hover:text-primary"
          >
            <Bell className="size-5" />
            {unreadCount > 0 && <span className="absolute right-2.5 top-2 size-2 rounded-full border border-surface bg-danger" />}
          </Link>

          {user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setMenuOpen((v) => !v)}
                onBlur={() => setTimeout(() => setMenuOpen(false), 150)}
                aria-expanded={menuOpen}
                aria-haspopup="menu"
                className="flex items-center gap-2 rounded-xl py-1 pl-1 pr-1 transition-colors hover:bg-beige-soft"
              >
                <span className="flex size-9 items-center justify-center rounded-full border border-gold-light bg-maroon-gradient text-xs font-extrabold text-gold-light">
                  {initials(user.name)}
                </span>
                <span className="hidden max-w-[120px] truncate text-sm font-semibold text-ink xl:inline">{user.name}</span>
                {/* <ChevronDown className="hidden size-4 text-muted lg:block" /> */}
              </button>
              {menuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-line bg-surface py-1 shadow-card"
                >
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
              )}
            </div>
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

      <div className="hidden min-[400px]:block ">
        <nav
          className="mx-auto flex max-w-7xl items-center justify-around gap-1 overflow-x-auto px-4 sm:px-6 [scrollbar-width:none]"
          aria-label="Navigasi utama"
        >
          {NAV_LINKS.map((link) => {
            const active = link.href === activeHref;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? 'page' : undefined}
                className={`whitespace-nowrap rounded-lg px-3 text-[13px] transition-colors ${
                  active ? 'bg-beige-soft font-bold text-primary' : 'font-medium text-ink-soft hover:bg-beige-soft hover:text-primary'
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
                    className={`block rounded-lg px-4 py-2.5 text-sm ${
                      active ? 'bg-primary font-bold text-on-primary' : 'text-ink-soft hover:bg-beige-soft hover:text-primary'
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
