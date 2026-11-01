"use client";

import { useQuery } from '@tanstack/react-query';
import { Product } from '@/types/product';
import { StoreProfile } from '@/types/store';
import { getStoreProfile } from '../services/store-service';
import { CATEGORIES, HERO_FEATURES, TRUST_ITEMS } from '../data';

export interface UseHomeOptions {
  initialHighlights?: Product[];
  initialTrending?: Product[];
  initialStore?: StoreProfile | null;
}

/**
 * Hook to present home page data and store profile backed by TanStack Query cache.
 */
export function useHome(options: UseHomeOptions = {}) {
  const {
    data: store = options.initialStore ?? null,
    isLoading: isLoadingStore,
    isFetching: isFetchingStore,
    refetch: refetchStore,
  } = useQuery<StoreProfile | null>({
    queryKey: ['store-profile'],
    queryFn: () => getStoreProfile(),
    initialData: options.initialStore,
    staleTime: 10 * 60 * 1000,
  });

  return {
    highlights: options.initialHighlights || [],
    trending: options.initialTrending || [],
    store,
    isLoadingStore,
    isFetchingStore,
    refetchStore,
    categories: CATEGORIES,
    heroFeatures: HERO_FEATURES,
    trustItems: TRUST_ITEMS,
  };
}
