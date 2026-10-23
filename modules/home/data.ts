import {
  Award, Baby, CalendarClock, Crown, Flag, GraduationCap, Headset, Music, Package, Ruler, School,
  ShieldCheck, Shirt, Truck, type LucideIcon,
} from 'lucide-react';

export type HomeCategory = { label: string; href: string; icon: LucideIcon };
export type HomeFeature = { label: string; icon: LucideIcon };
export type HomeTrustItem = { title: string; description: string; icon: LucideIcon };

export const HERO_FEATURES: HomeFeature[] = [
  { icon: Ruler, label: 'Ukuran presisi' },
  { icon: Truck, label: 'Pengiriman massal' },
  { icon: CalendarClock, label: 'Sewa terjadwal' },
];

export const CATEGORIES: HomeCategory[] = [
  { label: 'Seragam TK', href: '/catalog?kategori=tk', icon: Baby },
  { label: 'Seragam SD', href: '/catalog?kategori=sd', icon: School },
  { label: 'Seragam SMP', href: '/catalog?kategori=smp', icon: Shirt },
  { label: 'Seragam SMA', href: '/catalog?kategori=sma', icon: GraduationCap },
  { label: 'Marching band', href: '/catalog?kategori=marching-band', icon: Music },
  { label: 'Color guard', href: '/catalog?kategori=color-guard', icon: Flag },
  { label: 'Jas wisuda', href: '/catalog?kategori=wisuda', icon: Award },
  { label: 'Sewa perlengkapan', href: '/catalog?tipe=sewa', icon: Crown },
];

export const TRUST_ITEMS: HomeTrustItem[] = [
  { icon: Truck, title: 'Pengiriman massal', description: 'Langsung ke sekolah Anda' },
  { icon: ShieldCheck, title: 'Kendali mutu', description: 'Dicek di setiap tahap' },
  { icon: Package, title: 'Garansi jahitan', description: 'Perbaikan gratis' },
  { icon: Headset, title: 'Konsultasi', description: 'Tim kami siap membantu' },
];