"use client";

import React, { useEffect } from 'react';
import { RefreshCw, ServerCrash } from 'lucide-react';
import { Button, ButtonLink } from '@/components/ui/button';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('[Root Error Boundary]:', error);
  }, [error]);

  return (
    <main className="flex min-h-[70vh] items-center justify-center px-4 py-12">
      <div className="flex w-full max-w-md flex-col items-center gap-4 rounded-2xl bg-surface p-8 text-center shadow-card ring-1 ring-line sm:p-10">
        <span className="flex size-16 items-center justify-center rounded-full bg-danger-bg text-danger">
          <ServerCrash className="size-7" aria-hidden="true" />
        </span>
        <h1 className="text-xl font-extrabold text-ink">Terjadi Kesalahan Sistem</h1>
        <p className="text-sm text-ink-soft">
          Maaf, terjadi kendala saat memuat halaman ini. Pastikan koneksi Anda stabil lalu coba lagi.
        </p>
        <div className="flex flex-wrap justify-center gap-2 pt-2">
          <Button onClick={() => reset()}>
            <RefreshCw className="size-4" aria-hidden="true" /> Coba Lagi
          </Button>
          <ButtonLink href="/" variant="soft">
            Ke Beranda
          </ButtonLink>
        </div>
        {error.digest && <p className="pt-2 font-mono text-xs text-muted">Kode: {error.digest}</p>}
      </div>
    </main>
  );
}
