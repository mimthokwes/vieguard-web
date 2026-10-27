import React from 'react';

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: React.ReactNode;
  aside?: React.ReactNode;
}

/** Breadcrumb + eyebrow + title block used at the top of most inner pages. */
export function PageHeader({  eyebrow, title, description, aside }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-6 pb-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          {eyebrow && <p className="pb-2 text-xs font-bold uppercase tracking-wider text-gold-dark">{eyebrow}</p>}
          <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-ink sm:text-4xl">{title}</h1>
          {description && <div className="pt-3 text-base leading-relaxed text-ink-soft">{description}</div>}
        </div>
        {aside && <div className="shrink-0">{aside}</div>}
      </div>
    </div>
  );
}

/** Standard page width + padding. */
export function PageContainer({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <main className={`mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 ${className}`}>{children}</main>;
}
