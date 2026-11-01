"use client";

import { useQuery } from '@tanstack/react-query';
import { Conversation } from '@/types/chat';
import { getMyConversation } from '../services/chat-service';

/**
 * Fetches and caches the customer's conversation (one per customer).
 * Messages are intentionally NOT cached here: they are real-time data
 * owned by `useChatMessages` (Socket.IO), so caching them would go stale.
 */
export function useChatConversation(initialConversation?: Conversation) {
  const conversationQuery = useQuery<Conversation>({
    queryKey: ['chat', 'conversation'],
    queryFn: () => getMyConversation(),
    initialData: initialConversation,
    staleTime: 5 * 60 * 1000,
  });

  return {
    conversation: conversationQuery.data,
    isLoading: conversationQuery.isLoading,
    isFetching: conversationQuery.isFetching,
    error: conversationQuery.error ? (conversationQuery.error as Error).message : null,
    refetchConversation: conversationQuery.refetch,
  };
}