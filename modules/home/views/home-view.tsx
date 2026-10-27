import { HeroBanner } from '../components/hero-banner';
import { CategoryGrid } from '../components/category-grid';
import { PromoCards } from '../components/promo-cards';
import { FeaturedPortfolio } from '../components/featured-portfolio';
import { FeatureHighlights } from '../components/feature-highlights';
import { CatalogHighlights } from '../components/catalog-highlights';
import { ConsultationBanner } from '../components/consultation-banner';

export async function HomeView({ isLoggedIn = false }: { isLoggedIn?: boolean }) {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-2 py-4 px-2 sm:px-1 sm:py-2 lg:gap-10 lg:px-4">
      <HeroBanner isLoggedIn={isLoggedIn} />
      <CategoryGrid />
      <PromoCards isLoggedIn={isLoggedIn} />
      <FeaturedPortfolio />
      <FeatureHighlights />
      <CatalogHighlights />
      <ConsultationBanner />
    </main>
  );
}

