'use server';

import { revalidatePath } from 'next/cache';
import {
  getMyOrders,
  getOrderDetail,
  getOrderStatusHistory,
  uploadPaymentProof,
  createSnapPayment,
  chargeDirectPayment,
  DirectPaymentResponse,
} from './services/orders-service';
import { getSessionToken } from '@/lib/session';
import { encodeOrderId } from '@/lib/order-hash';
import { Order, OrderStatusHistory } from '@/types/order';

export interface PaymentActionState {
  error?: string;
  success?: boolean;
}

export async function getMyOrdersAction(): Promise<{ orders: Order[]; error?: string }> {
  return getMyOrders();
}

export async function getOrderDetailAction(id: string): Promise<{ order?: Order; history?: OrderStatusHistory[]; error?: string }> {
  try {
    const [order, history] = await Promise.all([getOrderDetail(id), getOrderStatusHistory(id)]);
    return { order, history };
  } catch (error) {
    return { error: (error as Error).message };
  }
}

export async function chargeDirectPaymentAction(
  orderId: string,
  paymentMethod: 'qris' | 'va',
  bank?: 'bca' | 'mandiri' | 'bni' | 'bri' | 'permata' | 'cimb',
  paymentType: 'dp' | 'pelunasan' = 'dp'
): Promise<{ error?: string; data?: DirectPaymentResponse }> {
  const token = await getSessionToken();
  if (!token) return { error: 'Sesi berakhir. Silakan masuk kembali.' };

  try {
    const res = await chargeDirectPayment(orderId, { paymentMethod, bank, paymentType });
    return { data: res };
  } catch (error) {
    return { error: (error as Error).message || 'Gagal memproses pembayaran online.' };
  }
}

export async function createSnapPaymentAction(
  orderId: string,
  paymentMethod: 'qris' | 'va',
  paymentType: 'dp' | 'pelunasan'
): Promise<{ error?: string; snapToken?: string; redirectUrl?: string }> {
  const token = await getSessionToken();
  if (!token) return { error: 'Sesi berakhir. Silakan masuk kembali.' };

  try {
    const res = await createSnapPayment(orderId, { paymentMethod, paymentType });
    return { snapToken: res.snapToken, redirectUrl: res.redirectUrl };
  } catch (error) {
    return { error: (error as Error).message || 'Gagal menyiapkan pembayaran online.' };
  }
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
    await uploadPaymentProof(body, token);
  } catch (error) {
    return { error: (error as Error).message || 'Gagal mengunggah bukti pembayaran.' };
  }

  revalidatePath(`/orders/${orderId}`);
  revalidatePath(`/orders/${encodeOrderId(orderId)}`);
  revalidatePath('/orders');
  return { success: true };
}
