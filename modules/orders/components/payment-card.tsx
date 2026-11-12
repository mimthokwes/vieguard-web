"use client";

import React, { useEffect, useState } from 'react';
import {
  Building2,
  Check,
  ChevronDown,
  CircleCheck,
  Copy,
  CreditCard,
  Download,
  Info,
  QrCode,
  RefreshCw,
  Upload,
} from 'lucide-react';
import { Order } from '@/types/order';
import { Badge } from '@/components/ui/badge';
import { ErrorMessage } from '@/components/ui/error-message';
import { formatDateTime, formatRupiah, toNumber } from '@/lib/format';
import { PAYMENT_STATUS_META } from '@/lib/order-status';
import {
  chargeDirectPaymentAction,
  uploadPaymentProofAction,
  PaymentActionState,
} from '../actions';
import { DirectPaymentResponse } from '../services/orders-service';

const initialProofState: PaymentActionState = {};

type BankCode = 'bca' | 'mandiri' | 'bni' | 'bri' | 'permata' | 'cimb';

const BANK_OPTIONS: Array<{ code: BankCode; name: string }> = [
  { code: 'bca', name: 'BCA' },
  { code: 'mandiri', name: 'Mandiri' },
  { code: 'bni', name: 'BNI' },
  { code: 'bri', name: 'BRI' },
  { code: 'permata', name: 'Permata' },
  { code: 'cimb', name: 'CIMB' },
];

