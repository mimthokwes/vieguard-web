import type { Metadata } from 'next';
import { Cinzel, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { getSessionUser } from '@/lib/session';
import { getStoreProfile } from '@/modules/home/services/store-service';
import { getNotifications } from '@/modules/notifications/services/notification-service';
import { getProfile } from '@/modules/profile/services/profile-service';
import { QueryProvider } from '@/components/providers/query-provider';

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
  let [user, store] = await Promise.all([getSessionUser(), getStoreProfile()]);
  if (user && !user.profilePhoto) {
    try {
      const live = await getProfile();
      if (live?.profilePhoto) {
        user = { ...user, profilePhoto: live.profilePhoto };
      }
    } catch {
      // ignore live fetch errors
    }
  }
  const notifications = user ? await getNotifications() : [];
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <html lang="id" className={`${cinzel.variable} ${jakarta.variable} `}>
      <body className="flex min-h-screen flex-col bg-canvas font-sans text-ink antialiased">
        <QueryProvider>
          <Navbar user={user} unreadCount={unreadCount} />
          <div className="flex flex-1 flex-col">{children}</div>
          <Footer store={store} />
        </QueryProvider>
      </body>
    </html>
  );
}
