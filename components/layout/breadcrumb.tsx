import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

export interface Crumb {
  label: string;
  href?: string;
}

/** Inline breadcrumb shown at the top of page content ("Beranda > Halaman"). */
export function Breadcrumb({ items, className = '' }: { items: Crumb[]; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-1.5 text-[13px]">
        <li>
          <Link href="/" className="flex items-center gap-1 font-medium text-ink-soft hover:text-primary">
            <Home className="size-3.5" aria-hidden="true" />
            Beranda
          </Link>
        </li>
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={`${item.label}-${i}`} className="flex items-center gap-1.5">
              <ChevronRight className="size-3.5 text-muted" aria-hidden="true" />
              {item.href && !last ? (
                <Link href={item.href} className="font-medium text-ink-soft hover:text-primary">
                  {item.label}
                </Link>
              ) : (
                <span className={last ? 'font-bold text-primary' : 'text-ink-soft'} aria-current={last ? 'page' : undefined}>
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
