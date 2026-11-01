import { notFound } from 'next/navigation';
import { apiClient, ApiClientOptions, ApiError } from '@/lib/api-client';
import { Product, RentalAvailability } from '@/types/product';

/**
 * Service to fetch single product details and check rental availability.
 */
export async function getProductDetail(id: string, options?: ApiClientOptions): Promise<Product> {
  try {
    const product = await apiClient<Product>(`/products/${id}`, { ...options });
    if (!product) notFound();
    return product;
  } catch (error) {
    if (error instanceof ApiError && (error.status === 404 || error.status === 400)) {
      notFound();
    }
    throw error;
  }
}

export async function checkProductAvailability(
  productId: string,
  pickupDate: string,
  returnDate: string,
  variantId?: string | null
): Promise<RentalAvailability> {
  const params = new URLSearchParams({ pickupDate, returnDate });
  if (variantId) params.set('variantId', variantId);

  return apiClient<RentalAvailability>(`/products/${productId}/availability?${params.toString()}`);
}
