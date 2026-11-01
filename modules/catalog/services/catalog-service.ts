import { notFound } from 'next/navigation';
import { apiClient, ApiClientOptions, ApiError } from '@/lib/api-client';
import { Product, ProductCategory, ProductFilterQuery } from '@/types/product';

/**
 * Service to fetch product catalog and categories from the backend.
 */
export async function getProducts(query?: ProductFilterQuery, options?: ApiClientOptions): Promise<Product[]> {
  try {
    const params = new URLSearchParams();
    if (query?.categoryId) params.set('categoryId', query.categoryId);
    if (query?.search) params.set('search', query.search);
    if (query?.minPrice) params.set('minPrice', query.minPrice);
    if (query?.maxPrice) params.set('maxPrice', query.maxPrice);
    const qs = params.toString() ? `?${params.toString()}` : '';

    return (await apiClient<Product[]>(`/products${qs}`, { ...options })) || [];
  } catch (error) {
    console.error('[getProducts Error]:', (error as Error).message);
    return [];
  }
}

export async function getProductById(id: string, options?: ApiClientOptions): Promise<Product> {
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

export async function getCategories(options?: ApiClientOptions): Promise<ProductCategory[]> {
  try {
    const categories = await apiClient<ProductCategory[]>('/categories', { ...options });
    return categories || [];
  } catch (error) {
    console.error('[getCategories Error]:', error);
    return [];
  }
}
