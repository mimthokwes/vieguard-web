import "server-only";
import { apiClient } from '@/lib/api-client';
import { AuthResponse } from '@/types/user';

export async function loginUser(email: string, password: string): Promise<AuthResponse> {
  const data = await apiClient<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  return data;
}

export async function registerUser(payload: {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
}): Promise<AuthResponse> {
  const data = await apiClient<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return data;
}
