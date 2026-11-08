"use client";

import React, { useActionState, useState } from 'react';
import { Check, CircleCheck, CreditCard, Info, Upload } from 'lucide-react';
import { Order } from '@/types/order';
import { Badge } from '@/components/ui/badge';
import { ErrorMessage } from '@/components/ui/error-message';
import { SubmitButton } from '@/components/ui/submit-button';
import { formatDateTime, formatRupiah, toNumber } from '@/lib/format';
import { PAYMENT_STATUS_META } from '@/lib/order-status';
import { PaymentActionState, uploadPaymentProofAction } from '../actions';

const initialState: PaymentActionState = {};

/** Payment summary plus payment proof upload (POST /payments/proof). */
export function PaymentCard({ order }: { order: Order }) {
  const [state, formAction] = useActionState(uploadPaymentProofAction, initialState);
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

  // Suggested payment type: if already paid some (DP verified), customer must pay the rest ('pelunasan')
  const defaultChoice: 'dp' | 'pelunasan' = paid > 0 ? 'pelunasan' : 'dp';
  const [paymentChoice, setPaymentChoice] = useState<'dp' | 'pelunasan'>(defaultChoice);

  // Compute selected amount automatically (customer cannot edit manual numbers)
  const selectedAmount = paymentChoice === 'dp' && paid === 0 ? defaultDp : remaining;

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
      ) : state.success ? (
        <p role="status" className="mt-4 rounded-lg bg-success-bg px-3 py-2 text-sm font-semibold text-success">
          Bukti terkirim. Admin akan memverifikasi pembayaran Anda.
        </p>
      ) : canPay ? (
        <div className="mt-5 flex flex-col gap-4 border-t border-line pt-5">
          <form action={formAction} className="flex flex-col gap-4">
            <input type="hidden" name="orderId" value={order.id} />
            <input type="hidden" name="paymentType" value={paymentChoice} />
            <input type="hidden" name="amount" value={selectedAmount} />

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

            <div>
              <label className="block text-xs font-bold text-ink">
                Unggah Bukti Transfer:
              </label>
              <label className="mt-2 flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-line-strong bg-canvas p-4 text-center text-xs text-ink-soft transition hover:border-primary hover:bg-beige-soft/40">
                <Upload className="size-5 text-primary" aria-hidden="true" />
                <span className="pt-1.5 font-semibold text-ink">Pilih file struk / screenshot transfer</span>
                <span className="text-[11px] text-muted">Format JPG, PNG, atau WebP (maks. 5MB)</span>
                <input
                  name="proofImage"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  required
                  className="mt-2 w-full text-xs file:mr-2 file:rounded file:border-0 file:bg-white file:px-2.5 file:py-1 file:text-xs file:font-semibold file:text-primary file:shadow-xs"
                />
              </label>
            </div>

            <ErrorMessage message={state.error} />
            <SubmitButton
              label={`Kirim Bukti Pembayaran (${formatRupiah(selectedAmount)})`}
              loadingLabel="Mengunggah..."
              size="md"
            />
          </form>
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
