import { unstable_rethrow } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { getSessionToken } from '@/lib/session';
import { AppNotification } from '@/types/notification';

/**
 * Service to fetch user notifications and update read status.
 */
export async function getNotifications(): Promise<AppNotification[]> {
  const token = await getSessionToken();
  if (!token) return [];

  try {
    return (await apiClient<AppNotification[]>('/notifications', { token })) || [];
  } catch (error) {
    unstable_rethrow(error);
    console.error('[getNotifications Error]:', error);
    return [];
  }
}

export async function markNotificationRead(id: string): Promise<void> {
  const token = await getSessionToken();
  if (!token) return;

  await apiClient(`/notifications/${id}/read`, {
    method: 'PATCH',
    token,
  });
}
