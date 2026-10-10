import React from 'react';

interface ImagePlaceholderProps {
  label?: string;
  className?: string;
}

/** Empty image slot with crossed lines, used where the Figma shows "Gambar Produk". */
export function ImagePlaceholder({ label = 'Gambar Produk', className = 'h-40' }: ImagePlaceholderProps) {
  return (
    <div className={`relative overflow-hidden rounded-[10px] border border-line bg-beige-soft flex items-center justify-center ${className}`}>
      <svg className="absolute inset-0 size-full text-line-strong" preserveAspectRatio="none" viewBox="0 0 100 100" aria-hidden="true">
        <line x1="0" y1="0" x2="100" y2="100" stroke="currentColor" strokeWidth="0.6" vectorEffect="non-scaling-stroke" />
        <line x1="100" y1="0" x2="0" y2="100" stroke="currentColor" strokeWidth="0.6" vectorEffect="non-scaling-stroke" />
      </svg>
      <span className="relative border border-line-strong bg-surface/90 px-3 py-1 text-xs text-muted">{label}</span>
    </div>
  );
}
