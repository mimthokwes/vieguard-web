import { Metadata } from 'next';
import { CatalogView } from '@/modules/catalog/views/catalog-view';
import { getProducts, getCategories } from '@/modules/catalog/services/catalog-service';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Pembelian Seragam & Perlengkapan (Pre-Order) | VIEGUARD',
  description: 'Pesan model seragam marching band, drum band, dan busana institusi dengan skema pre-order berkualitas tinggi.',
};

interface PageProps {
  searchParams: Promise<{ search?: string; category?: string }>;
}

export default async function OrderPage({ searchParams }: PageProps) {
  const [{ search, category }, products, categories] = await Promise.all([
    searchParams,
    getProducts({ type: 'beli' }),
    getCategories(),
  ]);

  return (
    <CatalogView
      mode="beli"
      products={products}
      categories={categories}
      initialQuery={search}
      initialCategory={category}
    />
  );
}
