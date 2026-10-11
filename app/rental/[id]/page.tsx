import { Metadata } from 'next';
import { ProductDetailView } from '@/modules/product-detail/views/product-detail-view';
import { getProductById } from '@/lib/api/product-api';
import { getSessionUser } from '@/lib/session';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ date?: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const product = await getProductById(id);
    return { title: `Sewa ${product.name} | VIEGUARD`, description: product.description?.slice(0, 160) };
  } catch {
    return { title: 'Detail Armada Sewa | VIEGUARD' };
  }
}

export default async function RentalDetailPage({ params, searchParams }: PageProps) {
  const [{ id }, { date }] = await Promise.all([params, searchParams]);
  const [product, user] = await Promise.all([getProductById(id), getSessionUser()]);
  return <ProductDetailView product={product} mode="sewa" initialDate={date} isLoggedIn={!!user} currentPath={`/rental/${id}`} />;
}
