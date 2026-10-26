"use client";

import { useCallback, useEffect, useRef, useState } from 'react';
import { io, type Socket } from 'socket.io-client';
import { ChatMessage } from '@/types/chat';
import { getSocketTokenAction, refreshMessagesAction, sendMessageAction } from '../actions';
import { CHAT_EVENTS, SEND_TIMEOUT_MS, SOCKET_NAMESPACE, SOCKET_URL } from '../constants/chat-socket';

const MAX_LENGTH = 2000;

const appendUnique = (list: ChatMessage[], msg: ChatMessage) =>
  list.some((x) => x.id === msg.id) ? list : [...list, msg];

/** Kirim lewat socket, lalu tunggu echo `message:new` dari server sebagai konfirmasi. */
function emitAndWaitEcho(socket: Socket, conversationId: string, messageText: string) {
  return new Promise<ChatMessage>((resolve, reject) => {
    const cleanup = () => {
      clearTimeout(timer);
      socket.off(CHAT_EVENTS.new, onNew);
    };
    const onNew = (msg: ChatMessage) => {
      if (String(msg.conversationId) === conversationId && msg.senderType === 'user' && msg.messageText === messageText) {
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
 * Satu-satunya tempat yang mengurus transport data chat (Socket.IO).
 * - Riwayat awal : `initialMessages` (SSR), tanpa polling.
 * - Pesan masuk  : event `message:new` real-time.
 * - (Re)connect  : join room + sekali fetch ulang riwayat agar tidak ada yang terlewat.
 * - Kirim pesan  : lewat socket; jika socket putus, fallback ke `sendMessageAction`.
 */
export function useChatMessages(initialMessages: ChatMessage[], loadError?: string, conversationId?: string | number) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [online, setOnline] = useState(!loadError);
  const [error, setError] = useState(loadError ?? '');
  const [sending, setSending] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  const resync = useCallback(async () => {
    const r = await refreshMessagesAction();
    if (r.messages) setMessages(r.messages);
  }, []);

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
      // Dipanggil ulang di setiap (re)connect, jadi token selalu segar.
      auth: (cb) => {
        getSocketTokenAction()
          .then((r) => cb({ token: r.token ?? '' }))
          .catch(() => cb({ token: '' }));
      },
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      socket.emit(CHAT_EVENTS.join, roomId); // join dulu, baru resync agar tak ada celah
      setOnline(true);
      setError('');
      resync();
    });
    socket.on('disconnect', () => setOnline(false));
    socket.on('connect_error', () => setOnline(false));

    socket.on(CHAT_EVENTS.new, (msg: ChatMessage) => {
      if (String(msg.conversationId) === roomId) setMessages((m) => appendUnique(m, msg));
    });

    // Saat tab kembali aktif, segarkan sekali (mis. status "Dibaca admin"). Bukan polling.
    const onVisible = () => {
      if (document.visibilityState === 'visible' && socket.connected) resync();
    };
    document.addEventListener('visibilitychange', onVisible);

    return () => {
      document.removeEventListener('visibilitychange', onVisible);
      socket.removeAllListeners();
      socket.disconnect();
      socketRef.current = null;
    };
  }, [conversationId, resync]);

  /** Mengembalikan true jika pesan berhasil terkirim. */
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
        // Fallback: socket putus -> kirim via server (membuka koneksi singkat)
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