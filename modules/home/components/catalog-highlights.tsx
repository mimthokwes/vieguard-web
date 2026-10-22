import { CATALOG_HIGHLIGHTS } from '../data';
import { ProductCard } from './product-card';
import { SectionHeading } from './section-heading';

export function CatalogHighlights() {
  return (
    <section aria-label="Katalog populer" className="flex flex-col gap-5">
      <SectionHeading title="Terbaik Untukmu" href="/catalog" />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        {CATALOG_HIGHLIGHTS.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}