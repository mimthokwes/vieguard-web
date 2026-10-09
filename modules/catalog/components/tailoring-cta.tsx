import React from 'react';
import Link from 'next/link';
import { Scissors, ArrowRight } from 'lucide-react';

export function TailoringCta() {
  return (
    <div className="w-full mt-14 bg-white border border-[#E6E1DA] rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-[#FAF2EA] border border-[#DDB892] text-[#C48B54] flex items-center justify-center flex-shrink-0">
          <Scissors className="w-6 h-6" />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-bold tracking-widest text-[#C48B54] uppercase">
            LAYANAN ADIBUSANA & JAHIT KUSTOM
          </span>
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#1C1C1C]">
            Punya Rencana Busana Impian atau Desain Sendiri?
          </h3>
          <p className="text-xs text-[#6B655C] max-w-xl leading-relaxed">
            Wujudkan gaun pesta, beskap adat, atau setelan jas eksklusif Anda dengan konsultasi privat, pemilihan kain premium, dan pengukuran langsung bersama Master Tailor VIEGUARD.
          </p>
        </div>
      </div>

      <Link href="/chat">
        <button className="bg-[#1C1C1C] hover:bg-[#C48B54] text-white text-xs font-bold px-6 py-3.5 rounded-xl transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer">
          <span>Konsultasikan Model</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </Link>
    </div>
  );
}
