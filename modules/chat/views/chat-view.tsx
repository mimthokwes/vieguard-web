'use client';

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
  initialIsBotActive?: boolean;
}

export function ChatView({
  conversationId,
  initialMessages,
  userName,
  topic,
  orderRefs,
  operationalHours,
  loadError,
  initialIsBotActive = true,
}: ChatViewProps) {
  // conversationId is required: without it the hook never opens the socket.
  const { messages, online, error, sending, send, isBotActive, togglingBot, toggleBot } = useChatMessages(
    initialMessages,
    loadError,
    conversationId,
    initialIsBotActive,
  );

  const adminName = 'CS Vieguard';

  return (
    <main className="relative flex min-h-[calc(100dvh-4.25rem)] flex-1 w-full flex-col bg-surface pt-2.5 sm:pt-3 md:pt-0">
      <ChatHeader
        adminName={adminName}
        online={online}
        topic={topic}
        operationalHours={operationalHours || DEFAULT_OPERATIONAL_HOURS}
        isBotActive={isBotActive}
        togglingBot={togglingBot}
        onToggleBot={toggleBot}
      />
      <ChatMessageList messages={messages} userName={userName} adminName={adminName} />
      <ChatComposer initialText={topic ? `[${topic}] ` : ''} error={error} sending={sending} orderRefs={orderRefs} onSend={send} />
    </main>
  );
}
