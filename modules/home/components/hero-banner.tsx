import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ButtonLink } from '@/components/ui/button';
import hero from '@/public/hero-section.png';
import { HERO_FEATURES } from '../data';

type Props = { isLoggedIn?: boolean };

export function HeroBanner({ isLoggedIn = false }: Props) {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[100dvh] w-full items-center overflow-hidden pt-28 pb-16 sm:pt-32 sm:pb-20 lg:pt-36 lg:pb-24"
    >
      {/* Gambar sebagai latar penuh satu layar */}
      <Image
        src={hero}
        alt="Kostum Marching Band Vieguard"
        fill
        priority
        placeholder="blur"
        sizes="100vw"
        className="-z-20 object-cover object-center"
      />

      <div className="mx-auto flex w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex max-w-2xl flex-col items-start gap-4 rounded-3xl bg-black/45 backdrop-blur-md p-6 sm:p-8 border border-white/15 shadow-2xl">
          <p className="text-xs font-bold tracking-wide text-gold [text-shadow:_0_1px_3px_rgba(0,0,0,0.8)]">Wujudkan. Tampil. Juara.</p>
          <h1
            id="hero-title"
            className="text-3xl font-extrabold leading-tight tracking-tight text-white [text-shadow:_0_2px_8px_rgba(0,0,0,0.7)] sm:text-4xl lg:text-5xl"
          >
            <span className="text-gold">Kostum Terbaik</span>
            <br />
            Untuk Setiap Acara
          </h1>
          <p className="max-w-md text-sm text-white sm:text-base leading-relaxed [text-shadow:_0_1px_4px_rgba(0,0,0,0.8)]">
            Spesialis jahit seragam marching band, pre-order custom desain mandiri, dan sewa kostum berkualitas untuk segala acara.
          </p>
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-1">
            <ButtonLink href={isLoggedIn ? '/order' : '/login'} variant="gold" className="shadow-lg">
              {isLoggedIn ? 'Mulai Pesan' : 'Pesan Sekarang'}
            </ButtonLink>
            <Link
              href="/catalog"
              className="group inline-flex items-center gap-1.5 text-sm sm:text-base font-bold text-white hover:text-gold transition-colors [text-shadow:_0_1px_4px_rgba(0,0,0,0.8)]"
            >
              Lihat Kostum
              <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          </div>
          <ul className="flex flex-wrap gap-x-5 gap-y-2 pt-2">
            {HERO_FEATURES.map(({ icon: Icon, label }) => (
              <li
                key={label}
                className="flex items-center gap-1.5 text-xs font-semibold text-white [text-shadow:_0_1px_3px_rgba(0,0,0,0.8)]"
              >
                <Icon className="size-4 text-gold drop-shadow-xs" aria-hidden="true" />
                {label}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
