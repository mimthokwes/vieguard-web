import axios, { AxiosError, AxiosRequestConfig } from 'axios';
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
  if (typeof window !== 'undefined') {
    return (
      process.env.NEXT_PUBLIC_API_URL ||
      (process.env.NEXT_PUBLIC_API_HOST ? `${process.env.NEXT_PUBLIC_API_HOST}/api/v0/website` : 'http://localhost:5000/api/v0/website')
    );
  }
  return process.env.API_URL || 'http://localhost:5000/api/v0/website';
}

/** Express wraps payloads as `{ success, message, data }`; unwrap to `data` when present. */
function unwrap<T>(body: unknown): T {
  if (body && typeof body === 'object' && 'data' in body && 'success' in body) {
    return (body as { data: T }).data;
  }
  return body as T;
}

export interface ApiClientOptions extends AxiosRequestConfig {
  token?: string;
  body?: unknown;
  /** Next.js fetch compatibility options */
  cache?: RequestCache;
  next?: { revalidate?: number | false; tags?: string[] };
}

/** Axios instance pre-configured for the backend API */
export const axiosClient = axios.create();

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

const apiMemoryCache = new Map<string, CacheEntry<unknown>>();
const pendingRequests = new Map<string, Promise<unknown>>();

/**
 * Invalidate in-memory cache by endpoint prefix or clear all cache.
 */
export function invalidateApiCache(endpointPrefix?: string) {
  if (!endpointPrefix) {
    apiMemoryCache.clear();
    return;
  }
  for (const key of apiMemoryCache.keys()) {
    if (key.includes(endpointPrefix)) {
      apiMemoryCache.delete(key);
    }
  }
}

/**
 * Base request helper for every call to the Express API using Axios.
 * - unwraps Express `{ success, message, data }` responses
 * - deduplicates identical concurrent requests
 * - caches GET responses in-memory for TTL duration
 * - transforms Axios errors into standardized `ApiError`
 * - a 401 on an authenticated request ends the session and redirects to /login
 */
export async function apiClient<T>(endpoint: string, options: ApiClientOptions = {}): Promise<T> {
  const { token, headers, body, data: explicitData, ...config } = options;

  let requestData = explicitData !== undefined ? explicitData : body;
  if (typeof requestData === 'string') {
    try {
      requestData = JSON.parse(requestData);
    } catch {
      // keep raw string
    }
  }

  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(headers as Record<string, string>),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const baseURL = getApiBaseUrl();
  const url = endpoint.startsWith('http') ? endpoint : `${baseURL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
  const method = ((options.method as AxiosRequestConfig['method']) || 'GET').toUpperCase();
  const isGet = method === 'GET';

  // Invalidate related cache on mutation methods
  if (!isGet) {
    invalidateApiCache(endpoint);
  }

  // Check if eligible for in-memory caching
  const isNoCache =
    options.cache === 'no-store' ||
    options.next?.revalidate === 0 ||
    options.headers?.['Cache-Control'] === 'no-cache' ||
    options.headers?.['cache-control'] === 'no-cache';

  const shouldCache = isGet && !isNoCache;
  const cacheKey = shouldCache
    ? `${token || 'anon'}:${url}:${JSON.stringify(config.params || {})}`
    : null;

  if (cacheKey) {
    // 1. Return fresh cached response if available
    const cached = apiMemoryCache.get(cacheKey);
    if (cached && Date.now() < cached.expiresAt) {
      return cached.data as T;
    }

    // 2. Return in-flight promise if same request is already executing
    const pending = pendingRequests.get(cacheKey);
    if (pending) {
      return pending as Promise<T>;
    }
  }

  let shouldRedirect = false;

  const executeRequest = async (): Promise<T> => {
    try {
      const response = await axiosClient.request<T>({
        url,
        method: method as AxiosRequestConfig['method'],
        data: requestData,
        headers: requestHeaders,
        ...config,
      });

      const unwrappedData = unwrap<T>(response.data);

      if (cacheKey) {
        // Cache TTL: respect options.next?.revalidate or default to 60s
        const ttlSeconds = typeof options.next?.revalidate === 'number' ? options.next.revalidate : 60;
        if (ttlSeconds > 0) {
          apiMemoryCache.set(cacheKey, {
            data: unwrappedData,
            expiresAt: Date.now() + ttlSeconds * 1000,
          });
        }
      }

      return unwrappedData;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosErr = error as AxiosError<any>;
        const status = axiosErr.response?.status ?? 503;
        const resData = axiosErr.response?.data;

        if (status === 401 && token) {
          shouldRedirect = true;
        } else {
          const message =
            resData?.message ||
            resData?.error ||
            (!axiosErr.response || axiosErr.code === 'ERR_NETWORK'
              ? NETWORK_ERROR_MESSAGE
              : axiosErr.message);

          throw new ApiError(message, status, resData?.errors);
        }
      } else {
        throw error;
      }
    } finally {
      if (cacheKey) {
        pendingRequests.delete(cacheKey);
      }
    }

    if (shouldRedirect) {
      if (typeof window !== 'undefined') {
        window.location.href = SESSION_EXPIRED_PATH;
      } else {
        redirect(SESSION_EXPIRED_PATH);
      }
    }

    throw new ApiError('Sesi Anda telah berakhir.', 401);
  };

  const requestPromise = executeRequest();

  if (cacheKey) {
    pendingRequests.set(cacheKey, requestPromise);
  }

  return requestPromise;
}

/** Multipart upload (FormData) using Axios */
export async function apiUpload<T>(endpoint: string, formData: FormData, token: string): Promise<T> {
  const baseURL = getApiBaseUrl();
  const url = endpoint.startsWith('http') ? endpoint : `${baseURL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

  let shouldRedirect = false;

  try {
    const response = await axiosClient.post<T>(url, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });

    return unwrap<T>(response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosErr = error as AxiosError<any>;
      const status = axiosErr.response?.status ?? 503;
      const resData = axiosErr.response?.data;

      if (status === 401) {
        shouldRedirect = true;
      } else {
        const message =
          resData?.message ||
          resData?.error ||
          (!axiosErr.response || axiosErr.code === 'ERR_NETWORK'
            ? NETWORK_ERROR_MESSAGE
            : axiosErr.message);

        throw new ApiError(message, status, resData?.errors);
      }
    } else {
      throw error;
    }
  }

  if (shouldRedirect) {
    if (typeof window !== 'undefined') {
      window.location.href = SESSION_EXPIRED_PATH;
    } else {
      redirect(SESSION_EXPIRED_PATH);
    }
  }

  throw new ApiError('Sesi Anda telah berakhir.', 401);
}
