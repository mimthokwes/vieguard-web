import React from 'react';

export type BadgeTone = 'primary' | 'gold' | 'success' | 'warning' | 'info' | 'danger' | 'neutral';

const toneStyles: Record<BadgeTone, string> = {
  primary: 'bg-beige-soft text-primary border-beige',
  gold: 'bg-warning-bg text-gold-dark border-gold-light',
  success: 'bg-success-bg text-success border-success/20',
  warning: 'bg-warning-bg text-warning border-warning/20',
  info: 'bg-info-bg text-info border-info/20',
  danger: 'bg-danger-bg text-danger border-danger/20',
  neutral: 'bg-canvas text-ink-soft border-line',
};

interface BadgeProps {
  tone?: BadgeTone;
  pill?: boolean;
  dot?: boolean;
  icon?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

export function Badge({ tone = 'primary', pill = false, dot = false, icon, className = '', children }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 border px-2.5 py-0.5 text-xs font-bold leading-4 whitespace-nowrap ${
        pill ? 'rounded-full' : 'rounded-md'
      } ${toneStyles[tone]} ${className}`}
    >
      {dot && <span className="size-1.5 rounded-full bg-current" />}
      {icon}
      {children}
    </span>
  );
}
