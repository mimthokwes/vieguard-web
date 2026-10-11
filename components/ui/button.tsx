import React from 'react';
import Link from 'next/link';

export type ButtonVariant = 'primary' | 'dark' | 'gold' | 'soft' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonStyleOptions {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-on-primary shadow-button hover:bg-primary-light focus-visible:ring-primary',
  dark: 'bg-primary-dark text-on-primary shadow-button hover:bg-primary focus-visible:ring-primary-dark',
  gold: 'bg-gold text-on-gold shadow-gold hover:bg-gold-light focus-visible:ring-gold',
  soft: 'bg-beige-soft text-primary border border-line hover:bg-beige focus-visible:ring-primary',
  outline: 'bg-surface text-primary border border-line-strong hover:bg-beige-soft focus-visible:ring-primary',
  ghost: 'bg-transparent text-ink-soft hover:bg-beige-soft hover:text-primary focus-visible:ring-primary',
  danger: 'bg-danger text-white hover:bg-danger/90 focus-visible:ring-danger',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-xs rounded-lg gap-1.5',
  md: 'h-10 px-5 text-sm rounded-[10px] gap-2',
  lg: 'h-11 px-6 text-sm rounded-[10px] gap-2',
};

/** Shared class builder so links and buttons render identically. */
export function buttonClasses({ variant = 'primary', size = 'md', fullWidth = false, className = '' }: ButtonStyleOptions = {}) {
  return [
    'inline-flex items-center justify-center font-bold whitespace-nowrap transition-colors duration-200 cursor-pointer',
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
    variantStyles[variant],
    sizeStyles[size],
    fullWidth ? 'w-full' : '',
    className,
  ].join(' ');
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, ButtonStyleOptions {
  children: React.ReactNode;
}

export function Button({ variant, size, fullWidth, className, children, type = 'button', ...props }: ButtonProps) {
  return (
    <button type={type} className={buttonClasses({ variant, size, fullWidth, className })} {...props}>
      {children}
    </button>
  );
}

interface ButtonLinkProps extends ButtonStyleOptions {
  href: string;
  children: React.ReactNode;
}

export function ButtonLink({ href, variant, size, fullWidth, className, children }: ButtonLinkProps) {
  return (
    <Link href={href} className={buttonClasses({ variant, size, fullWidth, className })}>
      {children}
    </Link>
  );
}
