import { apiClient } from '@/lib/api-client';
import { StoreProfile } from '@/types/store';

/**
 * Service to fetch store profile information (contact, address, hours).
 */
export async function getStoreProfile(): Promise<StoreProfile | null> {
  try {
    return await apiClient<StoreProfile | null>('/store-profile');
  } catch {
    // Falls back to default copy when backend is unreachable
    return null;
  }
}
