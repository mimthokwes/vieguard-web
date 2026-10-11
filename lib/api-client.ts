import 'server-only';
import { redirect } from 'next/navigation';

export class ApiError extends Error {
  status: number;
  errors?: Record<string, string[]>;

  constructor(message: string, status: number, errors?: Record<string, string[]>) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
  }
}

/** Route handler that clears the session cookies and sends the user to /login. */
export const SESSION_EXPIRED_PATH = '/session-expired';

const NETWORK_ERROR_MESSAGE = 'Server backend tidak dapat dihubungi. Pastikan backend VIEGUARD sedang berjalan.';

export function getApiBaseUrl(): string {
  return process.env.API_URL || 'http://localhost:5000/api/v0/website';
}

function buildUrl(endpoint: string) {
  return endpoint.startsWith('http') ? endpoint : `${getApiBaseUrl()}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
}

interface FetchOptions extends RequestInit {
  token?: string;
}

/** Express wraps payloads as `{ success, message, data }`; unwrap to `data` when present. */
function unwrap<T>(body: unknown): T {
  if (body && typeof body === 'object' && 'data' in body && 'success' in body) {
    return (body as { data: T }).data;
  }
  return body as T;
}

async function send(url: string, init: RequestInit): Promise<Response> {
  try {
    return await fetch(url, init);
  } catch (error) {
    console.error(`[apiClient] ${init.method ?? 'GET'} ${url} failed:`, (error as Error).message);
    throw new ApiError(NETWORK_ERROR_MESSAGE, 503);
  }
}

/**
 * Base request helper for every call to the Express API (server only).
 * - always checks `res.ok` and turns Express `{ message, errors }` into an ApiError
 * - a 401 on an authenticated request ends the session and redirects to /login
 */
export async function apiClient<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { token, headers, ...init } = options;
  const res = await send(buildUrl(endpoint), {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(headers as Record<string, string>),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  const body = await res.json().catch(() => null);

  // redirect() throws a control-flow error, so it must stay outside any try/catch.
  if (res.status === 401 && token) redirect(SESSION_EXPIRED_PATH);

  if (!res.ok) {
    throw new ApiError(body?.message || body?.error || `HTTP error ${res.status}`, res.status, body?.errors);
  }
  return unwrap<T>(body);
}

/** Multipart upload (FormData); lets fetch set the multipart boundary header. */
export async function apiUpload<T>(endpoint: string, formData: FormData, token: string): Promise<T> {
  const res = await send(buildUrl(endpoint), { method: 'POST', body: formData, headers: { Authorization: `Bearer ${token}` } });
  const body = await res.json().catch(() => null);
  if (res.status === 401) redirect(SESSION_EXPIRED_PATH);
  if (!res.ok) throw new ApiError(body?.message || `HTTP error ${res.status}`, res.status, body?.errors);
  return unwrap<T>(body);
}
