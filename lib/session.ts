import "server-only";
import { cookies } from 'next/headers';
import { User } from '@/types/user';

const ACCESS_TOKEN_KEY = 'accessToken';
const USER_DATA_KEY = 'userData';

export async function getSessionToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(ACCESS_TOKEN_KEY)?.value;
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

export async function createSession(accessToken: string, user: User) {
  const cookieStore = await cookies();
  const isProd = process.env.NODE_ENV === 'production';

  cookieStore.set(ACCESS_TOKEN_KEY, accessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });

  cookieStore.set(USER_DATA_KEY, JSON.stringify(user), {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60,
  });
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete(ACCESS_TOKEN_KEY);
  cookieStore.delete(USER_DATA_KEY);
}
