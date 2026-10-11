/** Cookie names and options shared by server code (lib/session.ts) and proxy.ts. */
export const ACCESS_TOKEN_KEY = 'accessToken';
export const REFRESH_TOKEN_KEY = 'refreshToken';
export const USER_DATA_KEY = 'userData';

export const SESSION_MAX_AGE = 7 * 24 * 60 * 60; // matches the backend refresh token lifetime

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: SESSION_MAX_AGE,
  };
}

/** Seconds-since-epoch expiry from a JWT payload, without verifying the signature. */
export function jwtExpiry(token: string): number | null {
  try {
    const payload = token.split('.')[1];
    if (!payload) return null;
    const json = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
    return typeof json.exp === 'number' ? json.exp : null;
  } catch {
    return null;
  }
}

/** Value of a cookie the backend set on a fetch response (backend sends tokens only via Set-Cookie). */
export function readSetCookie(res: Response, name: string): string | undefined {
  const headers = res.headers as Headers & { getSetCookie?: () => string[] };
  const all = headers.getSetCookie?.() ?? (res.headers.get('set-cookie') ?? '').split(/,(?=\s*[^;=]+=)/);
  for (const line of all) {
    const [pair] = line.split(';');
    const idx = pair?.indexOf('=') ?? -1;
    if (pair && idx > 0 && pair.slice(0, idx).trim() === name) {
      const value = decodeURIComponent(pair.slice(idx + 1).trim());
      return value || undefined;
    }
  }
  return undefined;
}
