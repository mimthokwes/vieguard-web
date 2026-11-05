import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { ForgotPasswordView } from '@/modules/auth/views/forgot-password-view';
import { getSessionUser } from '@/lib/session';

export const metadata: Metadata = {
  title: 'Lupa Kata Sandi | VIEGUARD',
  description: 'Atur ulang kata sandi akun VIEGUARD Anda dengan kode verifikasi OTP yang dikirimkan ke email.',
};

export default async function ForgotPasswordPage() {
  if (await getSessionUser()) {
    redirect('/');
  }

  return <ForgotPasswordView />;
}
