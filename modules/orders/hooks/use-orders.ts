"use client";

import { useQuery } from '@tanstack/react-query';
import { Order, OrderStatusHistory } from '@/types/order';
import { getMyOrders, getOrderDetail, getOrderStatusHistory } from '../services/orders-service';

export interface UseOrdersOptions {
  initialOrders?: Order[];
}

/**
 * Hook to present order list data backed by TanStack Query cache.
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
      const res = await getMyOrders();
      if (res.error) throw new Error(res.error);
      return res.orders;
    },
    initialData: options.initialOrders,
    staleTime: 30 * 1000,
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
 */
export function useOrderDetail({ orderId, initialOrder, initialHistory }: UseOrderDetailOptions) {
  const orderQuery = useQuery<Order>({
    queryKey: ['order-detail', orderId],
    queryFn: () => getOrderDetail(orderId),
    initialData: initialOrder,
    enabled: !!orderId,
    staleTime: 30 * 1000,
  });

  const historyQuery = useQuery<OrderStatusHistory[]>({
    queryKey: ['order-history', orderId],
    queryFn: () => getOrderStatusHistory(orderId),
    initialData: initialHistory,
    enabled: !!orderId,
    staleTime: 30 * 1000,
  });

  const isLoading = orderQuery.isLoading || historyQuery.isLoading;
  const isFetching = orderQuery.isFetching || historyQuery.isFetching;
  const error = orderQuery.error
    ? (orderQuery.error as Error).message
    : historyQuery.error
      ? (historyQuery.error as Error).message
      : null;

  return {
    order: orderQuery.data,
    history: historyQuery.data || [],
    isLoading,
    isFetching,
    error,
    refetch: () => {
      orderQuery.refetch();
      historyQuery.refetch();
    },
  };
}
