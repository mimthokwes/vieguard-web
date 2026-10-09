import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center text-center p-6 bg-[#FAF7F2]">
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#E6E1DA] shadow-xl max-w-lg w-full flex flex-col items-center gap-4">
        <span className="font-serif text-5xl font-extrabold text-[#C48B54]">404</span>
        <h1 className="font-serif text-2xl font-bold text-[#1C1C1C]">
          Halaman Tidak Ditemukan
        </h1>
        <p className="text-xs text-[#6B655C] max-w-sm">
          Busana atau halaman yang Anda cari mungkin telah dipindahkan, tidak lagi tersedia, atau alamat URL yang Anda masukkan salah.
        </p>
        <Link href="/catalog" className="mt-2">
          <Button variant="primary">Jelajahi Katalog Busana</Button>
        </Link>
      </div>
    </div>
  );
}
