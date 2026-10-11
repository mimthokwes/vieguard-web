import type { Metadata } from 'next';
import { Playfair_Display, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { getSessionUser } from '@/lib/session';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  weight: ['600', '700', '800'],
  display: 'swap',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'VIEGUARD | Boutique & Rental Busana Desainer Premium',
  description: 'Destinasi terpercaya kurasi busana desainer dan platform rental gaun & jas premium di Indonesia.',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getSessionUser();

  return (
    <html lang="id" className={`${playfair.variable} ${jakarta.variable}`}>
      <body className="font-sans bg-[#FAF7F2] text-[#1C1C1C] min-h-screen flex flex-col antialiased items-center">
        <Navbar user={user} cartCount={2} />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
