import { HeroBanner } from '../components/hero-banner';
import { CategoryGrid } from '../components/category-grid';
import { PromoCards } from '../components/promo-cards';
import { FeaturedPortfolio } from '../components/featured-portfolio';
import { FeatureHighlights } from '../components/feature-highlights';
import { CatalogHighlights } from '../components/catalog-highlights';
import { ConsultationBanner } from '../components/consultation-banner';

export async function HomeView({ isLoggedIn = false }: { isLoggedIn?: boolean }) {
  return (
    <main className="flex w-full flex-col">
      <HeroBanner isLoggedIn={isLoggedIn} />
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 py-8 px-4 sm:px-6 lg:gap-12 lg:px-8">
        <CategoryGrid />
        <PromoCards isLoggedIn={isLoggedIn} />
        <FeaturedPortfolio />
        <FeatureHighlights />
        <CatalogHighlights />
        <ConsultationBanner />
      </div>
    </main>
  );
}
