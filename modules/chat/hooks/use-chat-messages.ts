"use client";

import { useCallback, useEffect, useRef, useState } from 'react';
import { io, type Socket } from 'socket.io-client';
import { ChatMessage } from '@/types/chat';
import { getSocketTokenAction, refreshMessagesAction, sendMessageAction } from '../actions';
import {
  CHAT_EVENTS,
  FALLBACK_POLL_MS,
  SEND_TIMEOUT_MS,
  SOCKET_NAMESPACE,
  SOCKET_URL,
} from '../constants/chat-socket';

const MAX_LENGTH = 2000;

const appendUnique = (list: ChatMessage[], msg: ChatMessage) =>
  list.some((x) => x.id === msg.id) ? list : [...list, msg];

/** Merge server history with local messages by id, so a socket message that arrives mid-fetch is never lost. */
const mergeById = (local: ChatMessage[], server: ChatMessage[]) => {
  const serverIds = new Set(server.map((m) => m.id));
  return [...server, ...local.filter((m) => !serverIds.has(m.id))];
};

/** Send over the socket, then wait for the server's `message:new` echo as confirmation. */
function emitAndWaitEcho(socket: Socket, conversationId: string, messageText: string) {
  return new Promise<ChatMessage>((resolve, reject) => {
    const cleanup = () => {
      clearTimeout(timer);
      socket.off(CHAT_EVENTS.new, onNew);
    };
    const onNew = (msg: ChatMessage) => {
      if (
        String(msg.conversationId) === conversationId &&
        msg.senderType === 'user' &&
        msg.messageText === messageText
      ) {
        cleanup();
        resolve(msg);
      }
    };
    const timer = setTimeout(() => {
      cleanup();
      reject(new Error('Pesan belum terkonfirmasi server. Periksa riwayat chat sebelum mengirim ulang.'));
    }, SEND_TIMEOUT_MS);

    socket.on(CHAT_EVENTS.new, onNew);
    socket.emit(CHAT_EVENTS.send, { conversationId, messageText });
  });
}

/**
 * The only place that handles chat data transport. No cache layer (no TanStack Query).
 * - Initial history : `initialMessages` (SSR), always re-synced from the server on connect.
 * - Incoming        : real-time `message:new` socket event.
 * - Offline         : light polling fallback, stopped as soon as the socket is back.
 * - Sending         : via socket; falls back to `sendMessageAction` if the socket is down.
 */
export function useChatMessages(
  initialMessages: ChatMessage[] = [],
  loadError?: string,
  conversationId?: string | number,
) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [online, setOnline] = useState(!loadError);
  const [error, setError] = useState(loadError ?? '');
  const [sending, setSending] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  const resync = useCallback(async () => {
    try {
      const r = await refreshMessagesAction();
      if (r.messages) setMessages((local) => mergeById(local, r.messages!));
    } catch {
      // Keep current messages; the next resync will retry.
    }
  }, []);

  // Socket lifecycle
  useEffect(() => {
    if (!conversationId) return;
    if (!SOCKET_URL) {
      setOnline(false);
      setError('NEXT_PUBLIC_SOCKET_URL belum diatur.');
      return;
    }
    const roomId = String(conversationId);

    const socket = io(`${SOCKET_URL}${SOCKET_NAMESPACE}`, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelayMax: 10_000,
      // Called on every (re)connect, so the token is always fresh.
      auth: (cb) => {
        getSocketTokenAction()
          .then((r) => cb({ token: r.token ?? '' }))
          .catch(() => cb({ token: '' }));
      },
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      socket.emit(CHAT_EVENTS.join, roomId); // join first, then resync so there is no gap
      setOnline(true);
      setError('');
      resync();
    });
    socket.on('disconnect', () => setOnline(false));
    socket.on('connect_error', () => setOnline(false));

    socket.on(CHAT_EVENTS.new, (msg: ChatMessage) => {
      if (String(msg.conversationId) === roomId) setMessages((m) => appendUnique(m, msg));
    });

    // Refresh once when the tab becomes visible again (e.g. "read by admin" status).
    const onVisible = () => {
      if (document.visibilityState === 'visible') resync();
    };
    document.addEventListener('visibilitychange', onVisible);

    return () => {
      document.removeEventListener('visibilitychange', onVisible);
      socket.removeAllListeners();
      socket.disconnect();
      socketRef.current = null;
    };
  }, [conversationId, resync]);

  // Polling fallback: only runs while the socket is offline.
  useEffect(() => {
    if (!conversationId || online) return;
    const timer = setInterval(resync, FALLBACK_POLL_MS);
    return () => clearInterval(timer);
  }, [conversationId, online, resync]);

  /** Returns true if the message was sent successfully. */
  const send = useCallback(
    async (value: string) => {
      const messageText = value.trim();
      if (!messageText || sending) return false;
      if (messageText.length > MAX_LENGTH) {
        setError(`Pesan maksimal ${MAX_LENGTH} karakter.`);
        return false;
      }
      setError('');
      setSending(true);
      try {
        const socket = socketRef.current;
        if (socket?.connected && conversationId) {
          const message = await emitAndWaitEcho(socket, String(conversationId), messageText);
          setMessages((m) => appendUnique(m, message));
          return true;
        }
        // Fallback: socket is down -> send through the server (opens a short-lived connection)
        const r = await sendMessageAction(messageText);
        if (r.error) {
          setError(r.error);
          return false;
        }
        if (r.message) setMessages((m) => appendUnique(m, r.message!));
        return true;
      } catch (e) {
        setError((e as Error).message || 'Pesan gagal terkirim.');
        return false;
      } finally {
        setSending(false);
      }
    },
    [sending, conversationId],
  );

  return { messages, online, error, sending, send };
}