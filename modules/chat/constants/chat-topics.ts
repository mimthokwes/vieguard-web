import { Scissors, Shirt, Sparkles, type LucideIcon } from 'lucide-react';

export interface ChatTopic {
  key: string;
  label: string;
  icon: LucideIcon;
  template: string;
}

export const CHAT_TOPICS: ChatTopic[] = [
  { key: 'jahit', label: 'Konsultasi Jahit', icon: Scissors, template: 'Halo Admin, saya ingin konsultasi pesanan jahit seragam: ' },
  { key: 'sewa', label: 'Konsultasi Sewa', icon: Shirt, template: 'Halo Admin, saya ingin menanyakan ketersediaan sewa untuk tanggal: ' },
  { key: 'desain', label: 'Desainer Daring', icon: Sparkles, template: 'Halo tim desainer, saya ingin mendiskusikan desain seragam: ' },
];

export const DEFAULT_OPERATIONAL_HOURS = 'Senin - Sabtu, 08.00 - 17.00 WIB';
export const POLL_MS = 5000;