import { apiClient } from '@/lib/api-client';
import { getSessionToken, getSessionUser, updateSessionUser } from '@/lib/session';
import { User } from '@/types/user';

/**
 * Service to fetch and update user profile information.
 */
export async function getProfile(): Promise<User | null> {
  const token = await getSessionToken();
  if (!token) return null;

  try {
    return await apiClient<User>('/users/me', { token });
  } catch (error) {
    console.error('[getProfile Error]:', error);
    return null;
  }
}

export async function updateProfile(patch: { name?: string; phone?: string; address?: string }): Promise<User> {
  const token = await getSessionToken();
  if (!token) throw new Error('Sesi berakhir. Silakan masuk kembali.');

  const updated = await apiClient<User>('/users/me', {
    method: 'PUT',
    body: JSON.stringify(patch),
    token,
  });

  const current = await getSessionUser();
  await updateSessionUser({ ...(current ?? {}), ...updated } as User);

  return updated;
}
