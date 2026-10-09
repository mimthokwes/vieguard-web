import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'gold';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  children,
  ...props
}: ButtonProps) {
  const baseStyles =
    'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer';

  const variantStyles = {
    primary: 'bg-[#1C1C1C] text-white hover:bg-[#333333] focus:ring-[#1C1C1C] shadow-sm',
    secondary: 'bg-[#F3EDE6] text-[#1C1C1C] hover:bg-[#E6DFD6] focus:ring-[#C48B54]',
    outline: 'border border-[#E6E1DA] bg-transparent text-[#1C1C1C] hover:bg-[#FAF7F2] focus:ring-[#1C1C1C]',
    ghost: 'bg-transparent text-[#1C1C1C] hover:bg-[#F3EDE6] focus:ring-[#1C1C1C]',
    gold: 'bg-[#C48B54] text-white hover:bg-[#A26E3A] focus:ring-[#C48B54] shadow-sm',
  };

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 rounded-md',
    md: 'text-sm px-5 py-2.5 rounded-lg',
    lg: 'text-base px-6 py-3.5 rounded-xl',
  };

  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyle} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
