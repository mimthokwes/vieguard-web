import { apiClient, ApiClientOptions } from '@/lib/api-client';
import { getServerCache, setServerCache } from '@/lib/server-cache';
import { Testimonial } from '@/types/testimonial';

const TESTIMONIALS_TTL_MS = 60 * 1000; // 1 minute

export async function getTestimonials(options?: ApiClientOptions): Promise<Testimonial[]> {
  const isServer = typeof window === 'undefined';
  const canCache = isServer && !options?.token && !options?.headers;
  const cacheKey = 'testimonials_public';

  if (canCache) {
    const cached = getServerCache<Testimonial[]>(cacheKey, TESTIMONIALS_TTL_MS);
    if (cached) return cached;
  }

  try {
    const data = await apiClient<Testimonial[]>('/testimonials', { ...options });
    const result = data || [];
    if (canCache && result.length > 0) {
      setServerCache(cacheKey, result);
    }
    return result;
  } catch (error) {
    console.error('[getTestimonials Error]:', (error as Error).message);
    return [];
  }
}
