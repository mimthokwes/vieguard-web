'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Bell, LogOut, Menu, MessageCircle, Search, ShoppingCart, User as UserIcon, X } from 'lucide-react';
import { User } from '@/types/user';
import { logoutAction } from '@/app/actions';
import { ButtonLink } from '@/components/ui/button';
import { Logo } from './logo';
import { NAV_LINKS } from '@/components/layout/nav-links';
import { useNotifications } from '@/modules/notifications/hooks/use-notifications';

interface NavbarProps {
  user?: User | null;
  unreadCount?: number; // notifikasi
  cartCount?: number; // jumlah item keranjang pesanan
}

function isActive(pathname: string, href: string) {
  const path = href.split('?')[0];
  if (path === '/') return pathname === '/';
  return pathname === path || pathname.startsWith(`${path}/`);
}

function IconLink({
  href,
  label,
  count = 0,
  hasDot = false,
  isTransparent = false,
  isScrolled = false,
  children,
}: {
  href: string;
  label: string;
  count?: number;
  hasDot?: boolean;
  isTransparent?: boolean;
  isScrolled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-label={count > 0 ? `${label}, ${count}` : label}
      title={label}
      className={`relative flex size-8 sm:size-9 items-center justify-center transition-colors rounded-lg ${
        isScrolled
          ? 'text-ink-soft hover:bg-beige-soft hover:text-primary'
          : isTransparent
            ? 'text-ink hover:bg-white/40 hover:text-primary'
            : 'text-ink-soft hover:bg-beige-soft hover:text-primary'
      }`}
    >
      <span className="relative flex items-center justify-center">
        {children}
        {hasDot && count === 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex size-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-danger opacity-75" />
            <span className="relative inline-flex size-2.5 rounded-full border-2 border-surface bg-danger" />
          </span>
        )}
        {count > 0 && (
          <span className="absolute -right-2 -top-1.5 flex min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-bold leading-4 text-white">
            {count > 99 ? '99+' : count}
          </span>
        )}
      </span>
    </Link>
  );
}

