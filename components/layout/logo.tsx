import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import logo from '@/public/vieguard-logo.png';

interface LogoProps {
  inverted?: boolean;
  subtitle?: string;
}

/** Shield mark + Cinzel wordmark, matching the mobile app's VIEGUARD branding. */
export function Logo({ inverted = false, subtitle }: LogoProps) {
  return (
    <Link href="/" className="flex items-center gap-2.5 mt-4 shrink-0 group" aria-label="VIEGUARD — Beranda">
      <span className={'flex size-10 items-center justify-center rounded-lg '}>
        <Image src={logo} alt="VIEGUARD" />
      </span>
      <span className="flex flex-col leading-none">
        <span className={`font-display text-lg font-bold tracking-[0.14em] transition-colors text-primary group-hover:text-primary-light`}>
          VIEGUARD
        </span>
        {subtitle && (
          <span className={`mt-1 text-[10px] font-semibold uppercase tracking-[0.16em] ${inverted ? 'text-white/60' : 'text-muted'}`}>
            {subtitle}
          </span>
        )}
      </span>
    </Link>
  );
}
