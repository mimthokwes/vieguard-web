import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import logo from '@/public/vieguard-logo.png';

interface LogoProps {
  inverted?: boolean;
  subtitle?: string;
  hideTextOnMobile?: boolean;
  className?: string;
}

/** Shield mark + Cinzel wordmark, matching the mobile app's VIEGUARD branding. */
export function Logo({ inverted = false, subtitle, hideTextOnMobile = false, className = '' }: LogoProps) {
  return (
    <Link
      href="/"
      className={`flex items-center gap-2 shrink-0 group ${className}`}
      aria-label="VIEGUARD — Beranda"
    >
      <span className="flex size-9 sm:size-10 items-center justify-center rounded-lg">
        <Image src={logo} alt="VIEGUARD" className="size-auto max-h-9 sm:max-h-10 object-contain" priority />
      </span>
      <span className={`flex-col leading-none ${hideTextOnMobile ? 'hidden sm:flex' : 'flex'}`}>
        <span
          className={`font-display text-base sm:text-lg font-bold tracking-[0.14em] transition-colors ${
            inverted ? 'text-white' : 'text-primary group-hover:text-primary-light'
          }`}
        >
          VIEGUARD
        </span>
        {subtitle && (
          <span className={`mt-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] ${inverted ? 'text-white/60' : 'text-muted'}`}>
            {subtitle}
          </span>
        )}
      </span>
    </Link>
  );
}
