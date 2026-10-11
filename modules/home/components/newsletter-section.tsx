"use client";

import React, { useState } from 'react';
import { Mail, CheckCircle2 } from 'lucide-react';

// Serif font comes from next/font (--font-playfair), with a safe fallback
const SERIF = 'font-[family-name:var(--font-playfair),Georgia,serif]';

export function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      // TODO: call the real subscribe endpoint here before showing success
      setSubscribed(true);
    }
  };

  return (
    <section className="w-full py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 rounded-[28px] border border-[#EAE1D7] bg-gradient-to-br from-[#F8F3EC] to-[#F1E9DF] p-6 sm:p-9 lg:flex-row lg:items-center lg:gap-10 lg:px-12">
          {/* Left: icon + text */}
          <div className="flex items-start gap-5 lg:items-center">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-[#EAE1D7] bg-white text-[#C4563A] shadow-sm">
              <Mail className="h-6 w-6" strokeWidth={1.75} />
            </div>
            <div className="flex flex-col gap-1.5">
              <h3
                className={`${SERIF} text-xl font-bold text-[#1A1714] sm:text-2xl`}
              >
                Tetap Terhubung dengan Mode Terkini
              </h3>
              <p className="max-w-xl text-[13px] leading-relaxed text-[#5F584F]">
                Dapatkan katalog edisi terbatas, voucher sewa Rp 100.000 untuk
                pengguna baru, dan undangan eksklusif private fitting.
              </p>
            </div>
          </div>

          {/* Right: form or success message */}
          {subscribed ? (
            <div
              role="status"
              className="flex items-center gap-2 rounded-xl border border-[#E3D3BF] bg-white px-5 py-3.5 text-[13px] font-medium text-[#1A1714]"
            >
              <CheckCircle2 className="h-4 w-4 shrink-0 text-[#C4563A]" />
              <span>Terima kasih! Anda telah berlangganan newsletter VIEGUARD.</span>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex w-full flex-col gap-2 sm:flex-row sm:items-center lg:w-auto lg:shrink-0"
            >
              <label htmlFor="newsletter-email" className="sr-only">
                Alamat email
              </label>
              <input
                id="newsletter-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ketik alamat email Anda..."
                className="w-full rounded-xl border border-[#E8E1D6] bg-white px-4 py-3.5 text-sm text-[#1A1714] placeholder-[#A39B90] transition-colors focus:border-[#1A1714]/40 focus:outline-none sm:w-80"
              />
              <button
                type="submit"
                className="whitespace-nowrap rounded-xl bg-[#161616] px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#2E2A26]"
              >
                Berlangganan
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}