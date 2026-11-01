/**
 * In-memory TTL cache for server-side requests.
 * Deduplicates repeated requests during Next.js SSR, RSC Link prefetching,
 * and page transitions so that the Express/Redis backend is not bombarded
 * when data has not changed.
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const cacheStore = new Map<string, CacheEntry<unknown>>();

export function getServerCache<T>(key: string, ttlMs: number): T | null {
  const entry = cacheStore.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > ttlMs) {
    cacheStore.delete(key);
    return null;
  }
  return entry.data as T;
}

export function setServerCache<T>(key: string, data: T): void {
  cacheStore.set(key, { data, timestamp: Date.now() });
}

export function invalidateServerCache(keyPrefix?: string): void {
  if (!keyPrefix) {
    cacheStore.clear();
    return;
  }
  for (const key of cacheStore.keys()) {
    if (key.startsWith(keyPrefix)) {
      cacheStore.delete(key);
    }
  }
}
