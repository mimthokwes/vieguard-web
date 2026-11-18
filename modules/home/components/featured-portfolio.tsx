import { ShoppingBag } from 'lucide-react';
import { ProductCard } from '@/components/product/product-card';
import { getHomeTrendingProducts } from '../services/home-service';
import { SectionHeading } from './section-heading';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/ui/motion';

export async function FeaturedPortfolio() {
  const products = await getHomeTrendingProducts();

  return (
    <section aria-label="Trending produk" className="flex flex-col gap-5">
      <FadeIn>
        <SectionHeading title="Trending Sekarang" href="/catalog" linkLabel="Lihat semua produk" />
      </FadeIn>
      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-line-strong bg-beige-soft py-16 text-center">
          <ShoppingBag className="size-10 text-primary/30" strokeWidth={1.25} />
          <p className="text-sm text-muted">Belum ada produk yang tersedia saat ini.</p>
        </div>
      ) : (
        <StaggerContainer className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4" staggerDelay={0.06}>
          {products.map((product) => (
            <StaggerItem key={product.id}>
              <ProductCard product={product} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      )}
    </section>
  );
}