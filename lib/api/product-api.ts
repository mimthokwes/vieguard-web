import "server-only";
import { notFound } from 'next/navigation';
import { apiClient, ApiError } from '../api-client';
import { Product, ProductFilterQuery, RentalAvailability } from '@/types/product';
import { Accessory } from '@/types/order';

export async function getProducts(query?: ProductFilterQuery, options?: RequestInit): Promise<Product[]> {
  try {
    const params = new URLSearchParams();
    if (query?.categoryId) params.set('categoryId', query.categoryId);
    if (query?.search) params.set('search', query.search);
    if (query?.minPrice) params.set('minPrice', query.minPrice);
    if (query?.maxPrice) params.set('maxPrice', query.maxPrice);
    const qs = params.toString() ? `?${params.toString()}` : '';
    return (await apiClient<Product[]>(`/products${qs}`, { next: { revalidate: 60 }, ...options })) || [];
  } catch (error) {
    console.error('[getProducts Error]:', (error as Error).message);
    return [];
  }
}

export async function getProductById(id: string, options?: RequestInit): Promise<Product> {
  try {
    const product = await apiClient<Product>(`/products/${id}`, { next: { revalidate: 60 }, ...options });
    if (!product) notFound();
    return product;
  } catch (error) {
    if (error instanceof ApiError && (error.status === 404 || error.status === 400)) notFound();
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
  return apiClient<RentalAvailability>(`/products/${productId}/availability?${params.toString()}`, { cache: 'no-store' });
}

export async function getAccessories(): Promise<Accessory[]> {
  try {
    return (await apiClient<Accessory[]>('/accessories', { next: { revalidate: 300 } })) || [];
  } catch {
    return [];
  }
}
