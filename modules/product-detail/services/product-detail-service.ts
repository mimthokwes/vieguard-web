import { notFound } from 'next/navigation';
import { apiClient, ApiClientOptions, ApiError } from '@/lib/api-client';
import { getServerCache, setServerCache } from '@/lib/server-cache';
import { Product, RentalAvailability } from '@/types/product';

const PRODUCT_DETAIL_TTL_MS = 60 * 1000;

/**
 * Service to fetch single product details and check rental availability.
 */
export async function getProductDetail(id: string, options?: ApiClientOptions): Promise<Product> {
  const isServer = typeof window === 'undefined';
  const canCache = isServer && !options?.token && !options?.headers;
  const cacheKey = `product_${id}`;

  if (canCache) {
    const cached = getServerCache<Product>(cacheKey, PRODUCT_DETAIL_TTL_MS);
    if (cached) return cached;
  }

  try {
    const product = await apiClient<Product>(`/products/${id}`, { ...options });
    if (!product) notFound();
    if (canCache) {
      setServerCache(cacheKey, product);
    }
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