function GoogleLogo({ className = 'size-3.5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

export function Navbar({ user, unreadCount = 0, cartCount = 0 }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Reactive notification count via TanStack Query cache
  const { unreadCount: liveCount } = useNotifications({
    initialUnreadCount: unreadCount,
    enabled: Boolean(user),
  });
  const activeUnreadCount = user ? (liveCount !== undefined ? liveCount : unreadCount) : 0;

  const urlQuery = searchParams.get('q') || searchParams.get('search') || '';
  const [searchValue, setSearchValue] = useState(urlQuery);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const headerRef = useRef<HTMLElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const isHome = pathname === '/';
  const isTransparent = isHome && !isScrolled && !mobileOpen && !mobileSearchOpen;

  // Listen to scroll to update compact 85% vs full-width state
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Sync input when query in URL changes
  useEffect(() => {
    setSearchValue(urlQuery);
  }, [urlQuery]);

  // Close menus on navigation
  useEffect(() => {
    setMobileOpen(false);
    setMobileSearchOpen(false);
    setAccountOpen(false);
  }, [pathname]);

  // Autofocus search on mobile when opened
  useEffect(() => {
    if (mobileSearchOpen) {
      searchInputRef.current?.focus();
    }
  }, [mobileSearchOpen]);

  // Close menu and search on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setMobileOpen(false);
        setMobileSearchOpen(false);
        setAccountOpen(false);
      }
    };
    if (mobileOpen || mobileSearchOpen || accountOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('touchstart', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
    };
  }, [mobileOpen, mobileSearchOpen, accountOpen]);

  const activeHref = NAV_LINKS.find((l) => isActive(pathname, l.href))?.href;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = searchValue.trim();
    if (clean) {
      router.push(`/catalog?q=${encodeURIComponent(clean)}`);
    } else {
      router.push('/catalog');
    }
  };

  return (
    <>
      {/* Spacer placeholder for non-home pages to prevent layout shift under fixed navbar */}
      {!isHome && <div className="h-14 md:h-24 w-full shrink-0" aria-hidden="true" />}

      {/* Floating Centered Wrapper */}
      <div
        className={`fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none transition-all duration-300 ease-out ${
          isScrolled ? 'pt-2 sm:pt-3' : 'pt-0'
        }`}
      >
        <header
          ref={headerRef}
          className={`pointer-events-auto transition-all duration-300 ease-out relative ${
            isScrolled
              ? 'w-[85%] max-w-6xl rounded-2xl bg-surface/95 backdrop-blur-md shadow-card border border-line/80 px-3 sm:px-5 py-1.5 sm:py-2'
              : isTransparent
                ? 'w-full bg-transparent border-b border-transparent shadow-none px-3 sm:px-6 lg:px-8 py-2'
                : 'w-full bg-surface shadow-xs border-b border-line px-3 sm:px-6 lg:px-8 py-2'
          }`}
        >
          {/* Main Bar (Single row when scrolled, Row 1 of 2 when not scrolled) */}
          <div className="flex w-full items-center justify-between gap-2 sm:gap-4">
            <Logo hideTextOnMobile className={isScrolled ? 'scale-95 origin-left' : ''} />

            {/* When SCROLLED: Tab list merged into this single top row */}
            {isScrolled && (
              <div className="hidden flex-1 items-center justify-center md:flex px-2">
                <nav
                  className="scrollbar-none flex items-center justify-center gap-1 lg:gap-2 xl:gap-3 overflow-x-auto"
                  aria-label="Navigasi utama"
                >
                  {NAV_LINKS.map((link) => {
                    const active = link.href === activeHref;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        aria-current={active ? 'page' : undefined}
                        className={`whitespace-nowrap rounded-lg px-2.5 py-1 text-xs lg:text-sm transition-colors ${
                          active
                            ? 'bg-beige-soft font-bold text-primary shadow-xs'
                            : 'font-medium text-ink-soft hover:bg-beige-soft hover:text-primary'
                        }`}
                      >
                        {link.label}
                      </Link>
                    );
                  })}
                </nav>
              </div>
            )}

            {/* When NOT SCROLLED: Full Desktop Search form */}
            {!isScrolled && (
              <form onSubmit={handleSearchSubmit} className="mx-4 hidden max-w-md flex-1 md:flex">
                <div className="relative w-full">
                  <input
                    type="search"
                    id="navbar-search"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder="Cari seragam, topi, acara..."
                    className={`w-full rounded-md border py-1.5 pl-3 pr-14 text-sm text-ink outline-none transition-all placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/20 ${
                      isTransparent ? 'border-black/15 bg-surface/95 shadow-xs' : 'border-line bg-surface'
                    }`}
                    aria-label="Cari produk"
                  />
                  <button
                    type="submit"
                    aria-label="Cari"
                    className="absolute right-0 top-0 flex h-full w-12 cursor-pointer items-center justify-center rounded-r-md bg-black text-white transition-opacity hover:opacity-90 active:scale-95"
                  >
                    <Search className="size-4" color="#ffffff" />
                  </button>
                </div>
              </form>
            )}

            {/* Right Side items: Compact Search (when scrolled) + Action buttons */}
            <div className="flex items-center gap-1 sm:gap-2 shrink-0">
              {/* When SCROLLED: Compact Search form */}
              {isScrolled && (
                <form onSubmit={handleSearchSubmit} className="hidden items-center md:flex mr-1">
                  <div className="relative w-32 lg:w-40 xl:w-48 transition-all">
                    <input
                      type="search"
                      id="navbar-search-compact"
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                      placeholder="Cari..."
                      className="h-8 w-full rounded-md border border-line bg-canvas/90 py-1 pl-2.5 pr-8 text-xs text-ink outline-none transition-all placeholder:text-muted focus:w-44 lg:focus:w-52 focus:border-primary focus:bg-surface focus:ring-1 focus:ring-primary/20"
                      aria-label="Cari produk"
                    />
                    <button
                      type="submit"
                      aria-label="Cari"
                      className="absolute right-0 top-0 flex h-full w-7 cursor-pointer items-center justify-center rounded-r-md bg-black text-white transition-opacity hover:opacity-90 active:scale-95"
                    >
                      <Search className="size-3" color="#ffffff" />
                    </button>
                  </div>
                </form>
              )}

              {/* Mobile Search Button */}
              <button
                type="button"
                onClick={() => {
                  setMobileSearchOpen((v) => !v);
                  setMobileOpen(false);
                  setAccountOpen(false);
                }}
                aria-label="Cari produk"
                aria-expanded={mobileSearchOpen}
                className={`flex size-8 sm:size-9 items-center justify-center rounded-lg transition-colors md:hidden ${
                  mobileSearchOpen
                    ? 'bg-primary/10 text-primary'
                    : isTransparent && !isScrolled
                      ? 'text-ink hover:bg-white/40 hover:text-primary'
                      : 'text-ink-soft hover:bg-beige-soft hover:text-primary'
                }`}
              >
                <Search className="size-4 sm:size-5" />
              </button>

              {user ? (
                <>
                  {/* Obrolan */}
                  <IconLink href="/chat" label="Obrolan" isTransparent={isTransparent && !isScrolled} isScrolled={isScrolled}>
                    <MessageCircle className={isScrolled ? 'size-4 sm:size-5' : 'size-5'} />
                  </IconLink>

                  {/* Pesanan / Keranjang */}
                  <IconLink
                    href="/orders"
                    label="Pesan"
                    count={cartCount}
                    isTransparent={isTransparent && !isScrolled}
                    isScrolled={isScrolled}
                  >
                    <ShoppingCart className={isScrolled ? 'size-4 sm:size-5' : 'size-5'} />
                  </IconLink>

                  {/* Dropdown Akun */}
                  <div className="group relative">
                    <button
                      type="button"
                      aria-haspopup="menu"
                      aria-expanded={accountOpen}
                      title="Akun"
                      onClick={() => {
                        setAccountOpen((v) => !v);
                        setMobileOpen(false);
                        setMobileSearchOpen(false);
                      }}
                      className={`relative flex size-8 sm:size-9 items-center justify-center transition-colors rounded-lg ${
                        accountOpen
                          ? 'bg-beige-soft text-primary'
                          : isScrolled
                            ? 'text-ink-soft hover:bg-beige-soft hover:text-primary'
                            : isTransparent
                              ? 'text-ink hover:bg-white/40 hover:text-primary'
                              : 'text-ink-soft hover:bg-beige-soft hover:text-primary'
                      }`}
                    >
                      {user.profilePhoto && !avatarError ? (
                        <img
                          src={user.profilePhoto}
                          alt={user.name}
                          referrerPolicy="no-referrer"
                          onError={() => setAvatarError(true)}
                          className="size-7 rounded-full object-cover border border-gold-light shadow-xs"
                        />
                      ) : (
                        <span className="flex size-7 items-center justify-center rounded-full border border-gold-light bg-surface shadow-xs">
                          <GoogleLogo className="size-4" />
                        </span>
                      )}
                      {activeUnreadCount > 0 && (
                        <span className="absolute right-0.5 top-0.5 size-2.5 rounded-full border border-surface bg-danger" />
                      )}
                    </button>

                    {/* Dropdown menu Akun */}
                    <div
                      className={`absolute right-0 top-full pt-2 transition-all duration-150 z-50 ${
                        accountOpen
                          ? 'visible opacity-100'
                          : 'invisible opacity-0 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100'
                      }`}
                    >
                      <div role="menu" className="w-60 overflow-hidden rounded-xl border border-line bg-surface py-1 shadow-card">
                        <div className="flex items-center gap-3 border-b border-line px-4 py-3">
                          {user.profilePhoto && !avatarError ? (
                            <img
                              src={user.profilePhoto}
                              alt={user.name}
                              referrerPolicy="no-referrer"
                              onError={() => setAvatarError(true)}
                              className="size-9 rounded-full object-cover border border-line"
                            />
                          ) : (
                            <span className="flex size-9 items-center justify-center rounded-full border border-line bg-surface">
                              <GoogleLogo className="size-5" />
                            </span>
                          )}
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-bold text-ink">{user.name}</p>
                            <p className="truncate text-xs text-muted">{user.email}</p>
                          </div>
                        </div>
                        <Link
                          role="menuitem"
                          href="/profile"
                          onClick={() => setAccountOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-ink-soft hover:bg-beige-soft hover:text-primary"
                        >
                          <UserIcon className="size-4" /> Profil & Ukuran Tersimpan
                        </Link>

                        <Link
                          role="menuitem"
                          href="/notifications"
                          onClick={() => setAccountOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-ink-soft hover:bg-beige-soft hover:text-primary"
                        >
                          <Bell className="size-4" /> Notifikasi
                          {activeUnreadCount > 0 && (
                            <span className="ml-auto rounded-full bg-danger px-1.5 text-[10px] font-bold leading-4 text-white">
                              {activeUnreadCount > 99 ? '99+' : activeUnreadCount}
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
                </>
              ) : (
                <>
                  <span className="hidden sm:block">
                    <ButtonLink href="/login" size="sm" className={isScrolled ? 'h-8 px-3 text-xs' : ''}>
                      {isScrolled ? 'Masuk' : 'Masuk / Daftar'}
                    </ButtonLink>
                  </span>
                  <Link
                    href="/login"
                    aria-label="Masuk ke Akun"
                    className="flex size-8 items-center justify-center rounded-full bg-primary text-on-primary sm:hidden"
                  >
                    <UserIcon className="size-4" />
                  </Link>
                </>
              )}

              {/* Hamburger button for mobile */}
              <button
                type="button"
                onClick={() => {
                  setMobileOpen((v) => !v);
                  setMobileSearchOpen(false);
                  setAccountOpen(false);
                }}
                className={`flex size-8 sm:size-9 items-center justify-center rounded-lg transition-colors md:hidden ${
                  isTransparent && !isScrolled ? 'text-ink hover:bg-white/40' : 'text-ink hover:bg-beige-soft'
                }`}
                aria-label={mobileOpen ? 'Tutup menu' : 'Buka menu'}
                aria-expanded={mobileOpen}
              >
                {mobileOpen ? <X className="size-4 sm:size-5" /> : <Menu className="size-4 sm:size-5" />}
              </button>
            </div>
          </div>

          {/* Row 2: Desktop Navigation Links (Only shown when NOT scrolled) */}
          {!isScrolled && (
            <div
              className={`hidden w-full md:block transition-colors mt-1 ${
                isTransparent ? 'border-t border-black/10' : 'border-t border-line/60'
              }`}
            >
              <nav
                className="scrollbar-none mx-auto flex max-w-7xl items-center justify-center gap-6 lg:gap-8 overflow-x-auto px-4 py-2 sm:px-6"
                aria-label="Navigasi utama"
              >
                {NAV_LINKS.map((link) => {
                  const active = link.href === activeHref;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      aria-current={active ? 'page' : undefined}
                      className={`whitespace-nowrap rounded-lg px-3 py-1 text-[15px] transition-colors ${
                        active
                          ? 'bg-beige-soft font-bold text-primary shadow-xs'
                          : isTransparent
                            ? 'font-semibold text-ink hover:bg-white/50 hover:text-primary'
                            : 'font-medium text-ink-soft hover:bg-beige-soft hover:text-primary'
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </nav>
            </div>
          )}

          {/* Mobile Search Bar Dropdown */}
          {mobileSearchOpen && (
            <div className="absolute left-0 right-0 top-full mt-1.5 z-50 w-full rounded-xl border border-line bg-surface p-2.5 shadow-card md:hidden">
              <form
                onSubmit={(e) => {
                  handleSearchSubmit(e);
                  setMobileSearchOpen(false);
                }}
                className="flex items-center gap-2"
              >
                <div className="relative flex-1">
                  <input
                    ref={searchInputRef}
                    type="search"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder="Cari seragam, topi, acara..."
                    className="w-full rounded-lg border border-line bg-canvas py-1.5 pl-3 pr-10 text-sm text-ink outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    aria-label="Cari produk"
                  />
                  <button
                    type="submit"
                    aria-label="Kirim pencarian"
                    className="absolute right-1 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded bg-black text-white hover:opacity-90"
                  >
                    <Search className="size-3.5" color="#ffffff" />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileSearchOpen(false)}
                  className="flex size-8 items-center justify-center rounded-lg text-ink-soft hover:bg-beige-soft hover:text-ink"
                  aria-label="Tutup pencarian"
                >
                  <X className="size-4" />
                </button>
              </form>
            </div>
          )}

          {/* Mobile Navigation Drawer */}
          {mobileOpen && (
            <nav
              className="absolute left-0 right-0 top-full mt-1.5 z-50 w-full rounded-xl border border-line bg-surface p-2 shadow-card md:hidden"
              aria-label="Navigasi utama (seluler)"
            >
              <ul className="flex flex-col gap-1">
                {NAV_LINKS.map((link) => {
                  const active = link.href === activeHref;
                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className={`block rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors ${
                          active ? 'bg-primary text-on-primary shadow-xs' : 'text-ink-soft hover:bg-beige-soft hover:text-primary'
                        }`}
                      >
                        {link.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          )}
        </header>
      </div>
    </>
  );
}
