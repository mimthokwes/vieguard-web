import "server-only";
import { apiClient } from '../api-client';
import { StoreProfile } from '@/types/store';

export async function getStoreProfile(): Promise<StoreProfile | null> {
  try {
    return await apiClient<StoreProfile | null>('/store-profile', { next: { revalidate: 3600 } });
  } catch {
    // Footer falls back to default copy when the backend is unreachable.
    return null;
  }
}
