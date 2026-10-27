import React from 'react';
import Link from 'next/link';
import { Clock, Mail, MapPin, Phone } from 'lucide-react';
import { StoreProfile } from '@/types/store';
import { Logo } from './logo';

const SERVICE_LINKS = [
  { label: 'Katalog Produk', href: '/catalog' },
  { label: 'Pesan Jahit Seragam', href: '/order' },
  { label: 'Penyewaan Busana', href: '/rental' },
  { label: 'Galeri Portofolio', href: '/portfolio' },
];

const HELP_LINKS = [
  { label: 'Status Pesanan & Sewa', href: '/orders' },
  { label: 'Pusat Konsultasi Desain', href: '/chat' },
  { label: 'Kebijakan Penyewaan', href: '/rental#kebijakan' },
  { label: 'Syarat & Ketentuan', href: '/register' },
];

export function Footer({ store }: { store?: StoreProfile | null }) {
  const year = new Date().getFullYear();
  const storeName = store?.storeName || 'VIEGUARD';
  const phone = store?.whatsappNumber || store?.phone;

  return (
    <footer className="mt-4 w-full bg-maroon-gradient text-white">
      <div className="mx-auto max-w-7xl px-4 pt-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 pb-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          <div className="flex flex-col gap-4">
            <Logo inverted />
            <p className="text-sm leading-5.75 text-white/75">
              {store?.description ||
                'Solusi pengadaan dan penjahitan seragam profesional serta layanan penyewaan busana berkualitas tinggi dengan standar pengerjaan terpercaya.'}
            </p>
          </div>

          <FooterColumn title="Layanan" links={SERVICE_LINKS} />
          <FooterColumn title="Bantuan & Info" links={HELP_LINKS} />

          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-bold uppercase tracking-wider">Hubungi Kami</h3>
            <ul className="flex flex-col gap-3 text-sm text-white/75">
              {store?.email && (
                <li className="flex items-center gap-2.5">
                  <Mail className="size-4 shrink-0 text-gold-light" aria-hidden="true" />
                  <a href={`mailto:${store.email}`} className="hover:text-white">
                    {store.email}
                  </a>
                </li>
              )}
              {phone && (
                <li className="flex items-center gap-2.5">
                  <Phone className="size-4 shrink-0 text-gold-light" aria-hidden="true" />
                  <span>{phone}</span>
                </li>
              )}
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 size-4 shrink-0 text-gold-light" aria-hidden="true" />
                <span>{store?.address || 'Indonesia'}</span>
              </li>
              {store?.operationalHours && (
                <li className="flex items-center gap-2.5">
                  <Clock className="size-4 shrink-0 text-gold-light" aria-hidden="true" />
                  <span>{store.operationalHours}</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-white/10 py-5 text-xs text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {storeName}. Hak Cipta Dilindungi.
          </p>
          <p>Dibuat untuk profesionalisme dan efisiensi manajemen garmen.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-sm font-bold uppercase tracking-wider">{title}</h3>
      <ul className="flex flex-col gap-3">
        {links.map((link) => (
          <li key={link.label}>
            <Link href={link.href} className="text-sm text-white/75 transition-colors hover:text-gold-light">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
