import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { ButtonLink } from '@/components/ui/button';
import hero from '@/public/hero-section.png';
import { HERO_FEATURES } from '../data';

type Props = { isLoggedIn?: boolean };

export function HeroBanner({ isLoggedIn = false }: Props) {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-105 items-center overflow-hidden rounded-2xl border border-beige sm:min-h-115 lg:min-h-125"
    >
      {/* Gambar sebagai latar penuh */}
      <Image
        src={hero}
        alt=""
        fill
        priority
        placeholder="blur"
        sizes="(min-width: 1280px) 1216px, 100vw"
        className="-z-20 object-cover"
      />

      {/* Lapisan gelap agar teks tetap terbaca: rata di mobile, gradasi kiri-ke-kanan di layar lebar */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-black/55 md:bg-transparent md:bg-linear-to-r md:from-black/75 md:via-black/45 md:to-transparent"
      />

      <div className="flex w-full max-w-2xl flex-col items-start gap-4 px-6 py-10 sm:px-10 sm:py-14">
        <p className="text-xs font-bold tracking-wide text-gold">Menarik. Cepat. Juara.</p>
        <h1 id="hero-title" className="text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
          <span className='text-gold'>Costum Terbaik</span>
          <br />
          Untuk Setiap Acara 
        </h1>
        <p className="max-w-md text-sm text-white/85 sm:text-base">
          Penjahitan seragam costum sekolah, marching band, dan penyewaan perlengkapan acara, dengan konsultasi desain khusus.
        </p>
        <ButtonLink href={isLoggedIn ? '/order' : '/login'} variant="gold">
          {isLoggedIn ? 'Mulai pesan' : 'Pesan sekarang'}
          <ArrowRight className="size-4" aria-hidden="true" />
        </ButtonLink>
        <ul className="flex flex-wrap gap-x-5 gap-y-2 pt-2">
          {HERO_FEATURES.map(({ icon: Icon, label }) => (
            <li key={label} className="flex items-center gap-1.5 text-xs font-semibold text-white/90">
              <Icon className="size-4 text-gold" aria-hidden="true" />
              {label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}