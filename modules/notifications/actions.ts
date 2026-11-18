'use server';

import { revalidatePath } from 'next/cache';
import { getNotifications, markNotificationRead, markAllNotificationsRead } from './services/notification-service';
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

export async function markReadAction(id: string): Promise<{ success?: boolean; error?: string }> {
  if (!/^\d+$/.test(id)) return { error: 'Notifikasi tidak valid.' };
  try {
    await markNotificationRead(id);
    revalidatePath('/notifications');
    return { success: true };
  } catch (error) {
    return { error: (error as Error).message };
  }
}

export async function markAllReadAction(): Promise<{ success?: boolean; error?: string }> {
  try {
    await markAllNotificationsRead();
    revalidatePath('/notifications');
    return { success: true };
  } catch (error) {
    return { error: (error as Error).message };
  }
}
