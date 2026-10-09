import { Metadata } from 'next';
import { ProductDetailView } from '@/modules/product-detail/views/product-detail-view';
import { getProductById, getProducts } from '@/lib/api/product-api';

// Render strategy: SSR (Data detail sewa/stok dinamis yang selalu diperbarui per request)
export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const product = await getProductById(id);
    return {
      title: `${product.name} | VIEGUARD Atelier & Rental`,
      description: product.description.substring(0, 160),
    };
  } catch {
    return {
      title: 'Detail Produk | VIEGUARD Atelier',
    };
  }
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params;
  const product = await getProductById(id);
  const allProducts = await getProducts();
  const related = allProducts.filter((p) => String(p.id) !== id);

  return <ProductDetailView product={product} relatedProducts={related} />;
}
