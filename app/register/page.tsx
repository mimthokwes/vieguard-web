import { Metadata } from 'next';
import { RegisterView } from '@/modules/auth/views/register-view';

// Render strategy: SSG (Halaman registrasi statis)
export const metadata: Metadata = {
  title: 'Daftar Akun Baru | VIEGUARD Boutique & Rental',
  description: 'Daftarkan diri Anda di portal privat VIEGUARD untuk reservasi gaun & jas premium dengan kemudahan fitting dan garansi pas ukuran.',
};

export default function RegisterPage() {
  return <RegisterView />;
}
