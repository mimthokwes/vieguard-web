"use server";

import { destroySession, getSessionRefreshToken } from '@/lib/session';
import { logoutUser } from '@/modules/auth/lib/auth-api';
import { redirect } from 'next/navigation';

export async function logoutAction() {
  await logoutUser(await getSessionRefreshToken());
  await destroySession();
  redirect('/login');
}
