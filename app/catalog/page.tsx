import { Metadata } from 'next';
import { CatalogView } from '@/modules/catalog/views/catalog-view';
import { getProducts } from '@/lib/api/product-api';
import { getCategories } from '@/lib/api/category-api';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Katalog Seragam & Perlengkapan | VIEGUARD',
  description: 'Set seragam drum band siap pakai, topi shako, instrumen, dan perlengkapan color guard untuk dibeli atau disewa.',
};

interface PageProps {
  searchParams: Promise<{ search?: string; category?: string }>;
}

export default async function CatalogPage({ searchParams }: PageProps) {
  const [{ search, category }, products, categories] = await Promise.all([searchParams, getProducts(), getCategories()]);
  return <CatalogView mode="all" products={products} categories={categories} initialQuery={search} initialCategory={category} />;
}
