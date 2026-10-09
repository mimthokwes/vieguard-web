import { Metadata } from 'next';
import { HomeView } from '@/modules/home/views/home-view';
import { getProducts } from '@/lib/api/product-api';

// Render strategy: ISR (Revalidate setiap 60 detik agar beranda tetap cepat dan hemat resource)
export const revalidate = 60;

export const metadata: Metadata = {
  title: 'VIEGUARD | Boutique & Rental Busana Desainer Premium',
  description: 'Destinasi terpercaya kurasi busana desainer dan platform rental gaun & jas premium di Indonesia. Elegan, higienis, dan memudahkan setiap momen berharga Anda.',
};

export default async function HomePage() {
  const products = await getProducts();
  return <HomeView initialProducts={products} />;
}
