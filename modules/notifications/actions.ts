'use server';

import { revalidatePath } from 'next/cache';
import { getNotifications, markNotificationRead } from './services/notification-service';
import { AppNotification } from '@/types/notification';
import { getSessionToken } from '@/lib/session';

export async function getNotificationsAction(): Promise<AppNotification[]> {
  try {
    return await getNotifications();
  } catch {
    return [];
  }
}

export async function getNotificationSocketTokenAction(): Promise<{ token?: string; error?: string }> {
  try {
    const token = await getSessionToken();
    return { token: token || undefined };
  } catch (error) {
    return { error: (error as Error).message };
  }
}

export async function markReadAction(id: string): Promise<{ error?: string }> {
  if (!/^\d+$/.test(id)) return { error: 'Notifikasi tidak valid.' };
  try {
    await markNotificationRead(id);
  } catch (error) {
    return { error: (error as Error).message };
  }
  revalidatePath('/notifications');
  return {};
}

export async function markAllReadAction(): Promise<{ error?: string }> {
  try {
    const unread = (await getNotifications()).filter((n) => !n.isRead);
    await Promise.all(unread.map((n) => markNotificationRead(n.id)));
  } catch (error) {
    return { error: (error as Error).message };
  }
  revalidatePath('/notifications');
  return {};
}
