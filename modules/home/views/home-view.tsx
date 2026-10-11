import React from 'react';
import { Product } from '@/types/product';
import { HeroSection } from '../components/hero-section';
import { CategoriesSection } from '../components/categories-section';
import { PromoBannersSection } from '../components/promo-banners-section';
import { StylistPicksSection } from '../components/stylist-picks-section';
import { ValuePropsSection } from '../components/value-props-section';
import { RecommendedSection } from '../components/recommended-section';
import { NewsletterSection } from '../components/newsletter-section';

export function HomeView({ initialProducts = [] }: { initialProducts?: Product[] }) {
  // First 5 for stylist picks, next 5 for recommendations.
  // Fallback: if there are not enough products, reuse the first 5 so the row is never empty.
  const stylistPicks = initialProducts.slice(0, 5);
  const recommended =
    initialProducts.length > 5 ? initialProducts.slice(5, 10) : stylistPicks;

  return (
    <main className="w-full min-h-screen bg-main">
      <HeroSection />
      <CategoriesSection />
      <PromoBannersSection />
      <StylistPicksSection products={stylistPicks} />
      <ValuePropsSection />
      <RecommendedSection products={recommended} />
      <NewsletterSection />
    </main>
  );
}