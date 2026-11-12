'use client';

import React from 'react';
import { Order, OrderStatusHistory } from '@/types/order';
import { StoreProfile } from '@/types/store';
import { isAwaitingQuote } from '@/lib/order-status';
import { useOrderDetail } from '../hooks/use-orders';
import { QuoteStatusView } from './quote-status-view';
import { OrderTrackingView } from './order-tracking-view';

interface OrderDetailClientViewProps {
  orderId: string;
  initialOrder: Order;
  initialHistory: OrderStatusHistory[];
  store?: StoreProfile | null;
  justCreated?: boolean;
}

export function OrderDetailClientView({ orderId, initialOrder, initialHistory, store, justCreated }: OrderDetailClientViewProps) {
  const { order, history, isFetching, refetch } = useOrderDetail({
    orderId,
    initialOrder,
    initialHistory,
  });

  const activeOrder = order || initialOrder;
  const activeHistory = history || initialHistory;

  if (isAwaitingQuote(activeOrder)) {
    return (
      <QuoteStatusView order={activeOrder} store={store} justCreated={justCreated} isFetching={isFetching} onRefresh={() => refetch()} />
    );
  }

  return (
    <OrderTrackingView
      order={activeOrder}
      history={activeHistory}
      store={store}
      justCreated={justCreated}
      isFetching={isFetching}
      onRefresh={() => refetch()}
    />
  );
}
