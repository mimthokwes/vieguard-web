import { NextRequest, NextResponse } from 'next/server';
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, USER_DATA_KEY } from '@/lib/session-cookies';

/**
 * Reached when Express answers 401 for a logged-in request (see lib/api-client.ts).
 * Server Components cannot delete cookies, so this route handler clears the session
 * and sends the user to /login, returning them to the page they were on afterwards.
 */
export function GET(request: NextRequest) {
  const referer = request.headers.get('referer');
  let next = '/';
  if (referer) {
    try {
      const url = new URL(referer);
      if (url.origin === request.nextUrl.origin && !url.pathname.startsWith('/login')) next = url.pathname + url.search;
    } catch {
      // ignore malformed referer
    }
  }

  const loginUrl = new URL('/login', request.url);
  loginUrl.searchParams.set('next', next);
  loginUrl.searchParams.set('expired', '1');

  const response = NextResponse.redirect(loginUrl);
  for (const name of [ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, USER_DATA_KEY]) response.cookies.delete(name);
  return response;
}
