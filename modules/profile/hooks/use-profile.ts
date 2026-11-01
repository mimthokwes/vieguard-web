"use client";

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { User } from '@/types/user';
import { getProfile } from '../services/profile-service';

export interface UseProfileOptions {
  initialUser?: User | null;
}

/**
 * Hook to present and manage user profile presentation state backed by TanStack Query.
 */
export function useProfile(options: UseProfileOptions = {}) {
  const queryClient = useQueryClient();

  const {
    data: user = options.initialUser,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useQuery<User | null>({
    queryKey: ['profile'],
    queryFn: () => getProfile(),
    initialData: options.initialUser,
    staleTime: 60 * 1000,
  });

  const updateUserCache = (patch: Partial<User>) => {
    queryClient.setQueryData<User | null>(['profile'], (old) => (old ? { ...old, ...patch } : null));
  };

  return {
    user,
    isLoading,
    isFetching,
    error: error ? (error as Error).message : null,
    updateUserCache,
    refetch,
  };
}
