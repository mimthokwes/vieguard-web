import { notFound } from 'next/navigation';
import { apiClient, ApiClientOptions, ApiError } from '@/lib/api-client';
import { getServerCache, setServerCache } from '@/lib/server-cache';
import { Product, ProductCategory, ProductFilterQuery, SmartSearchResult } from '@/types/product';

const PRODUCTS_TTL_MS = 60 * 1000; // 60 seconds TTL
const CATEGORIES_TTL_MS = 5 * 60 * 1000; // 5 minutes TTL

/**
 * Service to fetch product catalog and categories from the backend.
 */
export async function getProducts(query?: ProductFilterQuery, options?: ApiClientOptions): Promise<Product[]> {
  const isServer = typeof window === 'undefined';
  const canCache = isServer && !options?.token && !options?.headers;
  const cacheKey = `products_${JSON.stringify(query || {})}`;

  if (canCache) {
    const cached = getServerCache<Product[]>(cacheKey, PRODUCTS_TTL_MS);
    if (cached) return cached;
  }

  try {
    const params = new URLSearchParams();
    if (query?.type) params.set('type', query.type);
    if (query?.categoryId) params.set('categoryId', query.categoryId);
    if (query?.search) params.set('search', query.search);
    if (query?.minPrice) params.set('minPrice', query.minPrice);
    if (query?.maxPrice) params.set('maxPrice', query.maxPrice);
    const qs = params.toString() ? `?${params.toString()}` : '';

    const data = (await apiClient<Product[]>(`/products${qs}`, { ...options })) || [];
    if (canCache && data.length > 0) {
      setServerCache(cacheKey, data);
    }
    return data;
  } catch (error) {
    console.error('[getProducts Error]:', (error as Error).message);
    return [];
  }
}

/**
 * Smart search endpoint using HTTP method QUERY (RFC 10008).
 * Supports typo tolerance, semantic context (e.g. "agustusan" -> karnaval/17 agustus), and query ranking.
 */
export async function smartSearchProducts(
  params: { q: string; type?: 'beli' | 'sewa'; categoryId?: string },
  options?: ApiClientOptions
): Promise<SmartSearchResult> {
  try {
    const result = await apiClient<SmartSearchResult>('/products/search', {
      method: 'QUERY' as any,
      body: {
        q: params.q,
        type: params.type,
        categoryId: params.categoryId,
      },
      ...options,
    });

    return result || { products: [], meta: { rawQuery: params.q, correctedQuery: params.q, corrections: [], expandedTerms: [], total: 0 } };
  } catch (error) {
    console.error('[smartSearchProducts Error]:', (error as Error).message);
    // Graceful fallback to regular products filter if QUERY fails
    const fallbackProducts = await getProducts({ search: params.q, type: params.type, categoryId: params.categoryId });
    return {
      products: fallbackProducts,
      meta: {
        rawQuery: params.q,
        correctedQuery: params.q,
        corrections: [],
        expandedTerms: [],
        total: fallbackProducts.length,
      },
    };
  }
}

export async function getProductById(id: string, options?: ApiClientOptions): Promise<Product> {
  const isServer = typeof window === 'undefined';
  const canCache = isServer && !options?.token && !options?.headers;
  const cacheKey = `product_${id}`;

  if (canCache) {
    const cached = getServerCache<Product>(cacheKey, PRODUCTS_TTL_MS);
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

export async function getCategories(options?: ApiClientOptions): Promise<ProductCategory[]> {
  const isServer = typeof window === 'undefined';
  const canCache = isServer && !options?.token && !options?.headers;
  const cacheKey = 'categories_all';

  if (canCache) {
    const cached = getServerCache<ProductCategory[]>(cacheKey, CATEGORIES_TTL_MS);
    if (cached) return cached;
  }

  try {
    const categories = await apiClient<ProductCategory[]>('/categories', { ...options });
    const data = categories || [];
    if (canCache && data.length > 0) {
      setServerCache(cacheKey, data);
    }
    return data;
  } catch (error) {
    console.error('[getCategories Error]:', error);
    return [];
  }
}
