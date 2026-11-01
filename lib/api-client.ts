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

/**
 * Base request helper for every call to the Express API using Axios.
 * - unwraps Express `{ success, message, data }` responses
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

  let shouldRedirect = false;

  try {
    const response = await axiosClient.request<T>({
      url,
      method: (options.method as AxiosRequestConfig['method']) || 'GET',
      data: requestData,
      headers: requestHeaders,
      ...config,
    });

    return unwrap<T>(response.data);
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
