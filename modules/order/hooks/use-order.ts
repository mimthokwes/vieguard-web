"use client";

import { useQuery } from '@tanstack/react-query';
import { Accessory } from '@/types/order';
import { getAccessories } from '../services/order-service';

/**
 * Hook to manage accessory options for custom order configuration backed by TanStack Query.
 */
export function useAccessories(initialAccessories: Accessory[] = []) {
  const {
    data: accessories = initialAccessories,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useQuery<Accessory[]>({
    queryKey: ['accessories'],
    queryFn: () => getAccessories(),
    initialData: initialAccessories.length > 0 ? initialAccessories : undefined,
    staleTime: 5 * 60 * 1000,
  });

  return {
    accessories,
    isLoading,
    isFetching,
    error: error ? (error as Error).message : null,
    refetch,
  };
}
