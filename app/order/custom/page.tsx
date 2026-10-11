import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/session';
import { getAccessories } from '@/lib/api/product-api';
import { CustomOrderView } from '@/modules/order/views/custom-order-view';
import { DEFAULT_CUSTOM_ACCESSORIES } from '@/modules/order/data';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Formulir Paket Kustom Adibusana | VIEGUARD',
  description: 'Ajukan rancangan seragam drum band eksklusif dan dapatkan penawaran resmi dari master tailor VIEGUARD.',
};

export default async function CustomOrderPage() {
  if (!(await getSessionUser())) redirect('/login?next=/order/custom');
  const fromCatalog = await getAccessories();
  const accessories = fromCatalog.length > 0 ? fromCatalog : DEFAULT_CUSTOM_ACCESSORIES;
  return <CustomOrderView accessories={accessories} />;
}
