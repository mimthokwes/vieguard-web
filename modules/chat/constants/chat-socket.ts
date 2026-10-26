/** Origin server API (tanpa namespace), mis. http://localhost:5000 — isi di .env.local */
export const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL ?? '';

/** Namespace Socket.IO untuk website customer. */
export const SOCKET_NAMESPACE = '/ws/website';

/** Batas tunggu konfirmasi (echo `message:new`) setelah kirim pesan. */
export const SEND_TIMEOUT_MS = 8000;

/** Nama event — harus sama dengan gateway backend. */
export const CHAT_EVENTS = {
  join: 'conversation:join', // client -> server (conversationId)
  send: 'message:send',      // client -> server ({ conversationId, messageText })
  new: 'message:new',        // server -> client (ChatMessage, termasuk echo pesan sendiri)
} as const;