import "server-only";
import { apiClient } from '../api-client';
import { ProductCategory } from '@/types/product';

export async function getCategories(): Promise<ProductCategory[]> {
  try {
    const categories = await apiClient<ProductCategory[]>('/categories', {
      next: { revalidate: 3600 }, // Cache categories for 1 hr
    });
    return categories || [];
  } catch (error) {
    console.error('[getCategories Error]:', error);
    return [];
  }
}
