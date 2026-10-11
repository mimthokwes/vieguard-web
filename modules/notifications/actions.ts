"use server";

import { revalidatePath } from 'next/cache';
import { getNotifications, markNotificationRead } from '@/lib/api/notification-api';

export async function markReadAction(id: string): Promise<{ error?: string }> {
  if (!/^\d+$/.test(id)) return { error: 'Notifikasi tidak valid.' };
  try {
    await markNotificationRead(id);
  } catch (error) {
    return { error: (error as Error).message };
  }
  revalidatePath('/notifications');
  revalidatePath('/', 'layout');
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
  revalidatePath('/', 'layout');
  return {};
}
