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
  return (
    <main className="w-full min-h-screen bg-main">
      <HeroSection />
      <CategoriesSection />
      <PromoBannersSection />
      <StylistPicksSection products={initialProducts} />
      <ValuePropsSection />
      <RecommendedSection products={initialProducts} />
      <NewsletterSection />
    </main>
  );
}
