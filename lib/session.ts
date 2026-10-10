import "server-only";
import { cookies } from 'next/headers';
import { User } from '@/types/user';
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, USER_DATA_KEY, sessionCookieOptions } from './session-cookies';

export async function getSessionToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(ACCESS_TOKEN_KEY)?.value;
}

export async function getSessionRefreshToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(REFRESH_TOKEN_KEY)?.value;
}

export async function getSessionUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const rawUser = cookieStore.get(USER_DATA_KEY)?.value;
  if (!rawUser) return null;
  try {
    return JSON.parse(rawUser) as User;
  } catch {
    return null;
  }
}

/**
 * Stores the session. The access token is short-lived (15 min on the backend);
 * proxy.ts uses the refresh token to renew it before it expires.
 */
export async function createSession(accessToken: string, user: User, refreshToken?: string) {
  const cookieStore = await cookies();
  cookieStore.set(ACCESS_TOKEN_KEY, accessToken, sessionCookieOptions());
  cookieStore.set(USER_DATA_KEY, JSON.stringify(user), sessionCookieOptions());
  if (refreshToken) cookieStore.set(REFRESH_TOKEN_KEY, refreshToken, sessionCookieOptions());
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete(ACCESS_TOKEN_KEY);
  cookieStore.delete(REFRESH_TOKEN_KEY);
  cookieStore.delete(USER_DATA_KEY);
}

/** Refresh the cached user profile cookie after a profile update. */
export async function updateSessionUser(user: User) {
  const cookieStore = await cookies();
  cookieStore.set(USER_DATA_KEY, JSON.stringify(user), sessionCookieOptions());
}
