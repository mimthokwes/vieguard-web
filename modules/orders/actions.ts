"use server";

import { revalidatePath } from 'next/cache';
import { apiUpload } from '@/lib/api-client';
import { getSessionToken } from '@/lib/session';

export interface PaymentActionState {
  error?: string;
  success?: boolean;
}

const MAX_PROOF_BYTES = 5 * 1024 * 1024;

export async function uploadPaymentProofAction(_prev: PaymentActionState, formData: FormData): Promise<PaymentActionState> {
  const token = await getSessionToken();
  if (!token) return { error: 'Sesi berakhir. Silakan masuk kembali.' };

  const orderId = String(formData.get('orderId') ?? '');
  const paymentType = String(formData.get('paymentType') ?? '');
  const amount = Number(formData.get('amount'));
  const file = formData.get('proofImage');

  if (!/^\d+$/.test(orderId)) return { error: 'Pesanan tidak valid.' };
  if (!['dp', 'pelunasan'].includes(paymentType)) return { error: 'Jenis pembayaran tidak valid.' };
  if (!Number.isFinite(amount) || amount <= 0) return { error: 'Nominal pembayaran wajib diisi.' };
  if (!(file instanceof File) || file.size === 0) return { error: 'Pilih foto bukti transfer.' };
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) return { error: 'Gunakan foto JPG, PNG, atau WebP.' };
  if (file.size > MAX_PROOF_BYTES) return { error: 'Ukuran foto maksimal 5MB.' };

  const body = new FormData();
  body.set('orderId', orderId);
  body.set('paymentType', paymentType);
  body.set('amount', String(amount));
  body.set('paymentMethod', 'manual_transfer');
  body.set('proofImage', file, file.name);

  try {
    await apiUpload('/payments/proof', body, token);
  } catch (error) {
    return { error: (error as Error).message || 'Gagal mengunggah bukti pembayaran.' };
  }

  revalidatePath(`/orders/${orderId}`);
  return { success: true };
}
