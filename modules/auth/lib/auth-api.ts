import "server-only";
import { ApiError } from '@/lib/api-client';
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, readSetCookie } from '@/lib/session-cookies';
import { AuthResponse, User } from '@/types/user';

const baseUrl = () => process.env.API_URL || 'http://localhost:5000/api/v0/website';

/**
 * Login/register return only `{ user }` in the JSON body; the access and refresh
 * tokens arrive as Set-Cookie headers, so these calls read the raw response.
 */
async function authRequest(endpoint: string, payload: unknown): Promise<AuthResponse> {
  let res: Response;
  try {
    res = await fetch(`${baseUrl()}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      cache: 'no-store',
    });
  } catch {
    throw new ApiError('Server backend tidak dapat dihubungi. Pastikan backend VIEGUARD sedang berjalan.', 503);
  }

  const body = await res.json().catch(() => null);
  if (!res.ok) throw new ApiError(body?.message || `HTTP error ${res.status}`, res.status, body?.errors);

  const user: User | undefined = body?.data?.user;
  const accessToken = readSetCookie(res, ACCESS_TOKEN_KEY) ?? body?.data?.accessToken;
  const refreshToken = readSetCookie(res, REFRESH_TOKEN_KEY) ?? body?.data?.refreshToken;
  if (!user) throw new ApiError('Respons server tidak berisi data pengguna.', 500);
  return { user, accessToken, refreshToken };
}

export function loginUser(email: string, password: string): Promise<AuthResponse> {
  return authRequest('/auth/login', { email, password });
}

export function registerUser(payload: { name: string; email: string; password: string; phone?: string; address?: string }): Promise<AuthResponse> {
  return authRequest('/auth/register', payload);
}

/** Revokes the refresh token on the backend (best effort). */
export async function logoutUser(refreshToken?: string) {
  if (!refreshToken) return;
  try {
    await fetch(`${baseUrl()}/auth/logout`, {
      method: 'POST',
      headers: { Cookie: `${REFRESH_TOKEN_KEY}=${encodeURIComponent(refreshToken)}` },
      cache: 'no-store',
    });
  } catch {
    // Local session is cleared regardless.
  }
}
