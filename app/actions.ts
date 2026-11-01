"use server";

import { destroySession, getSessionRefreshToken } from '@/lib/session';
import { logoutUser } from '@/modules/auth/services/auth-service';
import { redirect } from 'next/navigation';

export async function logoutAction() {
  await logoutUser(await getSessionRefreshToken());
  await destroySession();
  redirect('/login');
}
