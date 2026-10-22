import { ButtonLink } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';

// TODO: ganti dengan nomor WhatsApp asli (format internasional tanpa +).
const WHATSAPP_URL = 'https://wa.me/6281234567890?text=Halo%20VIEGUARD%2C%20saya%20ingin%20konsultasi%20seragam';

export function ConsultationBanner() {
  return (
    <section
      aria-labelledby="konsultasi-title"
      className="flex flex-col gap-4 rounded-xl border border-beige bg-beige-soft px-6 py-5 sm:flex-row sm:items-center sm:justify-between"
    >
      <div>
        <h2 id="konsultasi-title" className="text-lg font-bold text-ink">Butuh desain khusus?</h2>
        <p className="text-sm text-ink-soft">
          Ceritakan kebutuhan sekolah atau tim Anda, kami bantu dari pengukuran sampai pengiriman.
        </p>
      </div>
      <ButtonLink href={WHATSAPP_URL} variant="dark">
        <MessageCircle className="size-4" aria-hidden="true" />
        Konsultasi lewat WhatsApp
      </ButtonLink>
    </section>
  );
}