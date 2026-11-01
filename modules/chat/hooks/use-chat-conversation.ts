"use client";

import { useQuery } from '@tanstack/react-query';
import { Conversation, ChatMessage } from '@/types/chat';
import { getMyConversation, getConversationMessages } from '../services/chat-service';

/**
 * Hook to fetch and cache user chat conversation and history with TanStack Query.
 */
export function useChatConversation(initialConversation?: Conversation) {
  const conversationQuery = useQuery<Conversation>({
    queryKey: ['chat', 'conversation'],
    queryFn: () => getMyConversation(),
    initialData: initialConversation,
    staleTime: 5 * 60 * 1000,
  });

  const conversationId = conversationQuery.data?.id;

  const messagesQuery = useQuery<ChatMessage[]>({
    queryKey: ['chat', 'messages', conversationId],
    queryFn: () => (conversationId ? getConversationMessages(conversationId) : []),
    enabled: !!conversationId,
    staleTime: 30 * 1000,
  });

  return {
    conversation: conversationQuery.data,
    messages: messagesQuery.data || [],
    isLoading: conversationQuery.isLoading || messagesQuery.isLoading,
    isFetching: conversationQuery.isFetching || messagesQuery.isFetching,
    error: conversationQuery.error
      ? (conversationQuery.error as Error).message
      : messagesQuery.error
        ? (messagesQuery.error as Error).message
        : null,
    refetchConversation: conversationQuery.refetch,
    refetchMessages: messagesQuery.refetch,
  };
}
