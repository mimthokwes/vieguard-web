import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Calendar, GraduationCap, Package } from 'lucide-react';
import { ImagePlaceholder } from '@/components/ui/image-placeholder';
import { buttonClasses } from '@/components/ui/button';
import { PortfolioProject, categoryLabel } from '../data';

function ProjectImage({ project, className }: { project: PortfolioProject; className: string }) {
  return (
    <div className={`relative overflow-hidden bg-beige-soft ${className}`}>
      {project.image ? (
        <Image src={project.image} alt={project.title} fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover" />
      ) : (
        <ImagePlaceholder label="Foto Proyek" className="size-full rounded-none border-0" />
      )}
      <span
        className={`absolute left-3 top-3 rounded-full px-3 py-1 text-[11px] font-bold ${
          project.category === 'mayoret' ? 'bg-gold-dark text-white' : 'bg-primary text-on-primary'
        }`}
      >
        {categoryLabel(project.category)}
      </span>
      <span className="absolute right-3 top-3 rounded-full bg-surface px-2.5 py-0.5 text-[11px] font-bold text-ink">{project.year}</span>
    </div>
  );
}

/** Full gallery card (Portfolio page). */
export function PortfolioCard({ project }: { project: PortfolioProject }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-2xl bg-surface shadow-card ring-1 ring-line">
      <ProjectImage project={project} className="h-[292px]" />
      <div className="flex flex-1 flex-col p-6">
        <p className="flex items-center gap-1.5 text-xs font-semibold text-primary">
          <GraduationCap className="size-3.5" aria-hidden="true" />
          {project.institution}
        </p>
        <h3 className="truncate pt-2 text-lg font-bold text-ink" title={project.title}>
          {project.title}
        </h3>
        <ul className="flex flex-wrap gap-2 pt-4">
          {project.materials.map((m) => (
            <li key={m} className="rounded-md bg-beige-soft px-2.5 py-1 text-xs font-medium text-ink-soft">
              {m}
            </li>
          ))}
        </ul>
        <div className="mt-auto">
          <div className="mt-3 flex items-center justify-between border-t border-line pt-3 text-[13px] text-ink-soft">
            <span className="flex items-center gap-1.5">
              <Package className="size-3.5 text-muted" aria-hidden="true" /> Jumlah: {project.quantity} Stel
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="size-3.5 text-muted" aria-hidden="true" /> Tahun: {project.year}
            </span>
          </div>
          <Link
            href={`/chat?topic=${encodeURIComponent(`Portofolio: ${project.title}`)}`}
            className={buttonClasses({ variant: 'soft', fullWidth: true, className: 'mt-4 border-0' })}
          >
            Lihat Detail Proyek <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}

/** Compact card for the landing page preview. */
export function PortfolioCardCompact({ project }: { project: PortfolioProject }) {
  return (
    <article className="flex flex-col rounded-[14px] border border-line bg-surface p-4 shadow-soft">
      <ProjectImage project={project} className="h-40 rounded-[10px]" />
      <div className="pt-2.5">
        <h3 className="truncate text-sm font-bold text-ink" title={project.title}>
          {project.title}
        </h3>
        <p className="pt-0.5 text-xs text-muted">{project.institution}</p>
      </div>
      <div className="flex items-center justify-between gap-2 pt-4 text-xs text-ink-soft">
        <span className="rounded-md border border-beige bg-beige-soft px-2 py-0.5 font-bold text-primary">{project.year}</span>
        <span>{project.quantity} Stel</span>
      </div>
    </article>
  );
}
