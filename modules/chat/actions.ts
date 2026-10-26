"use server";

import { getConversationMessages, getMyConversation, sendChatMessage, getChatSocketToken } from '@/lib/api/chat-api';
import { ChatMessage } from '@/types/chat';

// The conversation id always comes from the session's own conversation, never from the client,
// so a customer can only read or post to their own thread.

export async function refreshMessagesAction(): Promise<{ messages?: ChatMessage[]; error?: string }> {
  try {
    const conversation = await getMyConversation();
    return { messages: await getConversationMessages(conversation.id) };
  } catch (error) {
    return { error: (error as Error).message };
  }
}

export async function sendMessageAction(text: string): Promise<{ message?: ChatMessage; error?: string }> {
  const messageText = text.trim();
  if (!messageText) return { error: 'Pesan tidak boleh kosong.' };
  if (messageText.length > 2000) return { error: 'Pesan maksimal 2000 karakter.' };
  try {
    const conversation = await getMyConversation();
    return { message: await sendChatMessage(conversation.id, messageText) };
  } catch (error) {
    return { error: (error as Error).message };
  }
}

export async function getSocketTokenAction(): Promise<{ token?: string; error?: string }> {
  try {
    return { token: await getChatSocketToken() };
  } catch (error) {
    return { error: (error as Error).message };
  }
}