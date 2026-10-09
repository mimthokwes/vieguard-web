import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/session';
import { CartView } from '@/modules/cart/views/cart-view';

// Render strategy: SSR (Data keranjang spesifik per akun pengguna)
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Keranjang Reservasi | VIEGUARD Boutique & Rental',
  description: 'Tinjau dan kelola keranjang sewa atau pembelian gaun & jas desainer Anda.',
};

export default async function CartPage() {
  const user = await getSessionUser();
  if (!user) {
    redirect('/login');
  }

  return <CartView />;
}
