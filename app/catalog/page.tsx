import { Metadata } from 'next';
import { CatalogView } from '@/modules/catalog/views/catalog-view';
import { getProducts } from '@/lib/api/product-api';

// Render strategy: SSR (Membaca searchParams pencarian dan filter secara dinamis per request)
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Katalog Koleksi Busana | VIEGUARD Boutique & Rental',
  description: 'Jelajahi pilihan lengkap gaun pesta desainer, beskap tradisional, batik tulis sutra, dan jas premium untuk disewa atau dibeli.',
};

interface CatalogPageProps {
  searchParams: Promise<{
    category?: string;
    search?: string;
    minPrice?: string;
    maxPrice?: string;
  }>;
}

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const query = await searchParams;
  const products = await getProducts({
    categoryId: query.category,
    search: query.search,
    minPrice: query.minPrice,
    maxPrice: query.maxPrice,
  });

  return <CatalogView products={products} />;
}
