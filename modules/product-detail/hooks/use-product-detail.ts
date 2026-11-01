"use client";

import { useQuery, useMutation } from '@tanstack/react-query';
import { Product, RentalAvailability } from '@/types/product';
import { getProductDetail, checkProductAvailability } from '../services/product-detail-service';

export interface UseProductDetailOptions {
  productId: string;
  initialProduct?: Product;
}

/**
 * Hook to manage product detail view state backed by TanStack Query.
 */
export function useProductDetail({ productId, initialProduct }: UseProductDetailOptions) {
  const {
    data: product,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useQuery<Product>({
    queryKey: ['product-detail', productId],
    queryFn: () => getProductDetail(productId),
    initialData: initialProduct,
    enabled: !!productId,
    staleTime: 60 * 1000,
  });

  return {
    product,
    isLoading,
    isFetching,
    error: error ? (error as Error).message : null,
    refetch,
  };
}

/**
 * Hook to check availability of a product rental period and variant backed by TanStack Query mutation.
 */
export function useProductAvailability(productId: string) {
  const mutation = useMutation<
    RentalAvailability,
    Error,
    { pickupDate: string; returnDate: string; variantId?: string | null }
  >({
    mutationFn: ({ pickupDate, returnDate, variantId }) =>
      checkProductAvailability(productId, pickupDate, returnDate, variantId),
  });

  const checkAvailability = async (
    pickupDate: string,
    returnDate: string,
    variantId?: string | null
  ) => {
    if (!pickupDate || !returnDate) return null;
    try {
      return await mutation.mutateAsync({ pickupDate, returnDate, variantId });
    } catch {
      return null;
    }
  };

  return {
    availability: mutation.data ?? null,
    isChecking: mutation.isPending,
    error: mutation.error ? mutation.error.message : null,
    checkAvailability,
  };
}
