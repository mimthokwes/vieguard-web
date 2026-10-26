import "server-only";
import { io } from 'socket.io-client';
import { apiClient, ApiError } from '../api-client';
import { getSessionToken } from '../session';
import { ChatMessage, Conversation } from '@/types/chat';

const apiOrigin = () => new URL(process.env.API_URL || 'http://localhost:5000/api/v0/website').origin;

async function requireToken() {
  const token = await getSessionToken();
  if (!token) throw new ApiError('Silakan masuk terlebih dahulu.', 401);
  return token;
}

/** The backend keeps one conversation per customer; this returns (or creates) it. */
export async function getMyConversation(): Promise<Conversation> {
  return apiClient<Conversation>('/chat/conversations', { method: 'POST', token: await requireToken() });
}

export async function getConversationMessages(conversationId: string): Promise<ChatMessage[]> {
  return (await apiClient<ChatMessage[]>(`/chat/conversations/${conversationId}/messages`, { token: await requireToken(), cache: 'no-store' })) || [];
}

/**
 * The website API only accepts new messages over Socket.IO. Sending from the server keeps the
 * access token in its httpOnly cookie instead of handing it to browser JavaScript.
 */
export async function sendChatMessage(conversationId: string, messageText: string): Promise<ChatMessage> {
  const token = await requireToken();
  const socket = io(`${apiOrigin()}/ws/website`, {
    auth: { token },
    transports: ['websocket'],
    reconnection: false,
    timeout: 5000,
  });

  try {
    return await new Promise<ChatMessage>((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('Server chat tidak merespons. Coba lagi.')), 8000);
      socket.on('connect_error', (err) => {
        clearTimeout(timer);
        reject(new Error(err.message.includes('Authentication') ? 'Sesi chat tidak valid. Silakan masuk ulang.' : 'Gagal terhubung ke server chat.'));
      });
      socket.on('message:new', (message: ChatMessage) => {
        if (String(message.conversationId) === conversationId && message.senderType === 'user' && message.messageText === messageText) {
          clearTimeout(timer);
          resolve(message);
        }
      });
      socket.on('connect', () => {
        socket.emit('conversation:join', conversationId);
        socket.emit('message:send', { conversationId, messageText });
      });
    });
  } finally {
    socket.disconnect();
  }
}

/** Token untuk handshake Socket.IO dari browser. */
export async function getChatSocketToken() {
  return requireToken();
}