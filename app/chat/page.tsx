import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/session';
import { ChatView } from '@/modules/chat/views/chat-view';

// Render strategy: SSR (Data percakapan privat per pengguna)
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Konsultasi Stylist & Chat | VIEGUARD Boutique & Rental',
  description: 'Konsultasikan kustomisasi ukuran, fitting gaun, dan reservasi koleksi langsung bersama Personal Stylist VIEGUARD.',
};

interface ChatPageProps {
  searchParams: Promise<{ product?: string }>;
}

export default async function ChatPage({ searchParams }: ChatPageProps) {
  const user = await getSessionUser();
  if (!user) {
    redirect('/login');
  }

  const { product } = await searchParams;
  return <ChatView initialProductName={product} />;
}
