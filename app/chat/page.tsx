import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/session';

import { getConversationMessages, getMyConversation } from '@/modules/chat/services/chat-service';
import { getMyOrders } from '@/modules/orders/services/orders-service';
import { getStoreProfile } from '@/modules/home/services/store-service';

import { orderTitle } from '@/lib/order-status';
import { ChatView } from '@/modules/chat/views/chat-view';
import { ChatMessage, Conversation } from '@/types/chat';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Obrolan & Konsultasi | VIEGUARD',
  description: 'Konsultasikan ukuran, desain, sewa, dan status pesanan langsung dengan admin dan penjahit VIEGUARD.',
};

interface ChatPageProps {
  searchParams: Promise<{ topic?: string; product?: string }>;
}

export default async function ChatPage({ searchParams }: ChatPageProps) {
  const user = await getSessionUser();
  if (!user) redirect('/login?next=/chat');

  const { topic, product } = await searchParams;
  let conversation: Conversation | null = null;
  let messages: ChatMessage[] = [];
  let loadError: string | undefined;
  try {
    conversation = await getMyConversation();
    messages = await getConversationMessages(String(conversation.id));
  } catch (error) {
    loadError = `Gagal memuat obrolan: ${(error as Error).message}`;
  }

  const [{ orders }, store] = await Promise.all([getMyOrders(), getStoreProfile()]);
  const orderRefs = orders
    .filter((o) => o.status !== 'selesai' && o.status !== 'dibatalkan')
    .map((o) => ({ id: o.id, orderNumber: o.orderNumber, label: orderTitle(o) }));

  return (
    <ChatView
      conversationId={conversation?.id}
      initialMessages={messages}
      userName={user.name}
      topic={(topic ?? product)?.slice(0, 120)}
      orderRefs={orderRefs}
      operationalHours={store?.operationalHours}
      loadError={loadError}
    />
  );
}