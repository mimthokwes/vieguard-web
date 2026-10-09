import "server-only";

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

const getBaseUrl = (): string => {
  return process.env.API_URL || 'http://localhost:5000/api/v0/website';
};

interface FetchOptions extends RequestInit {
  token?: string;
}

export async function apiClient<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const baseUrl = getBaseUrl();
  const url = endpoint.startsWith('http') ? endpoint : `${baseUrl}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (options.token) {
    headers['Authorization'] = `Bearer ${options.token}`;
  }

  try {
    const res = await fetch(url, {
      ...options,
      headers,
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      const errorMessage = data?.message || data?.error || `HTTP error ${res.status}`;
      throw new ApiError(errorMessage, res.status, data?.errors);
    }

    // Backend Express returns { success: true, message: string, data: T }
    if (data && typeof data === 'object' && 'data' in data && data.success !== undefined) {
      return data.data as T;
    }

    return data as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    // Network failure / server offline
    console.error(`[apiClient Error] Fetch to ${url} failed:`, error);
    throw new ApiError(
      (error as Error).message || 'Gagal terhubung ke server backend Express.',
      500
    );
  }
}
