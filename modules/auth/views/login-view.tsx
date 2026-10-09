import React from 'react';
import Link from 'next/link';
import { LoginForm } from '../components/login-form';

export function LoginView() {
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
            Masuk ke Akun
          </h1>
          <p className="text-xs text-[#6B655C] max-w-sm mt-0.5">
            Akses layanan fitting eksklusif dan reservasi koleksi busana Anda
          </p>
        </div>

        {/* Login Form */}
        <LoginForm />

        {/* Footer Link */}
        <div className="pt-4 border-t border-[#F3EDE6] text-center">
          <p className="text-xs text-[#6B655C]">
            Belum memiliki akun klien?{' '}
            <Link href="/register" className="font-semibold text-[#C48B54] hover:underline">
              Daftar Akun Baru
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
