"use client";

import React, { useState } from 'react';
import { Archive, Check, Ruler, SprayCan } from 'lucide-react';
import { Product } from '@/types/product';

const SANITATION = [
  { title: 'Pencucian Higienis', body: 'Setiap unit dicuci dan disetrika uap suhu tinggi setelah dikembalikan.' },
  { title: 'Inspeksi Fungsi & Jahitan', body: 'Kancing, resleting, dan ornamen diperiksa sebelum unit siap disewa kembali.' },
  { title: 'Garment Bag Tersegel', body: 'Tiap stel disimpan terpisah pada tas transparan anti-debu dengan label nomor stel.' },
];

/** Splits a product description into checklist lines when it is written as a list. */
function componentLines(description?: string | null) {
  if (!description) return [];
  const parts = description
    .split(/\r?\n|;|•/)
    .map((s) => s.replace(/^[-*\d.\s]+/, '').trim())
    .filter(Boolean);
  return parts.length > 1 ? parts : [];
}

export function ProductTabs({ product }: { product: Product }) {
  const [tab, setTab] = useState<'components' | 'sizes' | 'sanitation'>('components');
  const lines = componentLines(product.description);
  const TABS = [
    { key: 'components' as const, label: 'Komponen yang Didapat', icon: Archive },
    { key: 'sizes' as const, label: 'Panduan Ukuran Armada', icon: Ruler },
    { key: 'sanitation' as const, label: 'Protokol Sanitasi', icon: SprayCan },
  ];

  return (
    <section className="overflow-hidden rounded-2xl bg-surface shadow-card ring-1 ring-line">
      <div className="flex overflow-x-auto bg-canvas px-4 scrollbar-none" role="tablist">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={tab === key}
            onClick={() => setTab(key)}
            className={`flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-4 text-[15px] font-semibold transition-colors ${
              tab === key ? 'border-primary text-primary' : 'border-transparent text-ink-soft hover:text-primary'
            }`}
          >
            <Icon className="size-4" aria-hidden="true" /> {label}
          </button>
        ))}
      </div>
      <div className="p-6" role="tabpanel">
        {tab === 'components' &&
          (lines.length > 0 ? (
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {lines.map((l) => (
                <CheckItem key={l} title={l} />
              ))}
            </ul>
          ) : (
            <p className="whitespace-pre-line text-[15px] leading-relaxed text-ink-soft">
              {product.description || 'Detail komponen akan diinformasikan admin saat konfirmasi pesanan.'}
            </p>
          ))}
        {tab === 'sizes' &&
          (product.variants.length > 0 ? (
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-line text-xs uppercase text-ink-soft">
                  <th className="py-2">Ukuran</th>
                  <th className="py-2">Stok Sewa</th>
                  <th className="py-2">Stok Jual</th>
                </tr>
              </thead>
              <tbody>
                {product.variants.map((v) => (
                  <tr key={v.id} className="border-b border-line last:border-0">
                    <td className="py-2.5 font-bold text-primary">{v.size}</td>
                    <td className="py-2.5 text-ink">{Math.max(0, v.stockRent - (v.stockInService ?? 0))} unit</td>
                    <td className="py-2.5 text-ink">{v.stockBuy} unit</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-[15px] text-ink-soft">Ukuran tersedia dalam satu ukuran standar. Konsultasikan kebutuhan khusus lewat Obrolan.</p>
          ))}
        {tab === 'sanitation' && (
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {SANITATION.map((s) => (
              <CheckItem key={s.title} title={s.title} body={s.body} />
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

function CheckItem({ title, body }: { title: string; body?: string }) {
  return (
    <li className="flex gap-3 rounded-xl bg-canvas p-3">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-on-primary">
        <Check className="size-4" strokeWidth={3} aria-hidden="true" />
      </span>
      <span>
        <span className="block text-[15px] text-ink">{title}</span>
        {body && <span className="block text-[13px] text-ink-soft">{body}</span>}
      </span>
    </li>
  );
}
