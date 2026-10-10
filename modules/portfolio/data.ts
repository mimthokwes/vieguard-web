/**
 * Portfolio showcase entries. The backend has no portfolio endpoint yet, so
 * completed projects are curated here until one exists. Copy and photos are
 * the Figma sample content (photos cropped from the design export at 1x) —
 * replace them with real project data and full-resolution photos.
 */
export type PortfolioCategory = 'tk' | 'sd' | 'smp' | 'sma' | 'mayoret' | 'colorguard';

export interface PortfolioProject {
  id: string;
  title: string;
  institution: string;
  category: PortfolioCategory;
  year: number;
  materials: string[];
  quantity: number;
  image?: string;
}

export const PORTFOLIO_CATEGORIES: { value: PortfolioCategory; label: string }[] = [
  { value: 'tk', label: 'TK & PAUD' },
  { value: 'sd', label: 'SD / MI' },
  { value: 'smp', label: 'SMP / MTs' },
  { value: 'sma', label: 'SMA / SMK / Universitas' },
  { value: 'mayoret', label: 'Kostum Mayoret' },
  { value: 'colorguard', label: 'Color Guard' },
];

export function categoryLabel(value: PortfolioCategory) {
  return PORTFOLIO_CATEGORIES.find((c) => c.value === value)?.label ?? value;
}

/** Marketing figures shown in the page header. */
export const PORTFOLIO_STATS = { projects: '480+ Proyek', since: 'Selesai Dikerjakan Sejak 2018' };

export const PORTFOLIO_PROJECTS: PortfolioProject[] = [
  {
    id: 'korps-marching-band-royal',
    title: 'Seragam Korps Marching Band Royal',
    institution: 'SMA Taruna Mandiri',
    category: 'sma',
    year: 2024,
    materials: ['Bahan Drill & Wool', 'Bordir Kordon Emas', 'Topi Shako + Plume'],
    quantity: 50,
    image: '/images/portfolio/project-1.webp',
  },
  {
    id: 'korps-drumband-crimson',
    title: 'Seragam Korps Drumband Crimson',
    institution: 'SMP Negeri Harapan',
    category: 'smp',
    year: 2024,
    materials: ['Bahan Japan Drill', 'Bordir Komputer HD', 'Peci Pet Komandan'],
    quantity: 42,
    image: '/images/portfolio/project-2.webp',
  },
  {
    id: 'busana-mayoret-utama',
    title: 'Busana Mayoret Utama & Field Commander',
    institution: 'SD Al-Azhar Gemilang',
    category: 'mayoret',
    year: 2024,
    materials: ['Bahan Satin Duchess', 'Aksen Payet Gliter', 'Sepatu Boots Kulit'],
    quantity: 6,
    image: '/images/portfolio/project-3.webp',
  },
  {
    id: 'junior-ceria-drumband-cilik',
    title: 'Paket Junior Ceria Drumband Cilik',
    institution: 'TK Bintang Pertiwi',
    category: 'tk',
    year: 2023,
    materials: ['Kain American Drill', 'Furing Katun Adem', 'Topi Baret Ringan'],
    quantity: 36,
    image: '/images/portfolio/project-4.webp',
  },
  {
    id: 'color-guard-nasional',
    title: 'Seragam Color Guard Nasional',
    institution: 'Universitas Nusantara',
    category: 'colorguard',
    year: 2024,
    materials: ['Spandeks & Sifon Korea', 'Printing Sublimasi HD', 'Fleksibel & Anti-Keringat'],
    quantity: 24,
    image: '/images/portfolio/project-5.webp',
  },
  {
    id: 'korps-gita-bahana-utama',
    title: 'Seragam Korps Gita Bahana Utama',
    institution: 'SD Model Pelita Bangsa',
    category: 'sd',
    year: 2023,
    materials: ['Bahan Nagata Drill', 'Sabuk Silang Kuningan', 'Topi Pasukan Bulu'],
    quantity: 55,
    image: '/images/portfolio/project-6.webp',
  },
];
