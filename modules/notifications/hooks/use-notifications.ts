'use client';

import { useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AppNotification } from '@/types/notification';
import { getNotificationsAction, markReadAction, markAllReadAction } from '../actions';

export interface UseNotificationsOptions {
  initialNotifications?: AppNotification[];
  initialUnreadCount?: number;
  enabled?: boolean;
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
    queryFn: () => getNotificationsAction(),
    initialData: options.initialNotifications,
    enabled: options.enabled !== false,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchInterval: false,
  });

  const unreadCount = useMemo(() => {
    if (notifications.length > 0) {
      return notifications.filter((n) => !n.isRead).length;
    }
    return options.initialUnreadCount ?? 0;
  }, [notifications, options.initialUnreadCount]);

  const markReadMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await markReadAction(id);
      if (res?.error) {
        throw new Error(res.error);
      }
      return res;
    },
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ['notifications'] });
      const previous = queryClient.getQueryData<AppNotification[]>(['notifications']);
      queryClient.setQueryData<AppNotification[]>(['notifications'], (old = []) =>
        old.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      return { previous };
    },
    onSuccess: (_data, id) => {
      queryClient.setQueryData<AppNotification[]>(['notifications'], (old = []) =>
        old.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
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
    mutationFn: async () => {
      const res = await markAllReadAction();
      if (res?.error) {
        throw new Error(res.error);
      }
      return res;
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['notifications'] });
      const previous = queryClient.getQueryData<AppNotification[]>(['notifications']);
      queryClient.setQueryData<AppNotification[]>(['notifications'], (old = []) => old.map((n) => ({ ...n, isRead: true })));
      return { previous };
    },
    onSuccess: () => {
      queryClient.setQueryData<AppNotification[]>(['notifications'], (old = []) => old.map((n) => ({ ...n, isRead: true })));
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
