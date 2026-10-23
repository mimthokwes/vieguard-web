import React from 'react';

export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-beige-soft ${className}`}
    />
  );
}

/** Skeleton sesuai layout global ProductCard: foto → nama → harga → tombol */
export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-line-strong bg-white shadow-sm">
      {/* Foto */}
      <Skeleton className="aspect-[4/3] w-full rounded-none" />
      <div className="flex flex-col gap-2 p-4">
        {/* Nama */}
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        {/* Harga */}
        <div className="mt-2 border-t border-line pt-3">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="mt-1 h-3 w-20" />
        </div>
        {/* Tombol */}
        <Skeleton className="mt-2 h-8 w-full rounded-xl" />
      </div>
    </div>
  );
}
