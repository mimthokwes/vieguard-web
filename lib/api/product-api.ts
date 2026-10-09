import "server-only";
import { apiClient, ApiError } from '../api-client';
import { Product, ProductFilterQuery } from '@/types/product';
import { notFound } from 'next/navigation';

export async function getProducts(
  query?: ProductFilterQuery,
  options?: RequestInit
): Promise<Product[]> {
  try {
    const params = new URLSearchParams();
    if (query?.categoryId) params.set('categoryId', query.categoryId);
    if (query?.search) params.set('search', query.search);
    if (query?.minPrice) params.set('minPrice', query.minPrice);
    if (query?.maxPrice) params.set('maxPrice', query.maxPrice);

    const queryString = params.toString() ? `?${params.toString()}` : '';
    const products = await apiClient<Product[]>(`/products${queryString}`, {
      next: { revalidate: 60 },
      ...options,
    });
    return products || [];
  } catch (error) {
    console.error('[getProducts Error]:', error);
    return [];
  }
}

export async function getProductById(
  id: string,
  options?: RequestInit
): Promise<Product> {
  try {
    const product = await apiClient<Product>(`/products/${id}`, {
      next: { revalidate: 60 },
      ...options,
    });
    if (!product) {
      notFound();
    }
    return product;
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      notFound();
    }
    throw error;
  }
}

export async function checkProductAvailability(
  productId: string,
  variantId?: string | null,
  pickupDate?: string,
  returnDate?: string
): Promise<{ available: boolean; remainingStock: number; message?: string }> {
  try {
    const params = new URLSearchParams();
    if (variantId) params.set('variantId', variantId);
    if (pickupDate) params.set('pickupDate', pickupDate);
    if (returnDate) params.set('returnDate', returnDate);

    const data = await apiClient<{ available: boolean; remainingStock: number; message?: string }>(
      `/products/${productId}/availability?${params.toString()}`
    );
    return data;
  } catch (error) {
    return { available: true, remainingStock: 5 };
  }
}
