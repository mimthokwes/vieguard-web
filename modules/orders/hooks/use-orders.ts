'use client';

import { useQuery } from '@tanstack/react-query';
import { Order, OrderStatusHistory } from '@/types/order';
import { getMyOrdersAction, getOrderDetailAction } from '../actions';

export interface UseOrdersOptions {
  initialOrders?: Order[];
}

/**
 * Hook to present order list data backed by TanStack Query cache.
 * Automatically revalidates when customer focuses the window.
 */
export function useOrders(options: UseOrdersOptions = {}) {
  const {
    data: orders = options.initialOrders || [],
    isLoading,
    isFetching,
    error,
    refetch,
  } = useQuery<Order[]>({
    queryKey: ['orders'],
    queryFn: async () => {
      const res = await getMyOrdersAction();
      if (res.error) throw new Error(res.error);
      return res.orders || [];
    },
    initialData: options.initialOrders,
    staleTime: 20 * 1000,
    refetchOnWindowFocus: true,
  });

  return {
    orders,
    isLoading,
    isFetching,
    error: error ? (error as Error).message : null,
    refetch,
  };
}

export interface UseOrderDetailOptions {
  orderId: string;
  initialOrder?: Order;
  initialHistory?: OrderStatusHistory[];
}

/**
 * Hook to present single order detail and its status tracking history backed by TanStack Query cache.
 * Features:
 * - Smart Conditional Polling (every 15s ONLY while status is 'pending' or awaiting payment verification).
 * - Automatic stop when order is confirmed / terminal.
 * - Revalidates immediately when user focuses the tab.
 */
export function useOrderDetail({ orderId, initialOrder, initialHistory }: UseOrderDetailOptions) {
  const query = useQuery({
    queryKey: ['order-detail-with-history', orderId],
    queryFn: async () => {
      const res = await getOrderDetailAction(orderId);
      if (res.error) throw new Error(res.error);
      return {
        order: res.order!,
        history: res.history || [],
      };
    },
    initialData: initialOrder
      ? {
          order: initialOrder,
          history: initialHistory || [],
        }
      : undefined,
    enabled: Boolean(orderId),
    staleTime: 10 * 1000,
    refetchOnWindowFocus: true,
    refetchInterval: (q) => {
      const current = q.state.data?.order;
      if (!current) return false;

      // Smart Conditional Polling: only poll if status is pending or awaiting payment confirmation
      const isPending = current.status === 'pending';
      const isWaitingPayment = current.payments?.some((p) => p.status === 'menunggu');

      return isPending || isWaitingPayment ? 15000 : false;
    },
  });

  const order = query.data?.order || initialOrder;
  const history = query.data?.history || initialHistory || [];

  return {
    order,
    history,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error ? (query.error as Error).message : null,
    refetch: query.refetch,
  };
}
