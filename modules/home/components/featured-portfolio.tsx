import { PortfolioCardCompact } from '@/modules/portfolio/components/portfolio-card';
import { PORTFOLIO_PROJECTS } from '@/modules/portfolio/data';
import { SectionHeading } from './section-heading';

const PREVIEW_PROJECTS = PORTFOLIO_PROJECTS.slice(0, 4);

export function FeaturedPortfolio() {
  return (
    <section aria-label="Portofolio" className="flex flex-col gap-5">
      <SectionHeading title="Trending Sekarang" href="/portfolio" linkLabel="Lihat semua proyek" />
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {PREVIEW_PROJECTS.map((project) => (
          <PortfolioCardCompact key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
}