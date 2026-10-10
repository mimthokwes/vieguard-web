import { Metadata } from 'next';
import { HomeView } from '@/modules/home/views/home-view';
import { getSessionUser } from '@/lib/session';

export const metadata: Metadata = {
  title: 'VIEGUARD | Penjahitan Seragam Drum Band & Penyewaan Perlengkapan',
  description:
    'Penjahitan seragam profesional untuk TK, SD, SMP, SMA, marching band, dan penyewaan perlengkapan acara. Konsultasi desain khusus dan pesanan massal sekolah.',
};

export default async function HomePage() {
  const user = await getSessionUser();
  return <HomeView isLoggedIn={!!user} />;
}
