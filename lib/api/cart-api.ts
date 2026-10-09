import "server-only";
import { apiClient } from '../api-client';
import { Order } from '@/types/cart';
import { getSessionToken } from '../session';

export async function createOrder(orderPayload: any): Promise<Order | null> {
  const token = await getSessionToken();
  if (!token) throw new Error('Pengguna belum login.');

  const order = await apiClient<Order>('/orders', {
    method: 'POST',
    body: JSON.stringify(orderPayload),
    token,
  });

  return order;
}

export async function getMyOrders(): Promise<Order[]> {
  const token = await getSessionToken();
  if (!token) return [];

  try {
    const orders = await apiClient<Order[]>('/orders', {
      token,
      cache: 'no-store',
    });
    return orders || [];
  } catch (error) {
    console.error('[getMyOrders Error]:', error);
    return [];
  }
}
