import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/session';
import { getStoreProfile } from '@/lib/api/store-api';
import { StandardOrderView } from '@/modules/order/views/standard-order-view';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Formulir Paket Standar Institusi | VIEGUARD',
  description: 'Pesan seragam paket standar institusi dalam 3 langkah: data institusi, unggah data ukuran, dan konfirmasi.',
};

interface PageProps {
  searchParams: Promise<{ step?: string }>;
}

export default async function StandardOrderPage({ searchParams }: PageProps) {
  const user = await getSessionUser();
  if (!user) redirect('/login?next=/order/standard');
  const [{ step }, store] = await Promise.all([searchParams, getStoreProfile()]);
  return <StandardOrderView user={user} initialStep={Number(step) || 1} storePhone={store?.whatsappNumber || store?.phone} />;
}
