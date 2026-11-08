"use client";

import React, { useEffect, useState } from 'react';
import { CircleCheck, Clock, X } from 'lucide-react';

interface ToastProps {
  type: 'confirmed' | 'created';
  orderNumber: string;
}

export function OrderNotificationToast({ type, orderNumber }: ToastProps) {
  const [mounted, setMounted] = useState(true);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Slide-in after a short delay
    const showTimer = setTimeout(() => {
      setVisible(true);
    }, 120);

    // Slide-out after 5.5 seconds
    const hideTimer = setTimeout(() => {
      setVisible(false);
    }, 5500);

    // Unmount after exit animation completes
    const removeTimer = setTimeout(() => {
      setMounted(false);
    }, 6000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!mounted) return null;

  const isConfirmed = type === 'confirmed';

  return (
    <aside
      aria-live="polite"
      className={`fixed right-4 top-20 z-50 w-[calc(100vw-2rem)] max-w-md overflow-hidden rounded-2xl border p-4 shadow-2xl backdrop-blur-md transition-all duration-500 ease-out sm:right-6 sm:top-6 ${
        isConfirmed
          ? 'border-success/30 bg-surface/95 text-ink'
          : 'border-warning/30 bg-surface/95 text-ink'
      } ${
        visible
          ? 'translate-x-0 opacity-100 shadow-card'
          : 'translate-x-[120%] opacity-0 pointer-events-none'
      }`}
    >
      <div className="flex items-start gap-3">
        <span
          className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${
            isConfirmed ? 'bg-success-bg text-success' : 'bg-warning-bg text-warning-dark'
          }`}
        >
          {isConfirmed ? (
            <CircleCheck className="size-5" aria-hidden="true" />
          ) : (
            <Clock className="size-5" aria-hidden="true" />
          )}
        </span>

        <div className="min-w-0 flex-1 pr-2">
          <p className="text-sm font-bold text-ink">
            {isConfirmed ? 'Bahan Tersedia & Pesanan Dikonfirmasi!' : 'Pengajuan Berhasil Diterima'}
          </p>
          <p className="pt-0.5 text-xs leading-relaxed text-ink-soft">
            {isConfirmed
              ? `Admin telah mengonfirmasi bahwa bahan untuk pesanan #${orderNumber} tersedia. Silakan lakukan pembayaran DP untuk memulai proses jahit.`
              : `Pesanan #${orderNumber} telah tercatat. Tim admin sedang mengecek bahan baku ke supplier.`}
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setVisible(false);
            setTimeout(() => setMounted(false), 500);
          }}
          className="flex size-7 items-center justify-center rounded-lg text-ink-soft transition-colors hover:bg-canvas hover:text-ink"
          aria-label="Tutup notifikasi"
        >
          <X className="size-4" />
        </button>
      </div>

      {/* Progress countdown bar */}
      <div className="absolute bottom-0 left-0 h-1 w-full bg-line/40">
        <div
          className={`h-full transition-all duration-[5300ms] ease-linear ${
            isConfirmed ? 'bg-success' : 'bg-warning-dark'
          } ${visible ? 'w-0' : 'w-full'}`}
        />
      </div>
    </aside>
  );
}
