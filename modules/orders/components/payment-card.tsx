"use client";

import React, { useActionState } from 'react';
import { CircleCheck, CreditCard, Upload } from 'lucide-react';
import { Order } from '@/types/order';
import { Badge } from '@/components/ui/badge';
import { ErrorMessage } from '@/components/ui/error-message';
import { SubmitButton } from '@/components/ui/submit-button';
import { formatDateTime, formatRupiah, toNumber } from '@/lib/format';
import { PAYMENT_STATUS_META } from '@/lib/order-status';
import { PaymentActionState, uploadPaymentProofAction } from '../actions';

const initialState: PaymentActionState = {};

/** Payment history plus manual transfer proof upload (POST /payments/proof). */
export function PaymentCard({ order }: { order: Order }) {
  const [state, formAction] = useActionState(uploadPaymentProofAction, initialState);
  const payments = order.payments ?? [];
  const total = toNumber(order.totalPrice);
  const dp = toNumber(order.dpAmount);
  const paid = payments.filter((p) => p.status === 'terverifikasi' && p.paymentType !== 'refund').reduce((s, p) => s + toNumber(p.amount), 0);
  const pending = payments.some((p) => p.status === 'menunggu');
  const canPay = !order.isLunas && total > 0 && order.status !== 'dibatalkan' && order.status !== 'pending' && !pending;
  const suggestedType = paid > 0 || dp <= 0 ? 'pelunasan' : 'dp';
  const suggestedAmount = suggestedType === 'dp' ? dp : Math.max(0, total - paid);

  return (
    <section className="rounded-2xl bg-surface p-6 shadow-card ring-1 ring-line">
      <h2 className="flex items-center gap-2 border-b border-line pb-3 text-lg font-bold text-ink">
        <CreditCard className="size-5 text-primary" aria-hidden="true" /> Pembayaran
      </h2>
      <dl className="flex flex-col gap-1.5 pt-4 text-sm">
        <Row label="Total Tagihan" value={total > 0 ? formatRupiah(total) : 'Menunggu penawaran'} />
        {dp > 0 && <Row label="Uang Muka (DP)" value={formatRupiah(dp)} />}
        <Row label="Sudah Terverifikasi" value={formatRupiah(paid)} />
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
        <form action={formAction} className="mt-4 flex flex-col gap-3 border-t border-line pt-4">
          <input type="hidden" name="orderId" value={order.id} />
          <p className="text-sm font-semibold text-ink">Unggah Bukti Transfer</p>
          <div className="grid grid-cols-2 gap-2">
            <select name="paymentType" defaultValue={suggestedType} className="h-10 rounded-lg border border-line bg-surface px-2 text-sm" aria-label="Jenis pembayaran">
              <option value="dp">DP</option>
              <option value="pelunasan">Pelunasan</option>
            </select>
            <input
              name="amount"
              type="number"
              min={1}
              defaultValue={suggestedAmount || undefined}
              placeholder="Nominal"
              aria-label="Nominal transfer"
              className="h-10 rounded-lg border border-line bg-surface px-3 text-sm"
              required
            />
          </div>
          <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-line-strong px-3 py-3 text-sm text-ink-soft hover:border-primary">
            <Upload className="size-4 text-primary" aria-hidden="true" />
            <input name="proofImage" type="file" accept="image/jpeg,image/png,image/webp" required className="w-full text-xs file:mr-2 file:rounded file:border-0 file:bg-beige-soft file:px-2 file:py-1 file:text-primary" />
          </label>
          <ErrorMessage message={state.error} />
          <SubmitButton label="Kirim Bukti Pembayaran" loadingLabel="Mengunggah..." size="md" />
        </form>
      ) : pending ? (
        <p className="mt-4 text-sm text-warning">Bukti pembayaran sedang diverifikasi admin.</p>
      ) : (
        <p className="mt-4 text-sm text-ink-soft">Pembayaran dapat dilakukan setelah admin mengonfirmasi pesanan dan menetapkan harga.</p>
      )}
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-ink-soft">{label}</dt>
      <dd className="font-semibold text-ink">{value}</dd>
    </div>
  );
}
