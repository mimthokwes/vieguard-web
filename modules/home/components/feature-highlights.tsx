"use client";

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { School, Shirt, CalendarCheck, Star, MessageCircle, Ruler, Scissors, Truck, type LucideIcon } from 'lucide-react';

/* ---------- Count-up saat terlihat di layar ---------- */
function useCountUp(target: number, duration = 1600) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { setValue(target); return; }

    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      io.disconnect();
      const start = performance.now();
      const tick = (now: number) => {
        const p = Math.min((now - start) / duration, 1);
        setValue(Math.round(target * (1 - Math.pow(1 - p, 3)))); // easeOutCubic
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.4 });

    io.observe(el);
    return () => io.disconnect();
  }, [target, duration]);

  return { ref, value };
}

interface Stat { icon: LucideIcon; target: number; suffix: string; label: string; decimals?: boolean }

const STATS: Stat[] = [
  { icon: School, target: 250, suffix: '+', label: 'Sekolah terlayani' },
  { icon: Shirt, target: 12000, suffix: '+', label: 'Kostum diproduksi' },
  { icon: CalendarCheck, target: 5, suffix: ' thn', label: 'Pengalaman' },
  { icon: Star, target: 49, suffix: '/5', label: 'Rating pelanggan', decimals: true },
];

function StatCard({ icon: Icon, target, suffix, label, decimals }: Stat) {
  const { ref, value } = useCountUp(target);
  const shown = decimals ? (value / 10).toFixed(1) : value.toLocaleString('id-ID');
  return (
    <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-[#9B1B30] to-[#6E1021] p-4 text-white shadow-lg sm:p-5">
      <Icon aria-hidden className="absolute -right-3 -top-3 h-20 w-20 text-white/10" strokeWidth={1.25} />
      <Icon className="relative mb-2 h-6 w-6 text-[#F3D98B]" strokeWidth={1.75} />
      <p className="relative text-2xl font-bold tabular-nums sm:text-3xl">
        <span ref={ref}>{shown}</span>
        <span className="text-[#F3D98B]">{suffix}</span>
      </p>
      <p className="relative mt-0.5 text-xs text-white/80 sm:text-sm">{label}</p>
    </div>
  );
}

export function FeatureHighlights() {
  return (
    <section className="mx-auto w-full max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-1">
      {/* Angka pencapaian */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {STATS.map((s) => <StatCard key={s.label} {...s} />)}
      </div>

    </section>
  );
}