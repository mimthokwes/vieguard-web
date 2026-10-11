import "server-only";
import { notFound } from 'next/navigation';
import { apiClient, ApiError } from '../api-client';
import { getSessionToken } from '../session';
import { CreateOrderPayload, Order, OrderStatusHistory } from '@/types/order';

export async function createOrder(payload: CreateOrderPayload): Promise<Order> {
  const token = await getSessionToken();
  if (!token) throw new ApiError('Silakan masuk terlebih dahulu.', 401);
  return apiClient<Order>('/orders', { method: 'POST', body: JSON.stringify(payload), token });
}

export async function getMyOrders(): Promise<{ orders: Order[]; error?: string }> {
  const token = await getSessionToken();
  if (!token) return { orders: [] };
  try {
    return { orders: (await apiClient<Order[]>('/orders', { token, cache: 'no-store' })) || [] };
  } catch (error) {
    return { orders: [], error: (error as Error).message };
  }
}

export async function getOrderDetail(id: string): Promise<Order> {
  const token = await getSessionToken();
  if (!token) throw new ApiError('Silakan masuk terlebih dahulu.', 401);
  try {
    return await apiClient<Order>(`/orders/${id}`, { token, cache: 'no-store' });
  } catch (error) {
    if (error instanceof ApiError && (error.status === 404 || error.status === 400)) notFound();
    throw error;
  }
}

export async function getOrderStatusHistory(id: string): Promise<OrderStatusHistory[]> {
  const token = await getSessionToken();
  if (!token) return [];
  try {
    return (await apiClient<OrderStatusHistory[]>(`/orders/${id}/status-history`, { token, cache: 'no-store' })) || [];
  } catch {
    return [];
  }
}
