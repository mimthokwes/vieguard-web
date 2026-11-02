import { Metadata } from 'next';
import { ProductDetailView } from '@/modules/product-detail/views/product-detail-view';
import { getProductById } from '@/modules/catalog/services/catalog-service';
import { getSessionUser } from '@/lib/session';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const product = await getProductById(id);
    return {
      title: `Pesan ${product.name} (Pre-Order) | VIEGUARD`,
      description: product.description?.slice(0, 160) || 'Pemesanan seragam dan kostum dengan skema pre-order.',
    };
  } catch {
    return { title: 'Detail Produk Pembelian | VIEGUARD' };
  }
}

export default async function OrderDetailPage({ params }: PageProps) {
  const { id } = await params;
  const [product, user] = await Promise.all([getProductById(id), getSessionUser()]);
  return (
    <ProductDetailView
      product={product}
      mode="beli"
      isLoggedIn={!!user}
      currentPath={`/order/${id}`}
    />
  );
}
