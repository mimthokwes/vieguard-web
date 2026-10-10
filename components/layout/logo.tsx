import React from 'react';
import Link from 'next/link';
import { Shield } from 'lucide-react';

interface LogoProps {
  inverted?: boolean;
  subtitle?: string;
}

/** Shield mark + Cinzel wordmark, matching the mobile app's VIEGUARD branding. */
export function Logo({ inverted = false, subtitle }: LogoProps) {
  return (
    <Link href="/" className="flex items-center gap-2.5 shrink-0 group" aria-label="VIEGUARD — Beranda">
      <span
        className={`flex size-9 items-center justify-center rounded-lg border ${
          inverted ? 'border-gold/40 bg-white/10 text-gold-light' : 'border-beige bg-beige-soft text-primary'
        }`}
      >
        <Shield className="size-5" strokeWidth={2.2} />
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={`font-display text-xl font-bold tracking-[0.18em] transition-colors ${
            inverted ? 'text-white' : 'text-primary group-hover:text-primary-light'
          }`}
        >
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
