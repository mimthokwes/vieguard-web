"use client";

import { useState, useMemo, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { formatImageUrl } from '@/lib/image';
import { createOrder } from '../services/cart-service';

export interface CartItem {
  id: string;
  name: string;
  size: string;
  type: string;
  date: string;
  price: number;
  deposit: number;
  protection: number;
  quantity: number;
  image: string;
}

const DEFAULT_INITIAL_ITEMS: CartItem[] = [
  {
    id: 'cart-1',
    name: 'Kostum Drumband Gita Bahari',
    size: 'S',
    type: 'SEWA (3 Hari)',
    date: 'Reservasi Backend',
    price: 200000,
    deposit: 100000,
    protection: 25000,
    quantity: 1,
    image: formatImageUrl(null),
  },
];

/**
 * Hook to manage cart items, totals calculation, and submission backed by TanStack Query mutation.
 */
export function useCart(initialItems: CartItem[] = DEFAULT_INITIAL_ITEMS) {
  const queryClient = useQueryClient();
  const [items, setItems] = useState<CartItem[]>(initialItems);
  const [orderSubmitted, setOrderSubmitted] = useState(false);

  const orderMutation = useMutation({
    mutationFn: async (payload: Record<string, unknown>) => {
      return createOrder(payload);
    },
    onSuccess: () => {
      setOrderSubmitted(true);
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });

  const updateQuantity = useCallback((id: string, delta: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
      )
    );
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );
  const depositTotal = useMemo(
    () => items.reduce((sum, item) => sum + item.deposit * item.quantity, 0),
    [items]
  );
  const protectionTotal = useMemo(
    () => items.reduce((sum, item) => sum + item.protection * item.quantity, 0),
    [items]
  );
  const shippingFee = items.length > 0 ? 45000 : 0;
  const grandTotal = subtotal + depositTotal + protectionTotal + shippingFee;

  const submitCartOrder = useCallback(
    async (orderPayload?: Record<string, unknown>) => {
      if (orderPayload) {
        await orderMutation.mutateAsync(orderPayload);
      } else {
        setOrderSubmitted(true);
      }
    },
    [orderMutation]
  );

  return {
    items,
    updateQuantity,
    removeItem,
    clearCart,
    subtotal,
    depositTotal,
    protectionTotal,
    shippingFee,
    grandTotal,
    orderSubmitted,
    setOrderSubmitted,
    isSubmitting: orderMutation.isPending,
    error: orderMutation.error ? (orderMutation.error as Error).message : null,
    submitCartOrder,
  };
}
