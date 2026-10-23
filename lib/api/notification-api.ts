// lib/api/notification-api.ts
import "server-only";
import { unstable_rethrow } from 'next/navigation';
import { apiClient } from '../api-client';
import { getSessionToken } from '../session';
import { AppNotification } from '@/types/notification';

export async function getNotifications(): Promise<AppNotification[]> {
  const token = await getSessionToken();
  if (!token) return [];
  try {
    return (await apiClient<AppNotification[]>('/notifications', { token, cache: 'no-store' })) || [];
  } catch (error) {
    unstable_rethrow(error); // kalau ini redirect, dilempar ulang; kalau bukan, lanjut ke bawah
    console.error('[getNotifications Error]:', error);
    return [];
  }
}

export async function markNotificationRead(id: string): Promise<void> {
  const token = await getSessionToken();
  if (!token) return;
  await apiClient(`/notifications/${id}/read`, { method: 'PATCH', token });
}
2