import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { AuthView } from '@/modules/auth/views/auth-view';
import { getSessionUser } from '@/lib/session';

export const metadata: Metadata = {
  title: 'Daftar Akun Baru | VIEGUARD',
  description: 'Daftarkan akun pelanggan VIEGUARD untuk pemesanan seragam sekolah dan penyewaan perlengkapan drum band.',
};

export default async function RegisterPage() {
  if (await getSessionUser()) redirect('/');
  return <AuthView mode="register" />;
}
