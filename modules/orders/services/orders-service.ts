import { notFound } from 'next/navigation';
import { apiClient, apiUpload, ApiError } from '@/lib/api-client';
import { getSessionToken } from '@/lib/session';
import { Order, OrderStatusHistory } from '@/types/order';

/**
 * Service to manage customer order history, detail tracking, and payments.
 */
export async function getMyOrders(): Promise<{ orders: Order[]; error?: string }> {
  const token = await getSessionToken();
  if (!token) return { orders: [] };

  try {
    const orders = await apiClient<Order[]>('/orders', { token });
    return { orders: orders || [] };
  } catch (error) {
    return { orders: [], error: (error as Error).message };
  }
}

export async function getOrderDetail(id: string): Promise<Order> {
  const token = await getSessionToken();
  if (!token) throw new ApiError('Silakan masuk terlebih dahulu.', 401);

  try {
    return await apiClient<Order>(`/orders/${id}`, { token });
  } catch (error) {
    if (error instanceof ApiError && (error.status === 404 || error.status === 400)) {
      notFound();
    }
    throw error;
  }
}

export async function getOrderStatusHistory(id: string): Promise<OrderStatusHistory[]> {
  const token = await getSessionToken();
  if (!token) return [];

  try {
    return (await apiClient<OrderStatusHistory[]>(`/orders/${id}/status-history`, { token })) || [];
  } catch {
    return [];
  }
}

export async function uploadPaymentProof(formData: FormData, token: string): Promise<unknown> {
  return apiUpload('/payments/proof', formData, token);
}

export async function createSnapPayment(
  orderId: string,
  options?: {
    paymentMethod?: 'qris' | 'va';
    paymentType?: 'dp' | 'pelunasan';
  }
): Promise<{ snapToken: string; redirectUrl: string; grossAmount: number }> {
  const token = await getSessionToken();
  if (!token) throw new ApiError('Silakan masuk terlebih dahulu.', 401);

  return apiClient<{ snapToken: string; redirectUrl: string; grossAmount: number }>('/payments/snap', {
    method: 'POST',
    body: {
      orderId,
      paymentMethod: options?.paymentMethod,
      paymentType: options?.paymentType,
    },
    token,
  });
}

export interface DirectPaymentResponse {
  orderId: string;
  originalOrderNumber: string;
  orderNumber: string;
  paymentType: 'dp' | 'pelunasan';
  grossAmount: number;
  paymentMethod: 'qris' | 'va';
  transactionId: string;
  transactionStatus: string;
  expiryTime?: string;
  qrUrl?: string;
  qrString?: string;
  bank?: string;
  vaNumber?: string;
  billKey?: string;
  billerCode?: string;
}

export async function chargeDirectPayment(
  orderId: string,
  options: {
    paymentMethod: 'qris' | 'va';
    bank?: 'bca' | 'mandiri' | 'bni' | 'bri' | 'permata' | 'cimb';
    paymentType?: 'dp' | 'pelunasan';
  }
): Promise<DirectPaymentResponse> {
  const token = await getSessionToken();
  if (!token) throw new ApiError('Silakan masuk terlebih dahulu.', 401);

  return apiClient<DirectPaymentResponse>('/payments/charge', {
    method: 'POST',
    body: {
      orderId,
      paymentMethod: options.paymentMethod,
      bank: options.bank,
      paymentType: options.paymentType,
    },
    token,
  });
}


