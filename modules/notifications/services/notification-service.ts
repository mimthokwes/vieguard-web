import { unstable_rethrow } from 'next/navigation';
import { apiClient, invalidateApiCache } from '@/lib/api-client';
import { getSessionToken } from '@/lib/session';
import { AppNotification } from '@/types/notification';

/**
 * Service to fetch user notifications and update read status.
 */
export async function getNotifications(): Promise<AppNotification[]> {
  const token = await getSessionToken();
  if (!token) return [];

  try {
    return (
      (await apiClient<AppNotification[]>('/notifications', {
        token,
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' },
      })) || []
    );
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
  invalidateApiCache('/notifications');
}

export async function markAllNotificationsRead(): Promise<void> {
  const token = await getSessionToken();
  if (!token) return;

  try {
    await apiClient('/notifications/read-all', {
      method: 'PATCH',
      token,
    });
  } catch {
    // Fallback if backend hasn't been updated with read-all route yet
    const unread = (await getNotifications()).filter((n) => !n.isRead);
    await Promise.all(unread.map((n) => markNotificationRead(n.id)));
  }
  invalidateApiCache('/notifications');
}
