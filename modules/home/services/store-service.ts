import { apiClient } from '@/lib/api-client';
import { getServerCache, setServerCache } from '@/lib/server-cache';
import { StoreProfile } from '@/types/store';

const STORE_PROFILE_TTL_MS = 10 * 60 * 1000; // 10 minutes

/**
 * Service to fetch store profile information (contact, address, hours).
 */
export async function getStoreProfile(): Promise<StoreProfile | null> {
  const isServer = typeof window === 'undefined';
  const cacheKey = 'store_profile';

  if (isServer) {
    const cached = getServerCache<StoreProfile | null>(cacheKey, STORE_PROFILE_TTL_MS);
    if (cached !== null && cached !== undefined) return cached;
  }

  try {
    const data = await apiClient<StoreProfile | null>('/store-profile');
    if (isServer && data) {
      setServerCache(cacheKey, data);
    }
    return data;
  } catch {
    // Falls back to default copy when backend is unreachable
    return null;
  }
}