export function PaymentCard({ order }: { order: Order }) {
  const [proofState, proofAction] = React.useActionState(uploadPaymentProofAction, initialProofState);
  const [showManualUpload, setShowManualUpload] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [gatewayError, setGatewayError] = useState<string | null>(null);

  // Active payment session (when QRIS or VA has been generated)
  const [activePayment, setActivePayment] = useState<DirectPaymentResponse | null>(null);

  // Form selections
  const payments = order.payments ?? [];
  const total = toNumber(order.totalPrice);
  const dp = toNumber(order.dpAmount);
  const paid = payments
    .filter((p) => p.status === 'terverifikasi' && p.paymentType !== 'refund')
    .reduce((s, p) => s + toNumber(p.amount), 0);
  const pending = payments.some((p) => p.status === 'menunggu');
  const canPay = !order.isLunas && total > 0 && order.status !== 'dibatalkan' && order.status !== 'pending' && !pending;

  const defaultDp = dp > 0 ? dp : Math.round(total * 0.5);
  const remaining = Math.max(0, total - paid);

  const defaultChoice: 'dp' | 'pelunasan' = paid > 0 ? 'pelunasan' : 'dp';
  const [paymentChoice, setPaymentChoice] = useState<'dp' | 'pelunasan'>(defaultChoice);
  const [paymentMethod, setPaymentMethod] = useState<'qris' | 'va'>('qris');
  const [selectedBank, setSelectedBank] = useState<BankCode>('bca');

  const selectedAmount = paymentChoice === 'dp' && paid === 0 ? defaultDp : remaining;

  // Countdown timer for active payment (15 minutes)
  const [timeLeft, setTimeLeft] = useState(899);
  useEffect(() => {
    if (!activePayment) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [activePayment]);

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // VA Copy feedback
  const [copied, setCopied] = useState(false);
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Guide accordion toggle
  const [showGuide, setShowGuide] = useState(false);

  // Trigger Native Midtrans Core API Charge
  const handleInitiatePayment = async () => {
    setIsProcessing(true);
    setGatewayError(null);

    const res = await chargeDirectPaymentAction(
      order.id,
      paymentMethod,
      paymentMethod === 'va' ? selectedBank : undefined,
      paymentChoice
    );

    setIsProcessing(false);

    if (res.error || !res.data) {
      setGatewayError(res.error || 'Gagal memproses pembayaran. Silakan coba lagi.');
      return;
    }

    setActivePayment(res.data);
    setTimeLeft(899);
  };

  return (
    <section className="rounded-2xl bg-surface p-6 shadow-card ring-1 ring-line">
      <h2 className="flex items-center gap-2 border-b border-line pb-3 text-lg font-bold text-ink">
        <CreditCard className="size-5 text-primary" aria-hidden="true" /> Pembayaran
      </h2>

      {/* Rincian Tagihan */}
      <dl className="flex flex-col gap-1.5 pt-4 text-sm">
        <Row label="Total Tagihan" value={total > 0 ? formatRupiah(total) : 'Menunggu penawaran'} />
        {dp > 0 ? (
          <Row label="Uang Muka (DP)" value={formatRupiah(dp)} />
        ) : total > 0 && !order.isLunas ? (
          <Row label="Estimasi DP 50%" value={formatRupiah(Math.round(total * 0.5))} />
        ) : null}
        <Row label="Sudah Terverifikasi" value={formatRupiah(paid)} />
        {paid > 0 && !order.isLunas && (
          <Row label="Sisa Tagihan" value={formatRupiah(remaining)} accent />
        )}
      </dl>

      {/* Riwayat Pembayaran Sebelumnya */}
      {payments.length > 0 && (
        <ul className="mt-4 flex flex-col gap-2">
          {payments.map((p) => (
            <li key={p.id} className="flex items-center justify-between gap-2 rounded-lg bg-beige-soft px-3 py-2 text-xs">
              <span>
                <b className="uppercase text-ink">{p.paymentType}</b> · {formatRupiah(p.amount)}
                <span className="block text-muted">{formatDateTime(p.createdAt)}</span>
              </span>
              <Badge tone={PAYMENT_STATUS_META[p.status].tone}>{PAYMENT_STATUS_META[p.status].label}</Badge>
            </li>
          ))}
        </ul>
      )}

      {/* State Lunas */}
      {order.isLunas ? (
        <div className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-50 p-4 text-sm font-semibold text-emerald-800 border border-emerald-200">
          <CircleCheck className="size-5 text-emerald-600 shrink-0" aria-hidden="true" />
          <span>Pesanan sudah lunas. Terima kasih atas pembayaran Anda!</span>
        </div>
      ) : proofState.success ? (
        <p role="status" className="mt-4 rounded-lg bg-success-bg px-3 py-2 text-sm font-semibold text-success">
          Bukti transfer terkirim. Admin akan memverifikasi pembayaran Anda.
        </p>
      ) : activePayment ? (
        /* ================= TAMPILAN PEMBAYARAN ELEGAN AKTIF (NATIVE CUSTOM) ================= */
        <div className="mt-5 flex flex-col gap-4 border-t border-line pt-5">
          {/* Header Status & Countdown */}
          <div className="rounded-2xl bg-gradient-to-r from-red-900 to-rose-950 p-4 text-white shadow-sm">
            <div className="flex items-center justify-between text-xs text-rose-200">
              <span className="font-semibold uppercase tracking-wider">
                {activePayment.paymentMethod === 'qris' ? 'Pembayaran QRIS' : 'Virtual Account'}
              </span>
              <span className="font-mono font-bold text-amber-300">
                ⏱️ {formatTimer(timeLeft)}
              </span>
            </div>
            <div className="mt-2 flex items-baseline justify-between border-t border-white/10 pt-2">
              <span className="text-xs text-rose-100">Total Transfer</span>
              <span className="text-xl font-black text-white tracking-tight">
                {formatRupiah(activePayment.grossAmount)}
              </span>
            </div>
          </div>

          {/* Konten QRIS */}
          {activePayment.paymentMethod === 'qris' && (
            <div className="flex flex-col items-center rounded-2xl border border-line bg-canvas p-5 text-center shadow-xs">
              {activePayment.qrUrl ? (
                <div className="p-3 bg-white rounded-2xl border-2 border-slate-200 shadow-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={activePayment.qrUrl}
                    alt="Kode QRIS VieGuard"
                    className="size-52 rounded-xl object-contain"
                  />
                  <div className="mt-2 text-[10px] font-extrabold tracking-widest text-slate-500 uppercase flex items-center justify-center gap-1.5">
                    <span className="size-1.5 rounded-full bg-red-600 inline-block" />
                    QRIS Standar Nasional
                  </div>
                </div>
              ) : (
                <p className="text-xs text-ink-soft">Menyiapkan kode QRIS...</p>
              )}

              <p className="mt-3 text-xs text-ink-soft">
                Scan kode QR di atas menggunakan aplikasi mobile banking atau e-wallet apa saja:
              </p>
              <div className="mt-2 flex flex-wrap justify-center gap-1 text-[11px] font-semibold text-ink-soft">
                <span className="px-2 py-0.5 rounded bg-surface border border-line">GoPay</span>
                <span className="px-2 py-0.5 rounded bg-surface border border-line">ShopeePay</span>
                <span className="px-2 py-0.5 rounded bg-surface border border-line">BCA Mobile</span>
                <span className="px-2 py-0.5 rounded bg-surface border border-line">Livin' Mandiri</span>
                <span className="px-2 py-0.5 rounded bg-surface border border-line">DANA / OVO</span>
              </div>

              {activePayment.qrUrl && (
                <a
                  href={activePayment.qrUrl}
                  target="_blank"
                  rel="noreferrer"
                  download={`QRIS-${order.orderNumber}.png`}
                  className="mt-4 flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
                >
                  <Download className="size-3.5" /> Unduh Gambar QRIS
                </a>
              )}
            </div>
          )}

          {/* Konten Virtual Account */}
          {activePayment.paymentMethod === 'va' && (
            <div className="rounded-2xl border border-line bg-canvas p-4 text-xs">
              <div className="flex items-center justify-between border-b border-line pb-2.5">
                <span className="text-ink-soft">Bank Tujuan:</span>
                <span className="font-extrabold uppercase text-primary px-2 py-0.5 rounded bg-primary/10">
                  {activePayment.bank || 'Bank'} Virtual Account
                </span>
              </div>

              {/* Mandiri (Biller Code + Bill Key) vs Bank Lain (VA Number) */}
              {activePayment.bank === 'mandiri' ? (
                <div className="mt-3 space-y-3">
                  <div>
                    <span className="text-[11px] text-ink-soft block">Kode Perusahaan (Biller Code):</span>
                    <div className="flex items-center justify-between mt-1 p-2.5 rounded-xl bg-surface border border-line">
                      <span className="font-mono text-sm font-bold text-ink">{activePayment.billerCode || '70012'}</span>
                      <button
                        type="button"
                        onClick={() => handleCopy(activePayment.billerCode || '70012')}
                        className="text-xs font-bold text-primary flex items-center gap-1 hover:underline cursor-pointer"
                      >
                        <Copy className="size-3.5" /> Salin
                      </button>
                    </div>
                  </div>
                  <div>
                    <span className="text-[11px] text-ink-soft block">Nomor Tagihan (Bill Key):</span>
                    <div className="flex items-center justify-between mt-1 p-2.5 rounded-xl bg-surface border border-line">
                      <span className="font-mono text-base font-black text-ink">{activePayment.billKey}</span>
                      <button
                        type="button"
                        onClick={() => handleCopy(activePayment.billKey || '')}
                        className="text-xs font-bold text-primary flex items-center gap-1 hover:underline cursor-pointer"
                      >
                        <Copy className="size-3.5" /> Salin
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-3">
                  <span className="text-[11px] text-ink-soft block">Nomor Virtual Account:</span>
                  <div className="flex items-center justify-between mt-1 p-3 rounded-xl bg-surface border border-line shadow-2xs">
                    <span className="font-mono text-base font-black tracking-wider text-ink">
                      {activePayment.vaNumber}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(activePayment.vaNumber || '')}
                      className="text-xs font-bold text-primary px-2.5 py-1 rounded-lg bg-beige-soft border border-line hover:border-primary transition flex items-center gap-1 cursor-pointer"
                    >
                      {copied ? <Check className="size-3.5 text-emerald-600" /> : <Copy className="size-3.5" />}
                      <span>{copied ? 'Tersalin!' : 'Salin'}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Accordion Petunjuk Transfer */}
              <div className="mt-3 border-t border-line pt-3">
                <button
                  type="button"
                  onClick={() => setShowGuide((prev) => !prev)}
                  className="flex w-full items-center justify-between text-xs font-bold text-ink hover:text-primary transition cursor-pointer"
                >
                  <span>Petunjuk Transfer m-Banking & ATM</span>
                  <ChevronDown className={`size-4 transition-transform ${showGuide ? 'rotate-180' : ''}`} />
                </button>
                {showGuide && (
                  <div className="mt-2 space-y-1.5 text-[11px] text-ink-soft leading-relaxed bg-surface p-3 rounded-xl border border-line">
                    <p>1. Buka aplikasi m-Banking atau ATM bank Anda.</p>
                    <p>2. Pilih menu <b>Transfer &gt; Virtual Account</b>.</p>
                    <p>3. Masukkan nomor Virtual Account di atas.</p>
                    <p>4. Pastikan nama penerima <b>VIEGUARD</b> dan nominal <b>{formatRupiah(activePayment.grossAmount)}</b>.</p>
                    <p>5. Masukkan PIN transaksi. Pembayaran akan terverifikasi otomatis.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tombol Cek Status & Ganti Metode */}
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-primary px-4 py-3 text-xs font-bold text-white shadow-sm hover:bg-primary/90 transition cursor-pointer"
            >
              <RefreshCw className="size-3.5" /> Saya Sudah Bayar (Cek Status)
            </button>
            <button
              type="button"
              onClick={() => setActivePayment(null)}
              className="text-center text-xs font-medium text-ink-soft hover:text-primary transition py-1 cursor-pointer"
            >
              ← Ganti Metode Pembayaran Lain
            </button>
          </div>
        </div>
      ) : canPay ? (
        /* ================= TAMPILAN FORM AWAL PEMILIHAN ================= */
        <div className="mt-5 flex flex-col gap-4 border-t border-line pt-5">
          {/* Skema DP vs Pelunasan 100% */}
          {paid === 0 ? (
            <div>
              <label className="block text-xs font-bold text-ink">
                Pilih Skema Pembayaran:
              </label>
              <div className="mt-2 grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setPaymentChoice('dp')}
                  className={`relative flex flex-col items-start rounded-xl border p-3 text-left transition-all cursor-pointer ${
                    paymentChoice === 'dp'
                      ? 'border-primary bg-primary/5 ring-2 ring-primary/20 shadow-xs'
                      : 'border-line bg-surface hover:border-line-strong'
                  }`}
                >
                  <div className="flex w-full items-center justify-between">
                    <span className="text-[11px] font-medium text-ink-soft">Uang Muka (DP)</span>
                    {paymentChoice === 'dp' && (
                      <span className="flex size-4 items-center justify-center rounded-full bg-primary text-white">
                        <Check className="size-2.5" strokeWidth={3} />
                      </span>
                    )}
                  </div>
                  <span className="pt-1 text-sm font-extrabold text-primary">
                    {formatRupiah(defaultDp)}
                  </span>
                  <span className="text-[10px] text-ink-soft">50% dari total</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentChoice('pelunasan')}
                  className={`relative flex flex-col items-start rounded-xl border p-3 text-left transition-all cursor-pointer ${
                    paymentChoice === 'pelunasan'
                      ? 'border-primary bg-primary/5 ring-2 ring-primary/20 shadow-xs'
                      : 'border-line bg-surface hover:border-line-strong'
                  }`}
                >
                  <div className="flex w-full items-center justify-between">
                    <span className="text-[11px] font-medium text-ink-soft">Bayar Lunas 100%</span>
                    {paymentChoice === 'pelunasan' && (
                      <span className="flex size-4 items-center justify-center rounded-full bg-primary text-white">
                        <Check className="size-2.5" strokeWidth={3} />
                      </span>
                    )}
                  </div>
                  <span className="pt-1 text-sm font-extrabold text-primary">
                    {formatRupiah(total)}
                  </span>
                  <span className="text-[10px] text-ink-soft">Langsung lunas</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="rounded-xl bg-beige-soft p-3.5">
              <p className="text-xs text-ink-soft">Pelunasan Sisa Tagihan:</p>
              <p className="text-base font-extrabold text-primary">{formatRupiah(remaining)}</p>
            </div>
          )}

          {/* Pilihan Metode: QRIS vs Virtual Account */}
          <div>
            <label className="block text-xs font-bold text-ink">
              Pilih Metode Pembayaran:
            </label>
            <div className="mt-2 grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setPaymentMethod('qris')}
                className={`relative flex flex-col items-start rounded-xl border p-3 text-left transition-all cursor-pointer ${
                  paymentMethod === 'qris'
                    ? 'border-primary bg-primary/5 ring-2 ring-primary/20 shadow-xs'
                    : 'border-line bg-surface hover:border-line-strong'
                }`}
              >
                <div className="flex w-full items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <QrCode className="size-4 text-primary" />
                    <span className="text-xs font-bold text-ink">QRIS</span>
                  </div>
                  {paymentMethod === 'qris' && (
                    <span className="flex size-4 items-center justify-center rounded-full bg-primary text-white">
                      <Check className="size-2.5" strokeWidth={3} />
                    </span>
                  )}
                </div>
                <span className="pt-1.5 text-[10px] leading-tight text-ink-soft">
                  GoPay, ShopeePay, DANA, BCA QRIS, dll
                </span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('va')}
                className={`relative flex flex-col items-start rounded-xl border p-3 text-left transition-all cursor-pointer ${
                  paymentMethod === 'va'
                    ? 'border-primary bg-primary/5 ring-2 ring-primary/20 shadow-xs'
                    : 'border-line bg-surface hover:border-line-strong'
                }`}
              >
                <div className="flex w-full items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Building2 className="size-4 text-primary" />
                    <span className="text-xs font-bold text-ink">Virtual Account</span>
                  </div>
                  {paymentMethod === 'va' && (
                    <span className="flex size-4 items-center justify-center rounded-full bg-primary text-white">
                      <Check className="size-2.5" strokeWidth={3} />
                    </span>
                  )}
                </div>
                <span className="pt-1.5 text-[10px] leading-tight text-ink-soft">
                  BCA, Mandiri, BNI, BRI, Permata
                </span>
              </button>
            </div>
          </div>

          {/* Jika Pilih VA: Tampilkan Pilihan Bank */}
          {paymentMethod === 'va' && (
            <div>
              <label className="block text-xs font-bold text-ink mb-1.5">
                Pilih Bank Virtual Account:
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {BANK_OPTIONS.map((b) => (
                  <button
                    key={b.code}
                    type="button"
                    onClick={() => setSelectedBank(b.code)}
                    className={`py-2 px-2 rounded-xl text-xs font-bold text-center transition-all cursor-pointer ${
                      selectedBank === b.code
                        ? 'border-2 border-primary bg-primary/10 text-primary shadow-2xs'
                        : 'border border-line bg-surface text-ink-soft hover:border-line-strong'
                    }`}
                  >
                    {b.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <ErrorMessage message={gatewayError ?? undefined} />

          {/* Tombol Utama Bayar */}
          <button
            type="button"
            disabled={isProcessing}
            onClick={handleInitiatePayment}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-white shadow-md transition hover:bg-primary/90 active:scale-[0.99] disabled:opacity-60 cursor-pointer"
          >
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <span className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Menyiapkan Pembayaran...
              </span>
            ) : (
              <span>
                Bayar Sekarang ({formatRupiah(selectedAmount)})
              </span>
            )}
          </button>

          {/* Opsi Bukti Manual (Accordion Halus) */}
          <div className="pt-1 text-center">
            <button
              type="button"
              onClick={() => setShowManualUpload((prev) => !prev)}
              className="text-[11px] font-medium text-ink-soft hover:text-primary transition underline underline-offset-2 cursor-pointer"
            >
              {showManualUpload ? 'Sembunyikan form bukti manual' : 'Atau punya bukti transfer manual? Unggah di sini'}
            </button>
          </div>

          {showManualUpload && (
            <form action={proofAction} className="mt-2 flex flex-col gap-3 rounded-xl border border-line bg-canvas p-4 text-xs">
              <input type="hidden" name="orderId" value={order.id} />
              <input type="hidden" name="paymentType" value={paymentChoice} />
              <input type="hidden" name="amount" value={selectedAmount} />

              <label className="font-semibold text-ink">Unggah Bukti Transfer Manual:</label>
              <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-line-strong bg-surface p-3 text-center text-xs text-ink-soft transition hover:border-primary">
                <Upload className="size-4 text-primary" aria-hidden="true" />
                <span className="pt-1 font-medium text-ink">Pilih file struk / screenshot</span>
                <span className="text-[10px] text-muted">Format JPG, PNG, atau WebP (maks. 5MB)</span>
                <input
                  name="proofImage"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  required
                  className="mt-2 w-full text-[11px] file:mr-2 file:rounded file:border-0 file:bg-white file:px-2 file:py-0.5 file:text-xs file:font-semibold file:text-primary"
                />
              </label>

              <ErrorMessage message={proofState.error} />
              <button
                type="submit"
                className="rounded-lg bg-surface border border-line-strong py-2 text-xs font-bold text-ink hover:bg-beige-soft transition cursor-pointer"
              >
                Kirim Bukti Manual
              </button>
            </form>
          )}
        </div>
      ) : pending ? (
        <p className="mt-4 text-sm text-warning">Bukti pembayaran sedang diverifikasi admin.</p>
      ) : order.status === 'pending' ? (
        <div className="mt-4 rounded-xl border border-warning/30 bg-warning-bg/40 p-3.5 text-xs text-ink-soft">
          <p className="flex items-center gap-1.5 font-bold text-warning-dark">
            <Info className="size-3.5" aria-hidden="true" /> Menunggu Pengecekan Bahan
          </p>
          <p className="mt-1 leading-relaxed">
            Admin sedang memeriksa ketersediaan bahan baku ke supplier. Form pembayaran DP akan otomatis aktif setelah bahan terkonfirmasi.
          </p>
        </div>
      ) : (
        <p className="mt-4 text-sm text-ink-soft">Pembayaran dapat dilakukan setelah pesanan dikonfirmasi oleh admin.</p>
      )}
    </section>
  );
}

function Row({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-ink-soft">{label}</dt>
      <dd className={`font-semibold ${accent ? 'text-primary' : 'text-ink'}`}>{value}</dd>
    </div>
  );
}
