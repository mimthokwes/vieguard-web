import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, USER_DATA_KEY, jwtExpiry, readSetCookie, sessionCookieOptions } from '@/lib/session-cookies';

const API_URL = process.env.API_URL || 'http://localhost:5000/api/v0/website';
/** Renew the access token when it has less than this many seconds left. */
const REFRESH_MARGIN_SECONDS = 60;

function clearSession(request: NextRequest) {
  for (const name of [ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, USER_DATA_KEY]) request.cookies.delete(name);
  const response = NextResponse.next({ request: { headers: new Headers(request.headers) } });
  for (const name of [ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, USER_DATA_KEY]) response.cookies.delete(name);
  return response;
}

/**
 * Keeps the backend session alive: backend access tokens last 15 minutes, while the
 * site cookie lasts 7 days. Before each page render, renew an expiring access token
 * with the refresh token, or log the user out when it can no longer be renewed.
 */
export async function proxy(request: NextRequest) {
  const access = request.cookies.get(ACCESS_TOKEN_KEY)?.value;
  const refresh = request.cookies.get(REFRESH_TOKEN_KEY)?.value;
  if (!access && !refresh) return NextResponse.next();

  const exp = access ? jwtExpiry(access) : null;
  const secondsLeft = exp === null ? -1 : exp - Math.floor(Date.now() / 1000);
  if (secondsLeft > REFRESH_MARGIN_SECONDS) return NextResponse.next();

  // Sessions created before refresh tokens were stored cannot be renewed.
  if (!refresh) return clearSession(request);

  try {
    const res = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      headers: { Cookie: `${REFRESH_TOKEN_KEY}=${encodeURIComponent(refresh)}` },
      cache: 'no-store',
    });
    if (res.status === 401 || res.status === 403) return clearSession(request);
    if (!res.ok) return NextResponse.next(); // backend hiccup: keep the session, try again next request

    // The backend returns the new access token only as a Set-Cookie header.
    const newToken = readSetCookie(res, ACCESS_TOKEN_KEY);
    if (!newToken) return NextResponse.next();

    // Make the new token visible to this render and persist it in the browser.
    request.cookies.set(ACCESS_TOKEN_KEY, newToken);
    const response = NextResponse.next({ request: { headers: new Headers(request.headers) } });
    response.cookies.set(ACCESS_TOKEN_KEY, newToken, sessionCookieOptions());
    return response;
  } catch {
    // Backend unreachable: don't log the user out because of a network error.
    return NextResponse.next();
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|images/|.*\\.(?:svg|png|jpg|jpeg|webp|ico)$).*)'],
};
