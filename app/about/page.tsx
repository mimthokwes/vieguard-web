import { Metadata } from 'next';
import { getStoreProfile } from '@/modules/home/services/store-service';
import { getTestimonials } from '@/modules/about/services/about-service';
import { getSessionUser } from '@/lib/session';
import { getMyOrders } from '@/modules/orders/services/orders-service';
import { AboutView } from '@/modules/about/views/about-view';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Tentang Kami | VIEGUARD',
  description: 'Profil workshop dan ulasan pelanggan Vieguard.',
};

export default async function AboutPage() {
  const [store, testimonials, user, { orders }] = await Promise.all([
    getStoreProfile(),
    getTestimonials(),
    getSessionUser(),
    getMyOrders(),
  ]);

  const completedOrders = orders.filter((o) => o.status === 'selesai');

  return (
    <AboutView
      store={store}
      testimonials={testimonials}
      user={user}
      completedOrders={completedOrders}
    />
  );
}
