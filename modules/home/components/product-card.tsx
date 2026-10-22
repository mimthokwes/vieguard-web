import Link from 'next/link';
import type { HomeProduct } from '../data';

export function ProductCard({ product }: { product: HomeProduct }) {
  const { name, category, price, rentPrice, href, icon: Icon } = product;
  return (
    <Link
      href={href}
      className="group flex flex-col overflow-hidden rounded-xl border border-line-strong bg-white transition-shadow hover:shadow-md"
    >
      {/* Ganti dengan <Image> jika produk punya foto */}
      <div className="flex aspect-[4/3] items-center justify-center bg-beige-soft">
        <Icon className="size-12 text-primary/40" aria-hidden="true" strokeWidth={1.25} />
      </div>
      <div className="flex flex-col gap-1 p-3">
        <h3 className="text-sm font-bold text-ink group-hover:text-primary">{name}</h3>
        <p className="text-xs text-muted">{category}</p>
        <p className="pt-1 text-sm font-extrabold text-ink">{price}</p>
        {rentPrice && <p className="text-xs text-ink-soft">Sewa {rentPrice}</p>}
      </div>
    </Link>
  );
}