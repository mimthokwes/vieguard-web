import { Metadata } from 'next';
import { PortfolioView } from '@/modules/portfolio/views/portfolio-view';

export const metadata: Metadata = {
  title: 'Galeri Portofolio | VIEGUARD',
  description: 'Dokumentasi hasil produksi seragam korps drumband, marching band sekolah, dan almamater oleh VIEGUARD.',
};

export default function PortfolioPage() {
  return <PortfolioView />;
}
