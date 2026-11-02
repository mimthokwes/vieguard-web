import { Metadata } from 'next';
import { CatalogView } from '@/modules/catalog/views/catalog-view';
import { getProducts, getCategories, smartSearchProducts } from '@/modules/catalog/services/catalog-service';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Katalog Seragam & Perlengkapan | VIEGUARD',
  description: 'Set seragam drum band siap pakai, topi shako, instrumen, dan perlengkapan color guard untuk dibeli atau disewa.',
};

interface PageProps {
  searchParams: Promise<{ search?: string; q?: string; category?: string }>;
}

export default async function CatalogPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const rawQ = (params.q || params.search || '').trim();
  const category = params.category;

  const [categories, smartResult, regularProducts] = await Promise.all([
    getCategories(),
    rawQ ? smartSearchProducts({ q: rawQ, categoryId: category }) : Promise.resolve(null),
    !rawQ ? getProducts({ categoryId: category }) : Promise.resolve([]),
  ]);

  const products = smartResult ? smartResult.products : regularProducts;

  return (
    <CatalogView
      key={`${rawQ}_${category || 'all'}`}
      mode="all"
      products={products}
      categories={categories}
      initialQuery={rawQ}
      initialCategory={category}
      smartResult={smartResult}
    />
  );
}
