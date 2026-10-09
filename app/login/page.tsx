import { Metadata } from 'next';
import { LoginView } from '@/modules/auth/views/login-view';

// Render strategy: SSG (Form statis yang tidak memerlukan fetch data awal dinamis)
export const metadata: Metadata = {
  title: 'Masuk ke Akun Klien | VIEGUARD Boutique & Rental',
  description: 'Akses portal klien privat VIEGUARD untuk reservasi gaun & jas desainer premium serta konsultasi fitting eksklusif.',
};

export default function LoginPage() {
  return <LoginView />;
}
