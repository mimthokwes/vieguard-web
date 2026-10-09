"use client";

import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[Root Error Boundary]:', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 bg-[#FAF7F2]">
      <div className="bg-white rounded-3xl p-8 sm:p-10 border border-[#E6E1DA] shadow-lg max-w-md w-full flex flex-col items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-red-50 text-red-500 border border-red-200 flex items-center justify-center font-bold text-xl">
          !
        </div>
        <h2 className="font-serif font-bold text-xl text-[#1C1C1C]">
          Terjadi Kesalahan Sistem
        </h2>
        <p className="text-xs text-[#6B655C]">
          {error.message || 'Maaf, terjadi kendala saat memuat halaman ini. Silakan coba beberapa saat lagi.'}
        </p>
        <Button onClick={() => reset()} variant="primary" className="mt-2">
          Coba Lagi
        </Button>
      </div>
    </div>
  );
}
