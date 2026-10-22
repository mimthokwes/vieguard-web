import Link from 'next/link';
import { CATEGORIES } from '../data';
import { SectionHeading } from './section-heading';

export function CategoryGrid() {
  return (
    <section aria-label="Kategori" className="flex flex-col gap-5">
      <SectionHeading title="Belanja per kategori" href="/catalog" linkLabel="Lihat semua kategori" />
      <ul className="grid grid-cols-4 gap-x-2 gap-y-5 lg:grid-cols-8">
        {CATEGORIES.map(({ label, href, icon: Icon }) => (
          <li key={label}>
            <Link href={href} className="group flex flex-col items-center gap-2.5 text-center">
              <span className="flex size-16 items-center justify-center rounded-full border border-line-strong bg-beige-soft transition-colors group-hover:border-primary sm:size-20">
                <Icon className="size-7 text-primary sm:size-8" aria-hidden="true" />
              </span>
              <span className="text-xs font-medium text-ink-soft group-hover:text-ink">{label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}