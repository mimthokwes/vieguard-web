import type { Metadata } from 'next';
import { Cinzel, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { getSessionUser } from '@/lib/session';
import { getStoreProfile } from '@/lib/api/store-api';
import { getNotifications } from '@/lib/api/notification-api';

const cinzel = Cinzel({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-cinzel',
  display: 'swap',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'VIEGUARD | Penjahitan Seragam Drum Band & Penyewaan Perlengkapan',
  description: 'Penjahitan dan penyewaan perlengkapan acara terbaik.',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [user, store] = await Promise.all([getSessionUser(), getStoreProfile()]);
  const notifications = user ? await getNotifications() : [];
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <html lang="id" className={`${cinzel.variable} ${jakarta.variable} `} >
      <body className="flex min-h-screen flex-col bg-canvas font-sans text-ink antialiased">
        <div className="sticky top-1 z-50 flex items-center justify-center w-full">
          <Navbar user={user} unreadCount={unreadCount} />
        </div>
        <div className="flex-1">{children}</div>
        <Footer store={store} />
      </body>
    </html>
  );
}
