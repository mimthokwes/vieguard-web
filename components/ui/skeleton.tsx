import React from 'react';

export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div
      className={`animate-pulse bg-[#EFE9E2] rounded-lg ${className}`}
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-4 border border-[#E6E1DA] flex flex-col gap-3">
      <Skeleton className="w-full aspect-[3/4] rounded-xl" />
      <Skeleton className="w-20 h-4" />
      <Skeleton className="w-3/4 h-5" />
      <Skeleton className="w-1/2 h-4" />
      <div className="flex justify-between items-center mt-2 pt-2 border-t border-[#F3EDE6]">
        <Skeleton className="w-24 h-6" />
        <Skeleton className="w-8 h-8 rounded-full" />
      </div>
    </div>
  );
}
