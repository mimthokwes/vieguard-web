import { CalendarClock, Headset, Package, Ruler, ShieldCheck, Truck, type LucideIcon } from 'lucide-react';

export type HomeCategory = { label: string; href: string; image: string };
export type HomeFeature = { label: string; icon: LucideIcon };
export type HomeTrustItem = { title: string; description: string; icon: LucideIcon };

export const HERO_FEATURES: HomeFeature[] = [
  { icon: Ruler, label: 'Ukuran presisi' },
  { icon: Truck, label: 'Pengiriman massal' },
  { icon: CalendarClock, label: 'Sewa terjadwal' },
];

export const CATEGORIES: HomeCategory[] = [
  { label: 'Kostum sekolah', href: '/catalog?kategori=sekolah', image: '/categories/kostum-sekolah.webp' },
  { label: 'Marching band', href: '/catalog?kategori=marching-band', image: '/categories/marching-band.webp' },
  { label: 'Color guard', href: '/catalog?kategori=color-guard', image: '/categories/color-guard.webp' },
  { label: 'Aksesoris', href: '/catalog?kategori=aksesoris', image: '/categories/aksesoris.webp' },
  { label: 'Kostum karnaval', href: '/catalog?kategori=karnaval', image: '/categories/kostum-karnaval.webp' },
  { label: 'Baju adat', href: '/catalog?kategori=baju-adat', image: '/categories/baju-adat.webp' },
  { label: 'Kostum tari', href: '/catalog?kategori=tari', image: '/categories/kostum-tari.webp' },
  { label: 'Paduan suara', href: '/catalog?kategori=paduan-suara', image: '/categories/paduan-suara.webp' },
];

export const TRUST_ITEMS: HomeTrustItem[] = [
  { icon: Truck, title: 'Pengiriman massal', description: 'Langsung ke sekolah Anda' },
  { icon: ShieldCheck, title: 'Kendali mutu', description: 'Dicek di setiap tahap' },
  { icon: Package, title: 'Garansi jahitan', description: 'Perbaikan gratis' },
  { icon: Headset, title: 'Konsultasi', description: 'Tim kami siap membantu' },
];
