"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { formatImageUrl } from '@/lib/image';

export function CartView() {
  const [items, setItems] = useState([
    {
      id: 'cart-1',
      name: 'Kostum Drumband Gita Bahari',
      size: 'S',
      type: 'SEWA (3 Hari)',
      date: 'Reservasi Backend',
      price: 200000,
      deposit: 100000,
      protection: 25000,
      quantity: 1,
      image: formatImageUrl(null),
    },
  ]);

  const [orderSubmitted, setOrderSubmitted] = useState(false);

  const updateQuantity = (id: string, delta: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
      )
    );
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const depositTotal = items.reduce((sum, item) => sum + item.deposit * item.quantity, 0);
  const protectionTotal = items.reduce((sum, item) => sum + item.protection * item.quantity, 0);
  const shippingFee = items.length > 0 ? 45000 : 0;
  const grandTotal = subtotal + depositTotal + protectionTotal + shippingFee;

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);

  if (orderSubmitted) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center">
        <div className="bg-surface rounded-3xl p-8 border border-line shadow-lg flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-beige-soft border border-beige text-primary flex items-center justify-center">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className=" text-2xl font-bold text-ink">
            Pesanan Berhasil Dibuat!
          </h1>
          <p className="text-xs text-ink-soft max-w-md">
            Terima kasih telah melakukan reservasi di VIEGUARD. Tim kami akan memproses pesanan Anda.
          </p>
          <Link href="/catalog" className="mt-4">
            <Button variant="primary">Kembali ke Katalog</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-canvas py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-6">
          <h1 className=" text-3xl font-bold text-ink">
            Keranjang Reservasi
          </h1>
          <p className="text-xs text-ink-soft mt-1">
            Tinjau kembali busana pilihan Anda sebelum melakukan konfirmasi booking.
          </p>
        </div>

        {items.length === 0 ? (
          <EmptyState
            title="Keranjang Masih Kosong"
            description="Belum ada produk yang dimasukkan ke dalam keranjang reservasi Anda."
            actionText="Jelajahi Katalog Busana"
            actionHref="/catalog"
            icon={<ShoppingBag className="w-8 h-8 text-primary" />}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Items Table */}
            <div className="lg:col-span-8 flex flex-col gap-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-surface rounded-2xl p-4 border border-line shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="relative w-20 h-24 rounded-xl overflow-hidden bg-canvas flex-shrink-0 border border-line">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-bold text-primary uppercase">
                        {item.type}
                      </span>
                      <h3 className=" font-bold text-sm text-ink">
                        {item.name}
                      </h3>
                      <p className="text-xs text-ink-soft">
                        Ukuran: <span className="font-bold text-ink">{item.size}</span> | {item.date}
                      </p>
                      <span className="text-xs font-bold text-ink mt-1">
                        {formatCurrency(item.price)}
                      </span>
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-line">
                    <div className="flex items-center border border-line rounded-xl px-3 py-1.5 bg-surface">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="text-sm font-bold text-ink px-1 hover:text-primary cursor-pointer"
                      >
                        -
                      </button>
                      <span className="text-xs font-bold text-ink px-3">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="text-sm font-bold text-ink px-1 hover:text-primary cursor-pointer"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                      aria-label="Hapus Item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Summary Card */}
            <div className="lg:col-span-4 bg-surface rounded-3xl p-6 border border-line shadow-sm flex flex-col gap-4">
              <h2 className=" font-bold text-lg text-ink">
                Ringkasan Biaya
              </h2>
              <div className="flex flex-col gap-2.5 text-xs text-ink-soft">
                <div className="flex justify-between">
                  <span>Subtotal Sewa</span>
                  <span className="font-bold text-ink">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Asuransi & Proteksi</span>
                  <span className="font-bold text-ink">{formatCurrency(protectionTotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Ongkos Kirim Kurir</span>
                  <span className="font-bold text-ink">{formatCurrency(shippingFee)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Deposit Pengembalian (refundable)</span>
                  <span className="font-bold text-ink">{formatCurrency(depositTotal)}</span>
                </div>
                <div className="pt-3 border-t border-line flex justify-between items-baseline font-bold text-sm text-ink">
                  <span>Total Pembayaran</span>
                  <span className="text-base text-primary">{formatCurrency(grandTotal)}</span>
                </div>
              </div>

              <button
                onClick={() => setOrderSubmitted(true)}
                className="w-full bg-dark hover:bg-gold text-white font-bold text-xs py-3.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <span>Lanjutkan Pembayaran</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
