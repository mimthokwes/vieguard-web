import { Metadata } from 'next';
import { CatalogView } from '@/modules/catalog/views/catalog-view';
import { getProducts, getCategories } from '@/modules/catalog/services/catalog-service';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Katalog Penyewaan Armada | VIEGUARD',
  description: 'Sewa seragam marching band, topi shako, dan instrumen untuk festival, karnaval, dan acara sekolah. Bersih, steril, siap pakai.',
};

interface PageProps {
  searchParams: Promise<{ search?: string; category?: string }>;
}

export default async function RentalPage({ searchParams }: PageProps) {
  const [{ search, category }, products, categories] = await Promise.all([searchParams, getProducts(), getCategories()]);
  return <CatalogView mode="sewa" products={products} categories={categories} initialQuery={search} initialCategory={category} />;
}
