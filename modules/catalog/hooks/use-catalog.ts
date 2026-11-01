"use client";

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Product, ProductCategory, ProductFilterQuery } from '@/types/product';
import { getProducts, getCategories } from '../services/catalog-service';

export interface UseCatalogOptions {
  initialProducts?: Product[];
  initialCategories?: ProductCategory[];
  initialQuery?: ProductFilterQuery;
}

/**
 * Hook to manage and present catalog data (products and categories) backed by TanStack Query.
 */
export function useCatalog(options: UseCatalogOptions = {}) {
  const [filterQuery, setFilterQuery] = useState<ProductFilterQuery | undefined>(options.initialQuery);

  const {
    data: products = options.initialProducts || [],
    isLoading: isLoadingProducts,
    isFetching: isFetchingProducts,
    error: productsError,
    refetch: refetchProducts,
  } = useQuery({
    queryKey: ['catalog', 'products', filterQuery],
    queryFn: () => getProducts(filterQuery),
    initialData: options.initialProducts,
    staleTime: 60 * 1000,
  });

  const {
    data: categories = options.initialCategories || [],
    isLoading: isLoadingCategories,
    error: categoriesError,
    refetch: refetchCategories,
  } = useQuery({
    queryKey: ['catalog', 'categories'],
    queryFn: () => getCategories(),
    initialData: options.initialCategories,
    staleTime: 10 * 60 * 1000,
  });

  const isLoading = isLoadingProducts || isLoadingCategories;
  const error = productsError ? (productsError as Error).message : categoriesError ? (categoriesError as Error).message : null;

  return {
    products,
    categories,
    isLoading,
    isFetching: isFetchingProducts,
    error,
    filterQuery,
    setFilterQuery,
    refetchProducts,
    refetchCategories,
  };
}
