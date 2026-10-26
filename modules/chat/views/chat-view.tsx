"use client";

import { ChatMessage, Conversation } from '@/types/chat';
import { Breadcrumb } from '@/components/layout/breadcrumb';
import { ChatComposer } from '../components/chat-composer';
import { ChatHeader } from '../components/chat-header';
import { ChatMessageList } from '../components/chat-message-list';
import { DEFAULT_OPERATIONAL_HOURS } from '../constants/chat-topics';
import { useChatMessages } from '../hooks/use-chat-messages';

interface ChatViewProps {
  conversation: Conversation | null;
  initialMessages: ChatMessage[];
  userName: string;
  topic?: string;
  orderRefs: { id: string; orderNumber: string; label: string }[];
  operationalHours?: string | null;
  loadError?: string;
}

export function ChatView({ conversation, initialMessages, userName, topic, orderRefs, operationalHours, loadError }: ChatViewProps) {
  const { messages, online, error, sending, send } = useChatMessages(initialMessages, loadError, conversation?.id);

  const adminName = conversation?.admin?.name ?? 'Tim Admin VIEGUARD';

  return (
    <main className="flex h-[calc(100dvh-4rem)] w-full flex-col px-4 py-4 sm:px-6 lg:px-8">
      <Breadcrumb items={[{ label: 'Obrolan & Konsultasi' }]} />

      {/* Card mengisi sisa tinggi layar; ubah 4rem di <main> sesuai tinggi navbar Anda */}
      <section className="mt-4 flex min-h-96 flex-1 flex-col overflow-hidden rounded-2xl bg-surface shadow-card ring-1 ring-line">
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
          disabled={!conversation}
          orderRefs={orderRefs}
          onSend={send}
        />
      </section>
    </main>
  );
}