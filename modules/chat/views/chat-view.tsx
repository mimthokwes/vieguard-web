"use client";

import { ChatMessage, Conversation } from '@/types/chat';
import { ChatComposer } from '../components/chat-composer';
import { ChatHeader } from '../components/chat-header';
import { ChatMessageList } from '../components/chat-message-list';
import { DEFAULT_OPERATIONAL_HOURS } from '../constants/chat-topics';
import { useChatMessages } from '../hooks/use-chat-messages';

interface ChatViewProps {
  initialMessages: ChatMessage[];
  userName: string;
  topic?: string;
  orderRefs: { id: string; orderNumber: string; label: string }[];
  operationalHours?: string | null;
  loadError?: string;
}

export function ChatView({  initialMessages, userName, topic, orderRefs, operationalHours, loadError }: ChatViewProps) {
  const { messages, online, error, sending, send } = useChatMessages(initialMessages, loadError);

  const adminName = 'Admin';

  return (
  <main className="flex w-full flex-col px-4 sm:px-6 lg:h-[calc(100dvh-2rem)] lg:px-8">

    {/* Mobile: tinggi tetap 85dvh (min 560px), halaman memanjang.
        Desktop (lg): kembali mengisi sisa tinggi layar. */}
    <section className="mt-4 flex h-[85dvh] min-h-140 flex-col overflow-hidden rounded-2xl bg-surface shadow-card ring-1 ring-line lg:h-auto lg:min-h-96 lg:flex-1">
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
    </section>
  </main>
);
}