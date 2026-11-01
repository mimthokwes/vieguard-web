"use client";

import { useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AppNotification } from '@/types/notification';
import { getNotifications } from '../services/notification-service';
import { markReadAction, markAllReadAction } from '../actions';

export interface UseNotificationsOptions {
  initialNotifications?: AppNotification[];
}

/**
 * Hook to present notifications and manage reading status backed by TanStack Query cache.
 */
export function useNotifications(options: UseNotificationsOptions = {}) {
  const queryClient = useQueryClient();

  const {
    data: notifications = options.initialNotifications || [],
    isLoading,
    isFetching,
    error,
    refetch,
  } = useQuery<AppNotification[]>({
    queryKey: ['notifications'],
    queryFn: () => getNotifications(),
    initialData: options.initialNotifications,
    staleTime: 30 * 1000,
  });

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.isRead).length,
    [notifications]
  );

  const markReadMutation = useMutation({
    mutationFn: (id: string) => markReadAction(id),
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ['notifications'] });
      const previous = queryClient.getQueryData<AppNotification[]>(['notifications']);
      queryClient.setQueryData<AppNotification[]>(['notifications'], (old = []) =>
        old.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      return { previous };
    },
    onError: (_err, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['notifications'], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const markAllReadMutation = useMutation({
    mutationFn: () => markAllReadAction(),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['notifications'] });
      const previous = queryClient.getQueryData<AppNotification[]>(['notifications']);
      queryClient.setQueryData<AppNotification[]>(['notifications'], (old = []) =>
        old.map((n) => ({ ...n, isRead: true }))
      );
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['notifications'], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  return {
    notifications,
    unreadCount,
    isLoading,
    isFetching,
    isUpdating: markReadMutation.isPending || markAllReadMutation.isPending,
    error: error ? (error as Error).message : null,
    markAsRead: (id: string) => markReadMutation.mutateAsync(id),
    markAllAsRead: () => markAllReadMutation.mutateAsync(),
    refetch,
  };
}
