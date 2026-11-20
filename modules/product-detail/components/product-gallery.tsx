"use client";

import React, { useState, useEffect } from 'react';
import { BadgeCheck, ChevronLeft, ChevronRight, Maximize2, Shirt, X } from 'lucide-react';
import { Product } from '@/types/product';
import { formatImageUrl } from '@/lib/image';

export function ProductGallery({ product, availabilityLabel }: { product: Product; availabilityLabel: string }) {
  const images = [...product.images].sort((a, b) => Number(b.isPrimary) - Number(a.isPrimary));
  const [active, setActive] = useState(0);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const current = images[active];

  // Kunci scroll body saat modal preview foto terbuka dan tangani tombol navigasi keyboard
  useEffect(() => {
    if (!isPreviewOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsPreviewOpen(false);
      } else if (e.key === 'ArrowLeft' && images.length > 1) {
        setActive((prev) => (prev > 0 ? prev - 1 : images.length - 1));
      } else if (e.key === 'ArrowRight' && images.length > 1) {
        setActive((prev) => (prev < images.length - 1 ? prev + 1 : 0));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isPreviewOpen, images.length]);

  return (
    <>
      <section className="rounded-2xl bg-surface p-6 shadow-card ring-1 ring-line">
        {/* Kontainer Foto Utama: gunakan object-contain agar foto proporsional tanpa terpotong */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => current && setIsPreviewOpen(true)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              if (current) setIsPreviewOpen(true);
            }
          }}
          className="group relative flex h-[340px] cursor-pointer items-center justify-center overflow-hidden rounded-xl bg-canvas/70 p-3 select-none transition-all hover:ring-1 hover:ring-primary/25 sm:h-[488px]"
          title="Klik untuk melihat foto ukuran penuh"
        >
          {current ? (
            <>
              {/* Latar belakang halus agar bingkai tampak penuh dan proporsional */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={formatImageUrl(current.imageUrl)}
                alt=""
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 size-full scale-110 object-cover opacity-15 blur-2xl"
              />
              {/* Foto utama tampil utuh dengan object-contain */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={formatImageUrl(current.imageUrl)}
                alt={product.name}
                className="relative z-1 max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-[1.02]"
              />
              {/* Petunjuk preview foto penuh saat di-hover */}
              <div className="absolute right-3.5 top-3.5 z-10 flex items-center gap-1.5 rounded-full bg-surface/90 px-2.5 py-1 text-xs font-semibold text-ink shadow-xs backdrop-blur-xs transition-transform duration-200 group-hover:scale-105">
                <Maximize2 className="size-3.5 text-primary" aria-hidden="true" />
                <span className="hidden sm:inline">Perbesar</span>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-3 text-ink-soft">
              <span className="flex size-16 items-center justify-center rounded-full bg-surface text-primary shadow-soft">
                <Shirt className="size-7" aria-hidden="true" />
              </span>
              Gambar Produk Belum Tersedia
            </div>
          )}

          {/* Badge Ketersediaan dan Kode Armada */}
          <div className="absolute left-3.5 top-3.5 z-10 flex flex-wrap gap-2">
            <span className="flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-on-primary">
              <span className="size-1.5 rounded-full bg-gold-light" aria-hidden="true" /> {availabilityLabel}
            </span>
            {product.sku && (
              <span className="rounded-full bg-surface/90 px-3 py-1 text-xs font-semibold text-ink">
                Kode Armada: {product.sku}
              </span>
            )}
          </div>

          {/* Badge Kategori */}
          {product.category && (
            <span className="absolute bottom-3.5 right-3.5 z-10 flex items-center gap-1.5 rounded-full bg-surface/95 px-3 py-1 text-xs font-bold text-ink">
              <BadgeCheck className="size-3.5 text-primary" aria-hidden="true" /> {product.category.name}
            </span>
          )}
        </div>

        {/* Daftar Thumbnail Produk Tambahan */}
        {images.length > 1 && (
          <div className="grid grid-cols-4 gap-2 pt-4">
            {images.slice(0, 8).map((img, i) => (
              <button
                key={img.id}
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Lihat gambar ${i + 1}`}
                aria-pressed={i === active}
                className={`flex h-20 items-center justify-center overflow-hidden rounded-xl bg-canvas/60 p-1.5 transition-all sm:h-[108px] ${
                  i === active ? 'ring-2 ring-primary bg-surface' : 'opacity-80 hover:opacity-100 hover:bg-canvas'
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={formatImageUrl(img.imageUrl)} alt="" className="max-h-full max-w-full object-contain" />
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Modal Preview Foto Penuh (Lightbox) */}
      {isPreviewOpen && current && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Preview Foto Produk Ukuran Penuh"
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 p-4 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setIsPreviewOpen(false)}
        >
          {/* Bar Atas: Informasi Jumlah & Tombol Tutup */}
          <div className="absolute inset-x-4 top-4 z-20 flex items-center justify-between text-white pointer-events-none">
            <span className="pointer-events-auto rounded-full bg-white/10 px-3.5 py-1 text-xs font-medium backdrop-blur-md">
              {active + 1} / {images.length}
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsPreviewOpen(false);
              }}
              className="pointer-events-auto flex size-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
              aria-label="Tutup preview"
            >
              <X className="size-5" />
            </button>
          </div>

          {/* Area Tengah: Foto Produk Tampil Penuh */}
          <div
            className="relative flex max-h-[82vh] max-w-[92vw] items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={formatImageUrl(current.imageUrl)}
              alt={product.name}
              className="max-h-[82vh] max-w-[92vw] select-none rounded-xl object-contain shadow-2xl"
            />
          </div>

          {/* Tombol Navigasi Gambar Sebelumnya & Selanjutnya */}
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActive((prev) => (prev > 0 ? prev - 1 : images.length - 1));
                }}
                className="absolute left-4 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/25"
                aria-label="Foto sebelumnya"
              >
                <ChevronLeft className="size-6" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActive((prev) => (prev < images.length - 1 ? prev + 1 : 0));
                }}
                className="absolute right-4 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/25"
                aria-label="Foto selanjutnya"
              >
                <ChevronRight className="size-6" />
              </button>

              {/* Baris Thumbnail di Bagian Bawah Modal */}
              <div
                className="absolute bottom-4 flex max-w-[90vw] gap-2 overflow-x-auto rounded-2xl bg-black/40 p-2 backdrop-blur-md"
                onClick={(e) => e.stopPropagation()}
              >
                {images.map((img, i) => (
                  <button
                    key={img.id}
                    type="button"
                    onClick={() => setActive(i)}
                    className={`size-14 shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                      i === active ? 'scale-105 border-white bg-white/10' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={formatImageUrl(img.imageUrl)} alt="" className="size-full object-cover" />
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
