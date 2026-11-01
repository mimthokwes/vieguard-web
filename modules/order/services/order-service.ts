import { apiClient, ApiError } from '@/lib/api-client';
import { getSessionToken } from '@/lib/session';
import { CreateOrderPayload, Order, Accessory } from '@/types/order';

/**
 * Service for submitting orders and fetching accessories.
 */
export async function createOrder(payload: CreateOrderPayload): Promise<Order> {
  const token = await getSessionToken();
  if (!token) throw new ApiError('Silakan masuk terlebih dahulu.', 401);

  return apiClient<Order>('/orders', {
    method: 'POST',
    body: JSON.stringify(payload),
    token,
  });
}

export async function getAccessories(): Promise<Accessory[]> {
  try {
    return (await apiClient<Accessory[]>('/accessories')) || [];
  } catch {
    return [];
  }
}
