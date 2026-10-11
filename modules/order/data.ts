export const JENJANG_OPTIONS = [
  { value: 'TK / PAUD', label: 'TK / PAUD', hint: '3-6 Tahun' },
  { value: 'SD / MI', label: 'SD / MI', hint: '7-12 Tahun' },
  { value: 'SMP / MTs', label: 'SMP / MTs', hint: 'Remaja Awal' },
  { value: 'SMA / SMK', label: 'SMA / SMK', hint: 'Remaja Atas' },
  { value: 'Universitas', label: 'Universitas', hint: 'Mahasiswa' },
  { value: 'Umum / Korporat', label: 'Umum / Korporat', hint: 'Komunitas' },
];

export const UNIFORM_CATEGORIES = [
  { value: 'Setelan Player Inti', icon: 'shirt', description: 'Set Jas Kombinasi, Celana/Rok Formal, & Selempang Bahu.' },
  { value: 'Kostum Color Guard', icon: 'flag', description: 'Bahan stretch aerodinamis, detail payet ornamen, & fleksibilitas gerak.' },
  { value: 'Mayoret & Komandan', icon: 'award', description: 'Model tailor eksklusif, rumbai bahu emas, & aksen topi shako parade.' },
] as const;

export const COLOR_PRESETS = [
  { name: 'Maroon & Aksen Emas', hex: '#7A0015' },
  { name: 'Navy Blue & Aksen Emas', hex: '#1E3A8A' },
  { name: 'Hijau Botol & Aksen Emas', hex: '#14532D' },
  { name: 'Hitam & Aksen Perak', hex: '#1F2937' },
  { name: 'Kuning Emas', hex: '#D9A33A' },
  { name: 'Putih Gading', hex: '#FFFFFF' },
];

/** Accessory preferences offered on the custom form when the store has none in the catalog. */
export const DEFAULT_CUSTOM_ACCESSORIES = [
  { name: 'Jubah Satin Beludru', description: 'Lapisan velvet mewah dengan kancing kait kuningan antik untuk mayoret utama.' },
  { name: 'Epaulet Bahu Rumbai Logam', description: 'Bantalan bahu struktural dengan untaian rumbai kawat bullion bersepuh emas.' },
  { name: 'Bulu Ostrich Shako', description: 'Plume bulu burung unta alami grade ekspor dengan penyangga logam berukir.' },
  { name: 'Tongkat Baton Mayoret Kustom', description: 'Baton seimbang kromik berukir grafir logo unit drum band dengan lilitan tali kordon.' },
];

export const STANDARD_PACKAGE = {
  name: 'Paket Standar Institusi',
  subtitle: 'Produksi Konveksi Massal',
  duration: '14 - 21 Hari Kerja',
  warranty: '14 Hari Pasca Kirim',
  components: ['Jas Tunic Drill', 'Celana Lis Emas', 'Topi Shako & Plume', 'Sarung Tangan'],
};

export const CUSTOM_MIN_QUANTITY = 15;

export const STANDARD_DRAFT_KEY = 'vieguard:standard-order-draft';
