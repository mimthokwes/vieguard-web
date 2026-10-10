import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { AuthView } from '@/modules/auth/views/auth-view';
import { getSessionUser } from '@/lib/session';

export const metadata: Metadata = {
  title: 'Masuk | VIEGUARD',
  description: 'Masuk ke portal pelanggan VIEGUARD untuk memesan seragam, menyewa perlengkapan, dan melacak pesanan.',
};

interface LoginPageProps {
  searchParams: Promise<{ next?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  if (await getSessionUser()) redirect('/');
  const { next } = await searchParams;
  return <AuthView mode="login" next={next} />;
}
