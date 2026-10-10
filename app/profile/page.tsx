import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getSessionToken, getSessionUser } from '@/lib/session';
import { apiClient } from '@/lib/api-client';
import { User } from '@/types/user';
import { ProfileView } from '@/modules/profile/views/profile-view';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Profil & Ukuran Tersimpan | VIEGUARD',
  description: 'Kelola data kontak, alamat pengiriman, dan berkas ukuran siswa.',
};

export default async function ProfilePage() {
  const sessionUser = await getSessionUser();
  if (!sessionUser) redirect('/login?next=/profile');

  // Prefer the live profile; fall back to the session copy if the API is unreachable.
  let user: User = sessionUser;
  const token = await getSessionToken();
  if (token) {
    try {
      user = { ...sessionUser, ...(await apiClient<User>('/users/me', { token, cache: 'no-store' })) };
    } catch {
      // keep session copy
    }
  }
  return <ProfileView user={user} />;
}
