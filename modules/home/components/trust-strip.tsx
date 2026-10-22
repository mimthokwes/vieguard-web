import { TRUST_ITEMS } from '../data';

export function TrustStrip() {
  return (
    <section aria-label="Keunggulan" className="rounded-xl border border-beige bg-beige-soft px-5 py-4">
      <ul className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {TRUST_ITEMS.map(({ icon: Icon, title, description }) => (
          <li key={title} className="flex items-center gap-3">
            <Icon className="size-7 shrink-0 text-primary" aria-hidden="true" strokeWidth={1.5} />
            <div>
              <p className="text-sm font-bold text-ink">{title}</p>
              <p className="text-xs text-muted">{description}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}