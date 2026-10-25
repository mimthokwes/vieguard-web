'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bell, ChevronDown, LogOut, Menu, MessageCircle, Search, ShoppingCart, User as UserIcon, X } from 'lucide-react';
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

// --- Pengaturan perilaku auto-hide ---------------------------------------
const HIDE_AT = 80; // navbar mulai boleh sembunyi setelah scroll sejauh ini (px)
const SHOW_AT = 16; // di bawah ini navbar selalu tampil penuh (px)
const REOPEN_GRACE = 60; // setelah dibuka lewat "ekor", scroll turun segini baru sembunyi lagi (px)
const SHOW_ON_SCROLL_UP = false; // true = muncul lagi otomatis saat scroll ke atas (ala Safari)
const REVEAL_DELTA = 12; // seberapa cepat scroll ke atas dianggap disengaja (px per frame)

function isActive(pathname: string, href: string) {
  const path = href.split('?')[0];
  if (path === '/') return pathname === '/';
  return pathname === path || pathname.startsWith(`${path}/`);
}

/**
 * Navbar sembunyi saat scroll turun, tampil penuh saat kembali ke paling atas.
 * `lock` = true menahan navbar tetap tampil (mis. menu seluler terbuka / ada fokus di dalamnya).
 */
function useAutoHide(lock: boolean) {
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);
  const anchorY = useRef<number | null>(null); // posisi scroll saat navbar dibuka manual
  const lockRef = useRef(lock);

  useEffect(() => {
    lockRef.current = lock;
  }, [lock]);

  useEffect(() => {
    let raf = 0;
    lastY.current = window.scrollY;

    const update = () => {
      raf = 0;
      const y = window.scrollY;
      const delta = y - lastY.current;
      lastY.current = y;

      // Di paling atas: selalu tampil
      if (y < SHOW_AT) {
        anchorY.current = null;
        setHidden(false);
        return;
      }
      if (lockRef.current) return;

      if (SHOW_ON_SCROLL_UP && delta < -REVEAL_DELTA) {
        anchorY.current = y;
        setHidden(false);
        return;
      }

      if (anchorY.current !== null && y < anchorY.current) anchorY.current = y;
      const from = anchorY.current ?? 0;
      if (delta > 0 && y > HIDE_AT && y - from > REOPEN_GRACE) setHidden(true);
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const show = () => {
    anchorY.current = window.scrollY;
    setHidden(false);
  };

  return { hidden, show };
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
      <span className="text-[12px] font-medium leading-none">{label}</span>
    </Link>
  );
}

export function Navbar({ user, unreadCount = 0, cartCount = 0, chatUnreadCount = 0 }: NavbarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [focusInside, setFocusInside] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  const { hidden, show } = useAutoHide(mobileOpen || focusInside);

  // Saat tersembunyi, isi navbar tidak boleh bisa difokus keyboard / dibaca screen reader
  useEffect(() => {
    headerRef.current?.toggleAttribute('inert', hidden);
  }, [hidden]);

  const activeHref = NAV_LINKS.find((l) => isActive(pathname, l.href))?.href;

  return (
    <>
      <header
        ref={headerRef}
        onFocus={() => setFocusInside(true)}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocusInside(false);
        }}
        style={{ transform: hidden ? 'translateY(calc(-100% - 0.5rem))' : 'translateY(0)' }}
        className="sticky top-1 z-50 mt-2 flex w-[95%] flex-col items-center justify-center rounded-lg bg-surface shadow transition-transform duration-300 ease-out motion-reduce:transition-none"
      >
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Logo />

          {/* Search input */}
          <div className="mx-4 flex max-w-md flex-1">
            <div className="relative w-full">
              <input
                type="search"
                id="navbar-search"
                placeholder="Cari kostume..."
                className="w-full rounded-md border border-line bg-surface py-1.5 pl-2 pr-14 text-sm text-ink outline-none transition-all placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/20"
                aria-label="Cari produk"
              />
              <button
                type="button"
                aria-label="Cari"
                className="absolute right-0 top-0 flex h-full w-12 cursor-pointer items-center justify-center rounded-r-md bg-black"
              >
                <Search className="size-4" color="#ffffff" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {user ? (
              <>
                {/* Hover card akun */}
                <div className="group relative">
                  <button
                    type="button"
                    aria-haspopup="menu"
                    className="relative flex flex-col items-center gap-0.5 rounded-lg px-2 py-1 transition-colors hover:bg-beige-soft"
                  >
                    <span className="flex size-7 items-center justify-center rounded-full border border-gold-light bg-maroon-gradient text-[10px] font-extrabold text-gold-light">
                      {initials(user.name)}
                    </span>
                    <span className="text-[12px] font-medium leading-none text-ink-soft">Akun</span>
                    {unreadCount > 0 && <span className="absolute right-1.5 top-0.5 size-2.5 rounded-full border border-surface bg-danger" />}
                  </button>

                  {/* pt-2 (bukan mt-2) supaya tidak ada celah yang memutus hover */}
                  <div className="invisible absolute right-0 top-full pt-2 opacity-0 transition-opacity duration-150 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
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

                <IconLink href="/chat" label="Obrolan" count={chatUnreadCount}>
                  <MessageCircle className="size-6" />
                </IconLink>

                <IconLink href="/orders" label="Pesan" count={cartCount}>
                  <ShoppingCart className="size-6" />
                </IconLink>
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
              className="flex size-10 items-center justify-center rounded-lg text-ink hover:bg-beige-soft min-[400px]:hidden"
              aria-label={mobileOpen ? 'Tutup menu' : 'Buka menu'}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        <div className="hidden w-[80%] min-[400px]:block">
          <nav
            className="scrollbar-none mx-auto flex max-w-7xl items-center justify-around gap-1 overflow-x-auto px-4 py-2 sm:px-6"
            aria-label="Navigasi utama"
          >
            {NAV_LINKS.map((link) => {
              const active = link.href === activeHref;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? 'page' : undefined}
                  className={`whitespace-nowrap rounded-lg px-3 text-[16px] transition-colors ${
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
          <nav className="w-full border-t border-line bg-surface px-4 py-3 min-[400px]:hidden" aria-label="Navigasi utama (seluler)">
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

      {/* "Ekor" kecil: muncul saat navbar sembunyi, klik untuk membuka kembali.
          Dibuat di luar <header> karena header di-inert saat tersembunyi. */}
      <button
        type="button"
        onClick={show}
        aria-label="Tampilkan navigasi"
        aria-expanded={!hidden}
        tabIndex={hidden ? 0 : -1}
        className={`fixed left-1/2 top-0 z-50 flex h-6 w-16 -translate-x-1/2 items-center justify-center rounded-b-xl bg-surface text-ink-soft shadow-md transition-all duration-300 ease-out hover:text-primary motion-reduce:transition-none ${
          hidden ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-full opacity-0'
        }`}
      >
        <ChevronDown className="size-4" />
      </button>
    </>
  );
}