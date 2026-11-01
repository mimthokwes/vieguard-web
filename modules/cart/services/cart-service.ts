import { apiClient } from '@/lib/api-client';
import { Order } from '@/types/cart';
import { getSessionToken } from '@/lib/session';

/**
 * Service to manage cart orders and checkout requests.
 */
export async function createOrder(orderPayload: Record<string, unknown>): Promise<Order | null> {
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
    const orders = await apiClient<Order[]>('/orders', { token });
    return orders || [];
  } catch (error) {
    console.error('[getMyOrders Error]:', error);
    return [];
  }
}
