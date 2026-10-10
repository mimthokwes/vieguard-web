import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/session';
import { getNotifications } from '@/lib/api/notification-api';
import { NotificationsView } from '@/modules/notifications/views/notifications-view';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Pusat Notifikasi | VIEGUARD',
  description: 'Pemberitahuan status produksi pesanan, jadwal sewa, penawaran, dan pembayaran.',
};

export default async function NotificationsPage() {
  if (!(await getSessionUser())) redirect('/login?next=/notifications');
  const notifications = await getNotifications();
  return <NotificationsView notifications={notifications} />;
}
