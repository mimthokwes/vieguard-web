import { Metadata } from 'next';
import { PackageSelectView } from '@/modules/order/views/package-select-view';

export const metadata: Metadata = {
  title: 'Pilih Paket Pemesanan Seragam | VIEGUARD',
  description: 'Pilih jalur produksi seragam: Paket Standar Institusi atau Paket Kustom Adibusana (Bespoke).',
};

export default function OrderPage() {
  return <PackageSelectView />;
}
