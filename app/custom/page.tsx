import { Metadata } from 'next';
import { getSessionUser } from '@/lib/session';
import { getAccessories } from '@/modules/order/services/order-service';
import { CustomView } from '@/modules/custom/views/custom-view';
import { DEFAULT_CUSTOM_ACCESSORIES } from '@/modules/order/data';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Pesanan Custom (Pre-Order Desain Sendiri) | VIEGUARD',
  description:
    'Layanan pemesanan seragam custom dengan desain dan model sendiri. Tentukan bahan, unggah foto referensi, dan konsultasikan bersama penjahit VIEGUARD.',
};

export default async function CustomPage() {
  const user = await getSessionUser();
  const fromCatalog = await getAccessories();
  const accessories = fromCatalog.length > 0 ? fromCatalog : DEFAULT_CUSTOM_ACCESSORIES;

  return (
    <CustomView
      accessories={accessories}
      isLoggedIn={Boolean(user)}
    />
  );
}
