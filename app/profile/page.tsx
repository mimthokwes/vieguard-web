import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/session';
import { getProfile } from '@/modules/profile/services/profile-service';
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
  try {
    const live = await getProfile();
    if (live) user = { ...sessionUser, ...live };
  } catch {
    // keep session copy
  }
  return <ProfileView user={user} />;
}
