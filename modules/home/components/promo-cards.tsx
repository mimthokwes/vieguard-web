import Link from 'next/link';
import { ArrowRight, ClipboardList, Sparkles, Store } from 'lucide-react';

type Props = { isLoggedIn?: boolean };

export function PromoCards({ isLoggedIn = false }: Props) {
  return (
    <section aria-label="Penawaran" className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <PromoCard
        tone="light"
        eyebrow="Pesanan sekolah"
        title="Pesan massal"
        description="Formulir pemesanan untuk seluruh siswa atau anggota band."
        cta={isLoggedIn ? 'Mulai pesan' : 'Masuk untuk memesan'}
        href={isLoggedIn ? '/order' : '/login'}
        icon={ClipboardList}
      />
      <PromoCard
        tone="light"
        eyebrow="Siap pakai"
        title="Katalog & sewa"
        description="Seragam, topi shako, bendera, dan sepatu parade."
        cta="Lihat katalog"
        href="/catalog"
        icon={Store}
      />
      <PromoCard
        tone="dark"
        eyebrow="Konsultasi"
        title="Desain khusus"
        description="Bordir lambang dan model sesuai identitas sekolah."
        cta="Lihat portofolio"
        href="/portfolio"
        icon={Sparkles}
      />
    </section>
  );
}

type PromoCardProps = {
  tone: 'light' | 'dark';
  eyebrow: string;
  title: string;
  description: string;
  cta: string;
  href: string;
  icon: React.ElementType;
};

function PromoCard({ tone, eyebrow, title, description, cta, href, icon: Icon }: PromoCardProps) {
  const dark = tone === 'dark';
  return (
    <article
      className={`relative flex min-h-40 flex-col justify-between overflow-hidden rounded-2xl border p-5 ${
        dark ? 'border-ink bg-ink text-white' : 'border-beige bg-beige-soft text-ink'
      }`}
    >
      <Icon
        className={`absolute -right-3 -top-3 size-28 ${dark ? 'text-gold-dark/30' : 'text-primary/10'}`}
        aria-hidden="true"
        strokeWidth={1}
      />
      <div className="relative flex max-w-[75%] flex-col gap-1">
        <p className={`text-xs font-semibold ${dark ? 'text-gold-dark' : 'text-primary'}`}>{eyebrow}</p>
        <h3 className="text-xl font-extrabold">{title}</h3>
        <p className={`text-xs ${dark ? 'text-white/70' : 'text-ink-soft'}`}>{description}</p>
      </div>
      <Link href={href} className="relative mt-4 inline-flex items-center gap-1.5 text-sm font-bold hover:underline">
        {cta}
        <ArrowRight className="size-4" aria-hidden="true" />
      </Link>
    </article>
  );
}