import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/session';
import { getOrderDetail, getOrderStatusHistory } from '@/modules/orders/services/orders-service';
import { getStoreProfile } from '@/modules/home/services/store-service';
import { isAwaitingQuote } from '@/lib/order-status';
import { decodeOrderId, encodeOrderId } from '@/lib/order-hash';
import { QuoteStatusView } from '@/modules/orders/views/quote-status-view';
import { OrderTrackingView } from '@/modules/orders/views/order-tracking-view';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ created?: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  return { title: `Detail Pesanan ${id} | VIEGUARD` };
}

export default async function OrderDetailPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const decoded = decodeOrderId(id);
  if (!decoded) {
    notFound();
  }

  // Canonical redirect: If accessed via legacy numeric id (e.g. /orders/37), redirect to aesthetic hash URL
  if (/^\d+$/.test(id.trim())) {
    const hash = encodeOrderId(decoded);
    const search = await searchParams;
    const query = search.created ? `?created=${search.created}` : '';
    redirect(`/orders/${hash}${query}`);
  }

  if (!(await getSessionUser())) redirect(`/login?next=/orders/${id}`);

  const [order, history, store, { created }] = await Promise.all([
    getOrderDetail(id),
    getOrderStatusHistory(id),
    getStoreProfile(),
    searchParams,
  ]);
  const justCreated = created === '1';

  // Custom orders without a price yet show the quotation room (Figma screen 11).
  if (isAwaitingQuote(order)) {
    return <QuoteStatusView order={order} store={store} justCreated={justCreated} />;
  }
  return <OrderTrackingView order={order} history={history} store={store} justCreated={justCreated} />;
}
