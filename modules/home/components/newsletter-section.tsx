"use client";

import React, { useState } from 'react';
import { Mail, CheckCircle2 } from 'lucide-react';

export function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
    }
  };

  return (
    <section className="w-full py-12 bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FAF2EA] border border-[#E8D9C8] rounded-3xl p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          
          {/* Left Text */}
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white text-[#C48B54] border border-[#E6DFD6] flex items-center justify-center flex-shrink-0 shadow-sm">
              <Mail className="w-6 h-6" />
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#1C1C1C]">
                Tetap Terhubung dengan Mode Terkini
              </h3>
              <p className="text-xs text-[#6B655C] max-w-lg leading-relaxed">
                Dapatkan katalog edisi terbatas, voucher sewa Rp 100.000 untuk pengguna baru, dan undangan eksklusif private fitting.
              </p>
            </div>
          </div>

          {/* Right Form */}
          {subscribed ? (
            <div className="flex items-center gap-2 text-xs font-bold text-[#C48B54] bg-white px-5 py-3 rounded-xl border border-[#DDB892]">
              <CheckCircle2 className="w-4 h-4" />
              <span>Terima kasih! Anda telah berlangganan newsletter VIEGUARD.</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="w-full md:w-auto flex items-center gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ketik alamat email Anda..."
                className="w-full md:w-72 bg-white border border-[#E6E1DA] rounded-xl text-xs px-4 py-3 text-[#1C1C1C] focus:outline-none focus:border-[#C48B54]"
              />
              <button
                type="submit"
                className="bg-[#1C1C1C] hover:bg-[#C48B54] text-white text-xs font-bold px-6 py-3 rounded-xl transition-colors whitespace-nowrap cursor-pointer"
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
