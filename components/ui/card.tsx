import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: 'div' | 'section' | 'article' | 'aside';
  padded?: boolean;
}

/** White surface with the Figma card treatment (16px radius, hairline border, soft shadow). */
export function Card({ as: Tag = 'div', padded = true, className = '', children, ...props }: CardProps) {
  return (
    <Tag className={`bg-surface border border-line rounded-2xl shadow-card ${padded ? 'p-6 sm:p-8' : ''} ${className}`} {...props}>
      {children}
    </Tag>
  );
}

interface SectionHeaderProps {
  title: string;
  description?: string;
  aside?: React.ReactNode;
  className?: string;
}

/** Heading row with bottom divider used at the top of most Figma sections. */
export function SectionHeader({ title, description, aside, className = '' }: SectionHeaderProps) {
  return (
    <div className={`flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between border-b border-line-strong pb-3 ${className}`}>
      <div>
        <h2 className="text-lg font-extrabold text-ink leading-tight">{title}</h2>
        {description && <p className="text-sm text-ink-soft mt-0.5">{description}</p>}
      </div>
      {aside && <div className="text-xs font-semibold uppercase tracking-wide text-muted">{aside}</div>}
    </div>
  );
}

/** Small uppercase eyebrow label ("SEC 01 // AKSES"). */
export function Eyebrow({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <p className={`text-xs font-semibold uppercase tracking-wide text-muted ${className}`}>{children}</p>;
}
