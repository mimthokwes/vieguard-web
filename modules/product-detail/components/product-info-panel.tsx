"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Product } from '@/types/product';
import { MessageSquare, ShieldCheck, RefreshCw, Truck } from 'lucide-react';

interface ProductInfoPanelProps {
  product: Product;
}

export function ProductInfoPanel({ product }: ProductInfoPanelProps) {
  const [transactionType, setTransactionType] = useState<'RENT' | 'BUY'>('RENT');
  const [selectedSize, setSelectedSize] = useState('S');
  const [rentDuration, setRentDuration] = useState<3 | 5 | 7>(3);
  const [quantity, setQuantity] = useState(1);
  const [hasProtection, setHasProtection] = useState(true);
  const [startDate, setStartDate] = useState('24 Okt 2025 - 27 Okt 2025');
  const [shippingMethod, setShippingMethod] = useState('Kurir Kilat VIEGUARD (Mobil Gantungan Suhu Khusus Jabodetabek) — Rp 45.000');

  const baseRentPrice = rentDuration === 3 ? (product.basePriceRent3d || 350000) : rentDuration === 5 ? (product.basePriceRent5d || 550000) : (product.basePriceRent7d || 720000);
  const buyPrice = product.basePriceBuy || 1450000;
  const deposit = product.depositAmount || 150000;
  const shippingFee = 45000;
  const protectionFee = hasProtection ? 25000 : 0;

  const itemSubtotal = (transactionType === 'RENT' ? baseRentPrice : buyPrice) * quantity;
  const totalPayment = itemSubtotal + (transactionType === 'RENT' ? (deposit + shippingFee + protectionFee) : shippingFee);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E6E1DA] shadow-lg flex flex-col gap-6">
      
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="font-extrabold tracking-widest text-[#C48B54] uppercase text-[11px]">
            KOLEKSI COUTURE GALA & RED CARPET
          </span>
          <span className="bg-[#FAF2EA] text-[#C48B54] border border-[#DDB892] px-2.5 py-0.5 rounded-full font-bold text-[11px]">
            Ready Stock
          </span>
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1C1C1C]">
          {product.name}
        </h1>
        <p className="text-xs text-[#6B655C] mt-1.5 leading-relaxed">
          Designer Handcrafted • Draping Asimetris • Koleksi Khusus Resepsi & Gala Dinner
        </p>
      </div>

      {/* Transaction Type Toggle */}
      <div className="grid grid-cols-2 gap-2 p-1.5 bg-[#FAF7F2] border border-[#E6E1DA] rounded-2xl">
        <button
          type="button"
          onClick={() => setTransactionType('RENT')}
          className={`py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            transactionType === 'RENT'
              ? 'bg-[#161616] text-white shadow-sm'
              : 'text-[#6B655C] hover:text-[#1C1C1C]'
          }`}
        >
          Sewa Gaun (Rental)
        </button>
        <button
          type="button"
          onClick={() => setTransactionType('BUY')}
          className={`py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            transactionType === 'BUY'
              ? 'bg-[#161616] text-white shadow-sm'
              : 'text-[#6B655C] hover:text-[#1C1C1C]'
          }`}
        >
          Beli Busana (Purchase)
        </button>
      </div>

      {/* Size Picker */}
      <div>
        <div className="flex items-center justify-between text-xs font-extrabold text-[#1C1C1C] mb-2 tracking-wider">
          <span>PILIHAN UKURAN</span>
          <button type="button" className="text-[#C48B54] hover:underline font-bold">
            Cek Size Chart
          </button>
        </div>
        <div className="grid grid-cols-5 gap-2">
          {['S', 'M', 'L', 'XL', 'Custom'].map((sz) => (
            <button
              key={sz}
              type="button"
              onClick={() => setSelectedSize(sz)}
              className={`py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                selectedSize === sz
                  ? 'border-[#161616] bg-[#161616] text-white shadow-sm'
                  : 'border-[#E6E1DA] bg-white text-[#1C1C1C] hover:border-[#C48B54]'
              }`}
            >
              {sz}
            </button>
          ))}
        </div>
      </div>

      {/* Duration & Date Picker (If Rental) */}
      {transactionType === 'RENT' && (
        <>
          <div>
            <span className="text-xs font-extrabold text-[#1C1C1C] tracking-wider uppercase block mb-2">
              DURASI SEWA GAUN
            </span>
            <div className="grid grid-cols-3 gap-3">
              {[
                { days: 3, price: product.basePriceRent3d || 350000 },
                { days: 5, price: product.basePriceRent5d || 550000 },
                { days: 7, price: product.basePriceRent7d || 720000 },
              ].map((item) => (
                <button
                  key={item.days}
                  type="button"
                  onClick={() => setRentDuration(item.days as 3 | 5 | 7)}
                  className={`p-3 rounded-2xl border text-left flex flex-col gap-1 transition-all cursor-pointer ${
                    rentDuration === item.days
                      ? 'border-[#C48B54] bg-[#FAF2EA] ring-1 ring-[#C48B54]'
                      : 'border-[#E6E1DA] bg-white hover:border-[#C48B54]'
                  }`}
                >
                  <span className="text-xs font-extrabold text-[#1C1C1C]">
                    {item.days} Hari
                  </span>
                  <span className="text-xs font-bold text-[#C48B54]">
                    {formatCurrency(item.price)}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="text-[10px] font-extrabold text-[#8C857B] uppercase block mb-1 tracking-wider">
                TANGGAL PENGGUNAAN / ACARA
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-white border border-[#E6E1DA] rounded-xl px-3 py-2.5 text-xs font-bold text-[#1C1C1C] focus:outline-none focus:border-[#C48B54]"
                />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-extrabold text-[#8C857B] uppercase block mb-1 tracking-wider">
                KUANTITAS
              </label>
              <div className="flex items-center justify-between border border-[#E6E1DA] rounded-xl px-3 py-2 bg-white">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="text-base font-bold text-[#1C1C1C] px-2 hover:text-[#C48B54] cursor-pointer"
                >
                  -
                </button>
                <span className="text-xs font-bold text-[#1C1C1C]">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="text-base font-bold text-[#1C1C1C] px-2 hover:text-[#C48B54] cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Insurance Option */}
          <div className="flex items-start gap-3 bg-[#FAF7F2] p-3.5 rounded-2xl border border-[#E6E1DA]">
            <input
              type="checkbox"
              id="protection"
              checked={hasProtection}
              onChange={(e) => setHasProtection(e.target.checked)}
              className="mt-0.5 w-4 h-4 accent-[#161616] rounded cursor-pointer"
            />
            <label htmlFor="protection" className="text-xs text-[#1C1C1C] cursor-pointer">
              <div className="flex items-center justify-between font-bold">
                <span>Proteksi Sutra & Noda Ringan</span>
                <span className="text-[#C48B54]">+Rp 25.000</span>
              </div>
              <p className="text-[11px] text-[#6B655C] mt-0.5 leading-snug">
                Bebas biaya denda untuk tumpahan wine ringan, serabut kain tertarik, atau noda makeup.
              </p>
            </label>
          </div>

          {/* Delivery Method Selector (matching Figma) */}
          <div>
            <label className="text-[10px] font-extrabold text-[#8C857B] uppercase block mb-1 tracking-wider">
              METODE PENGIRIMAN & PENGAMBILAN
            </label>
            <select
              value={shippingMethod}
              onChange={(e) => setShippingMethod(e.target.value)}
              className="w-full bg-white border border-[#E6E1DA] rounded-xl px-3 py-2.5 text-xs font-semibold text-[#1C1C1C] focus:outline-none focus:border-[#C48B54]"
            >
              <option value="Kurir Kilat VIEGUARD (Mobil Gantungan Suhu Khusus Jabodetabek) — Rp 45.000">
                Kurir Kilat VIEGUARD (Mobil Gantungan Suhu Khusus Jabodetabek) — Rp 45.000
              </option>
              <option value="Self Pickup di Butik Atelier VIEGUARD — Gratis">
                Self Pickup di Butik Atelier VIEGUARD — Gratis
              </option>
            </select>
          </div>
        </>
      )}

      {/* Cost Breakdown Box matching Figma */}
      <div className="bg-[#FAF7F2] p-5 rounded-2xl border border-[#E6E1DA] flex flex-col gap-2.5 text-xs text-[#1C1C1C]">
        <h4 className="font-extrabold tracking-widest uppercase text-[10px] text-[#8C857B]">
          RINCIAN PERHITUNGAN BIAYA
        </h4>
        <div className="flex justify-between">
          <span className="text-[#6B655C]">Subtotal Biaya {transactionType === 'RENT' ? `Sewa (${rentDuration} Hari x ${quantity})` : `Beli (x ${quantity})`}</span>
          <span className="font-bold">{formatCurrency(itemSubtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#6B655C]">Biaya Logistik Gaun</span>
          <span className="font-bold">{formatCurrency(shippingFee)}</span>
        </div>
        {transactionType === 'RENT' && (
          <>
            <div className="flex justify-between">
              <span className="text-[#6B655C]">Asuransi & Proteksi Serat</span>
              <span className="font-bold">{formatCurrency(protectionFee)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6B655C]">Sterilisasi & Dry Cleaning</span>
              <span className="font-extrabold text-green-700 uppercase">GRATIS (Atelier)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6B655C]">Deposit Pengembalian ⓘ</span>
              <span className="font-bold">{formatCurrency(deposit)}</span>
            </div>
          </>
        )}
        <div className="pt-3 border-t border-[#E6E1DA] flex justify-between items-baseline font-bold text-sm">
          <span className="font-extrabold">TOTAL PEMBAYARAN</span>
          <span className="text-base font-extrabold text-[#1C1C1C]">{formatCurrency(totalPayment)}</span>
        </div>
        {transactionType === 'RENT' && (
          <p className="text-[10px] text-[#8C857B] italic mt-1 leading-snug">
            *Deposit {formatCurrency(deposit)} akan ditransfer kembali otomatis ke rekening Anda dalam waktu 1x24 jam setelah gaun diterima kembali oleh kurir & dicek tim kurasi.
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-3">
        <Link
          href={`/cart?action=add&id=${product.id}&type=${transactionType}&size=${selectedSize}&duration=${rentDuration}`}
          className="w-full"
        >
          <button className="w-full bg-[#161616] hover:bg-[#C48B54] text-white font-bold text-xs sm:text-sm py-3.5 px-6 rounded-2xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-2">
            <span>Lanjutkan Pembayaran & Booking Tanggal →</span>
          </button>
        </Link>

        <Link href={`/chat?product=${product.name}`} className="w-full">
          <button className="w-full bg-white border border-[#E6E1DA] hover:border-[#161616] text-[#1C1C1C] font-semibold text-xs py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm">
            <MessageSquare className="w-4 h-4 text-[#C48B54]" />
            <span>Konsultasi Fitting dengan Stylist (Chat)</span>
          </button>
        </Link>
      </div>

      {/* Trust Badges */}
      <div className="grid grid-cols-3 gap-2 pt-4 border-t border-[#F3EDE6] text-[11px] text-center text-[#6B655C]">
        <div className="flex flex-col items-center gap-1">
          <ShieldCheck className="w-4 h-4 text-[#C48B54]" />
          <span className="font-bold">100% Higienis Siap Pakai</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <RefreshCw className="w-4 h-4 text-[#C48B54]" />
          <span className="font-bold">Bebas Tukar Ukuran H-2</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <Truck className="w-4 h-4 text-[#C48B54]" />
          <span className="font-bold">Garansi Kurir Tepat Waktu</span>
        </div>
      </div>

    </div>
  );
}

