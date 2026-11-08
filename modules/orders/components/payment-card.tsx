"use client";

import React, { useEffect, useState } from 'react';
import { Building2, Check, CircleCheck, CreditCard, Info, QrCode, Upload } from 'lucide-react';
import { Order } from '@/types/order';
import { Badge } from '@/components/ui/badge';
import { ErrorMessage } from '@/components/ui/error-message';
import { formatDateTime, formatRupiah, toNumber } from '@/lib/format';
import { PAYMENT_STATUS_META } from '@/lib/order-status';
import { createSnapPaymentAction, uploadPaymentProofAction, PaymentActionState } from '../actions';

const initialProofState: PaymentActionState = {};

/** Payment summary plus Midtrans Snap Payment Gateway integration. */
export function PaymentCard({ order }: { order: Order }) {
  const [proofState, proofAction] = React.useActionState(uploadPaymentProofAction, initialProofState);
  const [showManualUpload, setShowManualUpload] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [gatewayError, setGatewayError] = useState<string | null>(null);

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

  // Suggested payment type: DP vs Pelunasan
  const defaultChoice: 'dp' | 'pelunasan' = paid > 0 ? 'pelunasan' : 'dp';
  const [paymentChoice, setPaymentChoice] = useState<'dp' | 'pelunasan'>(defaultChoice);

  // Suggested payment gateway channel: QRIS vs Virtual Account
  const [paymentMethod, setPaymentMethod] = useState<'qris' | 'va'>('qris');

  // Compute selected amount automatically
  const selectedAmount = paymentChoice === 'dp' && paid === 0 ? defaultDp : remaining;

  // Load Midtrans Snap script dynamically in browser
  useEffect(() => {
    const isProduction = process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === 'true';
    const snapScriptUrl = isProduction
      ? 'https://app.midtrans.com/snap/snap.js'
      : 'https://app.sandbox.midtrans.com/snap/snap.js';
    const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || 'Mid-client-l9WffofIH_XrAwcn';

    if (document.querySelector(`script[src="${snapScriptUrl}"]`)) return;

    const script = document.createElement('script');
    script.src = snapScriptUrl;
    script.setAttribute('data-client-key', clientKey);
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Keep script in document to avoid reloading on re-renders
    };
  }, []);

  const handleOnlinePayment = async () => {
    setIsProcessing(true);
    setGatewayError(null);

    try {
      const res = await createSnapPaymentAction(order.id, paymentMethod, paymentChoice);

      if (res.error || !res.snapToken) {
        setGatewayError(res.error || 'Gagal memulai sesi pembayaran Midtrans.');
        setIsProcessing(false);
        return;
      }

      // Check if Midtrans Snap popup is available
      const snap = (window as any).snap;
      if (snap && typeof snap.pay === 'function') {
        snap.pay(res.snapToken, {
          onSuccess: () => {
            setIsProcessing(false);
            window.location.reload();
          },
          onPending: () => {
            setIsProcessing(false);
            window.location.reload();
          },
          onError: (err: any) => {
            setIsProcessing(false);
            setGatewayError(err?.message || 'Pembayaran gagal diproses.');
          },
          onClose: () => {
            setIsProcessing(false);
          },
        });
      } else if (res.redirectUrl) {
        // Fallback: Redirect to Midtrans VTWeb checkout page
        window.location.href = res.redirectUrl;
      } else {
        setGatewayError('Sistem pembayaran sedang tidak dapat diakses. Silakan coba lagi.');
        setIsProcessing(false);
      }
    } catch (err: any) {
      setGatewayError(err?.message || 'Terjadi kesalahan sistem.');
      setIsProcessing(false);
    }
  };

  return (
    <section className="rounded-2xl bg-surface p-6 shadow-card ring-1 ring-line">
      <h2 className="flex items-center gap-2 border-b border-line pb-3 text-lg font-bold text-ink">
        <CreditCard className="size-5 text-primary" aria-hidden="true" /> Pembayaran
      </h2>
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

      {order.isLunas ? (
        <p className="mt-4 flex items-center gap-2 text-sm font-semibold text-success">
          <CircleCheck className="size-4" aria-hidden="true" /> Pesanan sudah lunas.
        </p>
      ) : proofState.success ? (
        <p role="status" className="mt-4 rounded-lg bg-success-bg px-3 py-2 text-sm font-semibold text-success">
          Bukti transfer terkirim. Admin akan memverifikasi pembayaran Anda.
        </p>
      ) : canPay ? (
        <div className="mt-5 flex flex-col gap-4 border-t border-line pt-5">
          {/* Pilihan skema pembayaran: DP vs Bayar Lunas 100% */}
          {paid === 0 ? (
            <div>
              <label className="block text-xs font-bold text-ink">
                Pilih Skema Pembayaran:
              </label>
              <div className="mt-2 grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setPaymentChoice('dp')}
                  className={`relative flex flex-col items-start rounded-xl border p-3 text-left transition-all ${
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
                  className={`relative flex flex-col items-start rounded-xl border p-3 text-left transition-all ${
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

          {/* Pilihan metode pembayaran online: QRIS vs Virtual Account */}
          <div>
            <label className="block text-xs font-bold text-ink">
              Pilih Metode Pembayaran Online:
            </label>
            <div className="mt-2 grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setPaymentMethod('qris')}
                className={`relative flex flex-col items-start rounded-xl border p-3 text-left transition-all ${
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
                className={`relative flex flex-col items-start rounded-xl border p-3 text-left transition-all ${
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

          <ErrorMessage message={gatewayError ?? undefined} />

          {/* Tombol Utama: Bayar Langsung via Payment Gateway */}
          <button
            type="button"
            disabled={isProcessing}
            onClick={handleOnlinePayment}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-white shadow-md transition hover:bg-primary/90 active:scale-[0.99] disabled:opacity-60 cursor-pointer"
          >
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <span className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Membuka Pembayaran...
              </span>
            ) : (
              <span>
                Bayar Sekarang ({formatRupiah(selectedAmount)})
              </span>
            )}
          </button>

          {/* Opsi alternatif: Unggah bukti manual jika dibutuhkan */}
          <div className="pt-1 text-center">
            <button
              type="button"
              onClick={() => setShowManualUpload((prev) => !prev)}
              className="text-[11px] font-medium text-ink-soft hover:text-primary transition underline underline-offset-2"
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
                className="rounded-lg bg-surface border border-line-strong py-2 text-xs font-bold text-ink hover:bg-beige-soft transition"
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
