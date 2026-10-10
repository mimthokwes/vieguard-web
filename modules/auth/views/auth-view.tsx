import React from 'react';
import Link from 'next/link';
import { Info, Shirt } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { LoginForm } from '../components/login-form';
import { RegisterForm } from '../components/register-form';

type AuthMode = 'login' | 'register';

const TABS: { mode: AuthMode; label: string; href: string }[] = [
  { mode: 'login', label: 'Masuk', href: '/login' },
  { mode: 'register', label: 'Daftar Akun Baru', href: '/register' },
];

export function AuthView({ mode, next }: { mode: AuthMode; next?: string }) {
  return (
    <main className="flex justify-center px-4 py-10">
      <div className="w-full max-w-[480px] rounded-2xl border border-line bg-surface p-6 shadow-card sm:p-8">
        <header className="pb-6">
          <div className="flex items-center justify-between gap-3 border-b border-line pb-3">
            <div className="flex items-center gap-2.5">
              <span className="flex size-8 shrink-0 items-center justify-center rounded bg-primary text-on-primary shadow-soft">
                <Shirt className="size-4" aria-hidden="true" />
              </span>
              <h1 className="text-lg font-extrabold leading-6 tracking-tight text-ink">Portal Pelanggan Seragam & Perlengkapan</h1>
            </div>
            <Badge pill className="shrink-0 font-display tracking-wider">
              VIEGUARD
            </Badge>
          </div>
          <p className="pt-2 text-[13px] leading-[21px] text-ink-soft">
            Akses pemesanan penjahitan seragam sekolah, penyewaan perlengkapan, dan pelacakan pesanan Anda.
          </p>
        </header>

        <div role="tablist" aria-label="Pilih mode akun" className="mb-6 grid grid-cols-2 gap-1 rounded-lg bg-beige-soft p-1">
          {TABS.map((tab) => {
            const active = tab.mode === mode;
            return (
              <Link
                key={tab.mode}
                href={next && tab.mode === 'login' ? `${tab.href}?next=${encodeURIComponent(next)}` : tab.href}
                role="tab"
                aria-selected={active}
                className={`rounded py-2 text-center text-sm transition-colors ${
                  active ? 'border border-line bg-surface font-bold text-primary shadow-soft' : 'text-ink-soft hover:text-primary'
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>

        {mode === 'login' ? <LoginForm next={next} /> : <RegisterForm />}

        <p className="mt-6 text-center text-xs text-muted">
          {mode === 'login' ? (
            <>
              Belum punya akun?{' '}
              <Link href="/register" className="font-bold text-primary hover:underline">
                Daftar akun baru
              </Link>
            </>
          ) : (
            <>
              Sudah punya akun?{' '}
              <Link href="/login" className="font-bold text-primary hover:underline">
                Masuk di sini
              </Link>
            </>
          )}
        </p>

        <footer className="mt-6 flex items-start justify-center gap-2 border-t border-line pt-4 text-center text-xs leading-[18px] text-ink-soft">
          <Info className="mt-0.5 size-3.5 shrink-0 text-gold-dark" aria-hidden="true" />
          <span>Setelah berhasil masuk, Anda akan diarahkan ke Menu Utama dan Alur Pemesanan Seragam.</span>
        </footer>
      </div>
    </main>
  );
}
