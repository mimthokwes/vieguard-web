import axios from 'axios';
import { axiosClient, getApiBaseUrl, ApiError } from '@/lib/api-client';
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from '@/lib/session-cookies';
import { AuthResponse, User } from '@/types/user';

function getCookieFromHeaders(headers: Record<string, any>, name: string): string | undefined {
  const setCookie = headers['set-cookie'];
  const all: string[] = Array.isArray(setCookie) ? setCookie : typeof setCookie === 'string' ? [setCookie] : [];
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

/**
 * Login/register return `{ user }` in the JSON body, and access/refresh
 * tokens as Set-Cookie headers.
 */
async function authRequest(endpoint: string, payload: unknown): Promise<AuthResponse> {
  const url = `${getApiBaseUrl()}${endpoint}`;
  try {
    const res = await axiosClient.post(url, payload, {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    });

    const body = res.data;
    const user: User | undefined = body?.data?.user;
    const accessToken = getCookieFromHeaders(res.headers, ACCESS_TOKEN_KEY) ?? body?.data?.accessToken;
    const refreshToken = getCookieFromHeaders(res.headers, REFRESH_TOKEN_KEY) ?? body?.data?.refreshToken;

    if (!user) {
      throw new ApiError('Respons server tidak berisi data pengguna.', 500);
    }

    return { user, accessToken, refreshToken };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status ?? 503;
      const resData = error.response?.data;
      const message =
        resData?.message ||
        resData?.error ||
        (!error.response || error.code === 'ERR_NETWORK'
          ? 'Server backend tidak dapat dihubungi. Pastikan backend VIEGUARD sedang berjalan.'
          : error.message);
      throw new ApiError(message, status, resData?.errors);
    }
    throw error;
  }
}

export function loginUser(email: string, password: string): Promise<AuthResponse> {
  return authRequest('/auth/login', { email, password });
}

export function registerUser(payload: {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
}): Promise<AuthResponse> {
  return authRequest('/auth/register', payload);
}

export function loginWithGoogle(credential: string): Promise<AuthResponse> {
  return authRequest('/auth/google', { credential });
}

/** Revokes the refresh token on the backend (best effort). */
export async function logoutUser(refreshToken?: string): Promise<void> {
  if (!refreshToken) return;
  try {
    await axiosClient.post(
      `${getApiBaseUrl()}/auth/logout`,
      {},
      {
        headers: {
          Cookie: `${REFRESH_TOKEN_KEY}=${encodeURIComponent(refreshToken)}`,
        },
      }
    );
  } catch {
    // Local session is cleared regardless.
  }
}

async function postAuthJson<T = any>(endpoint: string, payload: unknown): Promise<{ message: string; data?: T }> {
  const url = `${getApiBaseUrl()}${endpoint}`;
  try {
    const res = await axiosClient.post(url, payload, {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    });
    return {
      message: res.data?.message || 'Berhasil',
      data: res.data?.data,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status ?? 503;
      const resData = error.response?.data;
      const message =
        resData?.message ||
        resData?.error ||
        (!error.response || error.code === 'ERR_NETWORK'
          ? 'Server backend tidak dapat dihubungi. Pastikan backend VIEGUARD sedang berjalan.'
          : error.message);
      throw new ApiError(message, status, resData?.errors);
    }
    throw error;
  }
}

export function requestPasswordResetOtp(email: string): Promise<{ message: string }> {
  return postAuthJson('/auth/forgot-password', { email });
}

export function verifyPasswordResetOtp(email: string, otpCode: string): Promise<{ message: string; data?: { valid?: boolean } }> {
  return postAuthJson<{ valid?: boolean }>('/auth/verify-otp', { email, otpCode });
}

export function resetPasswordWithOtp(payload: {
  email: string;
  otpCode: string;
  newPassword: string;
}): Promise<{ message: string }> {
  return postAuthJson('/auth/reset-password', payload);
}
