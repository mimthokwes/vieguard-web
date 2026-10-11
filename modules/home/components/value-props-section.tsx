import React from 'react';
import { Zap, RefreshCw, Sparkles, MessageCircle, type LucideIcon } from 'lucide-react';

interface ValueProp {
  icon: LucideIcon;
  title: string;
  desc: string;
}

const VALUE_PROPS: ValueProp[] = [
  { icon: Zap, title: 'Pengiriman Kilat', desc: 'Tiba H-1 sebelum acara' },
  { icon: RefreshCw, title: 'Jaminan Pas Ukuran', desc: 'Tukar ukuran gratis' },
  { icon: Sparkles, title: 'Steril & Siap Pakai', desc: 'Standard eco-laundry' },
  { icon: MessageCircle, title: 'Konsultasi Gaya 24/7', desc: 'Stylist siap membantu' },
];

export function ValuePropsSection() {
  return (
    <section className="w-full py-4 sm:py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* One shared card, items are separated by spacing only (no individual borders) */}
        <ul className="grid grid-cols-1 gap-x-6 gap-y-5 rounded-2xl border border-[#E8E1D6] bg-white px-5 py-5 sm:grid-cols-2 sm:px-8 sm:py-6 lg:grid-cols-4">
          {VALUE_PROPS.map(({ icon: Icon, title, desc }) => (
            <li key={title} className="flex items-center gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#FBEDE6] text-[#C4563A]">
                <Icon className="h-5 w-5" strokeWidth={1.75} />
              </span>
              <div className="min-w-0">
                <h4 className="text-[13px] font-semibold text-[#1A1714]">{title}</h4>
                <p className="mt-0.5 text-xs text-[#8C857B]">{desc}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}