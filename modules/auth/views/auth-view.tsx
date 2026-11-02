import React from 'react';
import Link from 'next/link';
import { Logo } from '@/components/layout/logo';
import { LoginForm } from '../components/login-form';
import { RegisterForm } from '../components/register-form';
import { GoogleLoginButton } from '../components/google-login-button';

type AuthMode = 'login' | 'register';

export function AuthView({ mode, next }: { mode: AuthMode; next?: string }) {
  const isLogin = mode === 'login';

  return (
    <main className="flex min-h-[calc(100vh-140px)] items-center justify-center px-4 py-12">
      {/* Satu Card Bersih & Elegan */}
      <div className="w-full max-w-[420px] rounded-2xl border border-line bg-surface p-6 shadow-card sm:p-8">
        
        {/* Header Bersih */}
        <div className="flex flex-col items-center text-center pb-6">
          <div className="mb-3">
            <Logo />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-ink">
            {isLogin ? 'Masuk ke Akun' : 'Daftar Akun Baru'}
          </h1>
          <p className="mt-1 text-xs text-muted">
            {isLogin ? 'Kelola pesanan dan konsultasi seragam Anda' : 'Buat akun pelanggan untuk memesan seragam'}
          </p>
        </div>

        {/* Tab Switcher Minimalis */}
        <div className="mb-6 grid grid-cols-2 gap-1 rounded-xl bg-beige-soft p-1 text-xs font-semibold">
          <Link
            href={next ? `/login?next=${encodeURIComponent(next)}` : '/login'}
            className={`rounded-lg py-2 text-center transition-all ${
              isLogin ? 'bg-surface font-bold text-primary shadow-soft' : 'text-ink-soft hover:text-primary'
            }`}
          >
            Masuk
          </Link>
          <Link
            href={next ? `/register?next=${encodeURIComponent(next)}` : '/register'}
            className={`rounded-lg py-2 text-center transition-all ${
              !isLogin ? 'bg-surface font-bold text-primary shadow-soft' : 'text-ink-soft hover:text-primary'
            }`}
          >
            Daftar
          </Link>
        </div>

        {/* Formulir */}
        {isLogin ? <LoginForm next={next} /> : <RegisterForm />}

        {/* Divider Simpel */}
        <div className="relative my-5 flex items-center justify-center">
          <div className="w-full border-t border-line" />
          <span className="absolute bg-surface px-3 text-[11px] font-medium text-muted">
            atau
          </span>
        </div>

        {/* Tombol Google Login */}
        <GoogleLoginButton next={next} label={isLogin ? 'Masuk dengan Google' : 'Daftar dengan Google'} />

        {/* Switch Link Bawah */}
        <p className="mt-6 text-center text-xs text-ink-soft">
          {isLogin ? (
            <>
              Belum punya akun?{' '}
              <Link
                href={next ? `/register?next=${encodeURIComponent(next)}` : '/register'}
                className="font-bold text-primary hover:underline"
              >
                Daftar sekarang
              </Link>
            </>
          ) : (
            <>
              Sudah punya akun?{' '}
              <Link
                href={next ? `/login?next=${encodeURIComponent(next)}` : '/login'}
                className="font-bold text-primary hover:underline"
              >
                Masuk di sini
              </Link>
            </>
          )}
        </p>
      </div>
    </main>
  );
}
