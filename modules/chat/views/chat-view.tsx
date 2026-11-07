"use client";

import { useEffect } from 'react';
import { ChatMessage } from '@/types/chat';
import { ChatComposer } from '../components/chat-composer';
import { ChatHeader } from '../components/chat-header';
import { ChatMessageList } from '../components/chat-message-list';
import { DEFAULT_OPERATIONAL_HOURS } from '../constants/chat-topics';
import { useChatMessages } from '../hooks/use-chat-messages';

interface ChatViewProps {
  conversationId?: string | number;
  initialMessages: ChatMessage[];
  userName: string;
  topic?: string;
  orderRefs: { id: string; orderNumber: string; label: string }[];
  operationalHours?: string | null;
  loadError?: string;
}

export function ChatView({
  conversationId,
  initialMessages,
  userName,
  topic,
  orderRefs,
  operationalHours,
  loadError,
}: ChatViewProps) {
  // conversationId is required: without it the hook never opens the socket.
  const { messages, online, error, sending, send } = useChatMessages(
    initialMessages,
    loadError,
    conversationId,
  );

  const adminName = 'Admin';

  useEffect(() => {
    // Lock outer body scroll on chat page so only message list scrolls
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  return (
    <main className="relative flex flex-1 w-full flex-col h-[calc(100dvh-4rem)] sm:h-[calc(100dvh-4.25rem)] bg-surface overflow-hidden">
      <ChatHeader
        adminName={adminName}
        online={online}
        topic={topic}
        operationalHours={operationalHours || DEFAULT_OPERATIONAL_HOURS}
      />
      <ChatMessageList messages={messages} userName={userName} adminName={adminName} />
      <ChatComposer
        initialText={topic ? `[${topic}] ` : ''}
        error={error}
        sending={sending}
        orderRefs={orderRefs}
        onSend={send}
      />
    </main>
  );
}
