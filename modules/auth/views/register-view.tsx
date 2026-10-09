import React from 'react';
import Link from 'next/link';
import { RegisterForm } from '../components/register-form';

export function RegisterView() {
  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 bg-[#FAF7F2]">
      <div className="w-full max-w-lg bg-white rounded-3xl p-8 sm:p-10 border border-[#E6E1DA] shadow-xl flex flex-col gap-6">
        
        {/* Header */}
        <div className="text-center flex flex-col items-center gap-1">
          <h2 className="font-serif text-xl font-bold tracking-[0.25em] text-[#1C1C1C] uppercase">
            VIEGUARD
          </h2>
          <span className="text-[10px] tracking-[0.2em] font-semibold text-[#8C857B] uppercase">
            BOUTIQUE & RENTAL • PORTAL KLIEN PRIVAT
          </span>
          <div className="w-10 h-0.5 bg-[#C48B54] my-2" />
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1C1C1C]">
            Pendaftaran Akun Klien
          </h1>
          <p className="text-xs text-[#6B655C] max-w-sm mt-0.5">
            Bergabung untuk kemudahan pemesanan sewa, kustomisasi ukuran, dan penawaran keanggotaan privat
          </p>
        </div>

        {/* Register Form */}
        <RegisterForm />

        {/* Footer Link */}
        <div className="pt-4 border-t border-[#F3EDE6] text-center">
          <p className="text-xs text-[#6B655C]">
            Sudah memiliki akun klien?{' '}
            <Link href="/login" className="font-semibold text-[#C48B54] hover:underline">
              Masuk ke Akun
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
