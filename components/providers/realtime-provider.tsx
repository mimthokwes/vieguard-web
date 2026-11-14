'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { io, type Socket } from 'socket.io-client';
import { useQueryClient } from '@tanstack/react-query';
import { AppNotification } from '@/types/notification';
import { getNotificationSocketTokenAction } from '@/modules/notifications/actions';
import { SOCKET_URL, SOCKET_NAMESPACE } from '@/modules/chat/constants/chat-socket';

interface RealtimeProviderProps {
  children: ReactNode;
  isLoggedIn: boolean;
}

export function RealtimeProvider({ children, isLoggedIn }: RealtimeProviderProps) {
  const queryClient = useQueryClient();
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!isLoggedIn || !SOCKET_URL) return;

    const socket = io(`${SOCKET_URL}${SOCKET_NAMESPACE}`, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelayMax: 10_000,
      auth: (cb) => {
        getNotificationSocketTokenAction()
          .then((r) => cb({ token: r.token ?? '' }))
          .catch(() => cb({ token: '' }));
      },
    });

    socketRef.current = socket;

    socket.on('notification:new', (notification: AppNotification) => {
      // 1. Secara instan tambahkan notifikasi ke cache TanStack Query tanpa polling!
      queryClient.setQueryData<AppNotification[]>(['notifications'], (old = []) => {
        if (old.some((n) => n.id === notification.id)) return old;
        return [notification, ...old];
      });

      // 2. Jika notifikasi terkait pesanan, sinkronkan cache pesanan secara real-time!
      if (notification.relatedOrderId) {
        queryClient.invalidateQueries({ queryKey: ['order', notification.relatedOrderId] });
        queryClient.invalidateQueries({ queryKey: ['orders'] });
      }
    });

    return () => {
      socket.off('notification:new');
      socket.disconnect();
      socketRef.current = null;
    };
  }, [isLoggedIn, queryClient]);

  return <>{children}</>;
}
