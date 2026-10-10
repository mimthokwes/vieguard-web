import React from 'react';

interface CtaBannerProps {
  eyebrow?: string;
  eyebrowIcon?: React.ReactNode;
  title: string;
  description: string;
  actions?: React.ReactNode;
  compact?: boolean;
  decoration?: React.ReactNode;
}

/** Maroon gradient call-to-action panel with decorative target rings (Figma CTA banners). */
export function CtaBanner({ eyebrow, eyebrowIcon, title, description, actions, compact = false, decoration }: CtaBannerProps) {
  if (compact) {
    return (
      <section className="flex flex-col gap-5 rounded-2xl bg-maroon-gradient px-6 py-7 text-white shadow-card md:flex-row md:items-center md:justify-between">
        <div className="max-w-2xl">
          <h2 className="text-lg font-bold">{title}</h2>
          <p className="pt-1 text-sm leading-relaxed text-white/75">{description}</p>
        </div>
        <div className="flex flex-wrap gap-2.5">{actions}</div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden rounded-2xl bg-maroon-gradient px-6 py-12 text-white shadow-card sm:px-12">
      {decoration ?? (<svg
        className="pointer-events-none absolute -right-10 top-1/2 hidden h-[340px] w-[340px] -translate-y-1/2 text-white/15 md:block lg:right-36"
        viewBox="0 0 340 340"
        fill="none"
        aria-hidden="true"
      >
        <circle cx="170" cy="170" r="164" stroke="currentColor" strokeWidth="1.5" strokeDasharray="6 6" />
        <circle cx="170" cy="170" r="118" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="170" cy="170" r="73" stroke="currentColor" strokeWidth="1.5" />
        <line x1="30" y1="170" x2="310" y2="170" stroke="currentColor" />
        <line x1="170" y1="30" x2="170" y2="310" stroke="currentColor" />
      </svg>)}
      <div className="relative max-w-2xl">
        {eyebrow && (
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gold-light">
            {eyebrowIcon}
            {eyebrow}
          </p>
        )}
        <h2 className="pt-4 text-3xl font-extrabold leading-tight sm:text-4xl">{title}</h2>
        <p className="pt-4 text-base leading-relaxed text-white/80">{description}</p>
        {actions && <div className="flex flex-wrap gap-4 pt-7">{actions}</div>}
      </div>
    </section>
  );
}
