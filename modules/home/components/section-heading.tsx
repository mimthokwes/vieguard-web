import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

type Props = { title: string; href?: string; linkLabel?: string };

/** Judul section dengan tautan "lihat semua" di kanan. */
export function SectionHeading({ title, href, linkLabel = 'Lihat semua' }: Props) {
  return (
    <div className="flex items-center justify-between gap-4">
      <h2 className="text-lg font-bold text-ink sm:text-xl">{title}</h2>
      {href && (
        <Link
          href={href}
          className="inline-flex shrink-0 items-center gap-1.5 text-xs font-semibold text-ink-soft hover:text-primary sm:text-sm"
        >
          {linkLabel}
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      )}
    </div>
  );
}