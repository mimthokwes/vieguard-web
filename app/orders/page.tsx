import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/session';
import { getMyOrders } from '@/lib/api/order-api';
import { OrdersListView } from '@/modules/orders/views/orders-list-view';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Pesanan & Sewa Saya | VIEGUARD',
  description: 'Pantau status produksi seragam, reservasi sewa, dan riwayat transaksi Anda.',
};

export default async function OrdersPage() {
  const user = await getSessionUser();
  if (!user) redirect('/login?next=/orders');
  const { orders, error } = await getMyOrders();
  return <OrdersListView orders={orders} userName={user.name} error={error} />;
}
