import React from 'react';
import Link from 'next/link';
import { Logo } from '@/components/layout/logo';
import { ForgotPasswordForm } from '../components/forgot-password-form';

export function ForgotPasswordView() {
  return (
    <main className="flex min-h-[calc(100vh-140px)] items-center justify-center px-4 py-12">
      {/* Satu Card Bersih & Elegan sesuai pedoman Simple & Clear UI */}
      <div className="w-full max-w-[420px] rounded-2xl border border-line bg-surface p-6 shadow-card sm:p-8">
        {/* Header Bersih */}
        <div className="flex flex-col items-center text-center pb-6">
          <div className="mb-3">
            <Logo />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-ink">
            Atur Ulang Kata Sandi
          </h1>
          <p className="mt-1 text-xs text-muted">
            Verifikasi email untuk membuat kata sandi baru akun Anda
          </p>
        </div>

        {/* Formulir Lupa Password Terpadu */}
        <ForgotPasswordForm />

        {/* Switch Link Bawah */}
        <p className="mt-6 border-t border-line/60 pt-4 text-center text-xs text-ink-soft">
          Ingat kata sandi akun Anda?{' '}
          <Link href="/login" className="font-bold text-primary hover:underline">
            Masuk di sini
          </Link>
        </p>
      </div>
    </main>
  );
}
