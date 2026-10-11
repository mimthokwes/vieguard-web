import React from 'react';
import { SearchX } from 'lucide-react';
import { ButtonLink } from '@/components/ui/button';

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center px-4 py-12">
      <div className="flex w-full max-w-lg flex-col items-center gap-4 rounded-2xl bg-surface p-8 text-center shadow-card ring-1 ring-line sm:p-12">
        <span className="flex size-16 items-center justify-center rounded-full bg-beige-soft text-primary">
          <SearchX className="size-7" aria-hidden="true" />
        </span>
        <p className="font-display text-5xl font-bold text-primary">404</p>
        <h1 className="text-2xl font-extrabold text-ink">Halaman Tidak Ditemukan</h1>
        <p className="max-w-sm text-sm text-ink-soft">
          Halaman, produk, atau pesanan yang Anda cari mungkin telah dipindahkan, tidak lagi tersedia, atau alamatnya salah.
        </p>
        <div className="flex flex-wrap justify-center gap-2 pt-2">
          <ButtonLink href="/catalog">Jelajahi Katalog</ButtonLink>
          <ButtonLink href="/orders" variant="soft">
            Pesanan Saya
          </ButtonLink>
        </div>
      </div>
    </main>
  );
}
