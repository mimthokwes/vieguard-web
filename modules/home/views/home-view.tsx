import { HeroBanner } from '../components/hero-banner';
import { CategoryGrid } from '../components/category-grid';
import { PromoCards } from '../components/promo-cards';
import { FeaturedPortfolio } from '../components/featured-portfolio';
import { TrustStrip } from '../components/trust-strip';
import { CatalogHighlights } from '../components/catalog-highlights';
import { ConsultationBanner } from '../components/consultation-banner';

export function HomeView({ isLoggedIn = false }: { isLoggedIn?: boolean }) {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 sm:py-8 lg:gap-10 lg:px-8">
      <HeroBanner isLoggedIn={isLoggedIn} />
      <CategoryGrid />
      <PromoCards isLoggedIn={isLoggedIn} />
      <FeaturedPortfolio />
      <TrustStrip />
      <CatalogHighlights />
      <ConsultationBanner />
    </main>
  );
}