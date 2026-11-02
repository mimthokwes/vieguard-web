import React from 'react';
import { ClipboardList, ShieldCheck, Sparkles, SprayCan, Truck } from 'lucide-react';

const PROTOCOLS = [
  {
    icon: SprayCan,
    title: 'Sterilisasi Uap 100°C',
    body: 'Pencucian higienis dan setrika uap sebelum dikemas rapi.',
  },
  {
    icon: ClipboardList,
    title: 'Opsi Bebas Deposit',
    body: 'Institusi resmi dapat menggunakan SPK / Rekomendasi Kepala Sekolah.',
  },
  {
    icon: Truck,
    title: 'Tiba H-2 Acara',
    body: 'Pengiriman 48 jam sebelum hari H untuk kemudahan fitting dan pengecekan.',
  },
];

/** "Jaminan & Protokol Sewa Resmi" block on the rental catalog (Figma screen 12). */
export function RentalGuarantees() {
  return (
    <section id="kebijakan" className="scroll-mt-28 rounded-2xl bg-surface p-6 shadow-card ring-1 ring-line">
      <div className="flex flex-col gap-3 border-b border-line pb-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-ink">Jaminan & Standar Sewa</h2>
          <p className="pt-0.5 text-xs text-ink-soft">Standar resmi untuk sekolah, yayasan, dan instansi orkes drum.</p>
        </div>
        <span className="flex w-fit shrink-0 items-center gap-1.5 rounded-md border border-beige bg-beige-soft px-2.5 py-1 text-xs font-bold uppercase text-primary">
          <ShieldCheck className="size-3.5" aria-hidden="true" /> Armada Terverifikasi
        </span>
      </div>
      <div className="grid grid-cols-1 gap-5 pt-5 md:grid-cols-3">
        {PROTOCOLS.map(({ icon: Icon, title, body }) => (
          <div key={title} className="rounded-xl bg-beige-soft/70 p-4 ring-1 ring-beige">
            <p className="flex items-center gap-2 font-bold text-sm text-ink">
              <Icon className="size-4 text-primary" aria-hidden="true" /> {title}
            </p>
            <p className="pt-1.5 text-xs leading-relaxed text-ink-soft">{body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

const PURCHASE_PROTOCOLS = [
  {
    icon: Sparkles,
    title: 'Pre-Order Presisi',
    body: 'Dibuat baru sesuai pesanan, ukuran presisi, dan kondisi 100% baru.',
  },
  {
    icon: ShieldCheck,
    title: 'Bahan Premium',
    body: 'Kain Drill & High Twist berkualitas dengan jahitan dan bordir rapi.',
  },
  {
    icon: Truck,
    title: 'Kirim Tepat Waktu',
    body: 'Jadwal pengerjaan terencana dan siap kirim ke seluruh Indonesia.',
  },
];

/** "Jaminan & Alur Pre-Order Pembelian" block on the purchase catalog. */
export function PurchaseGuarantees() {
  return (
    <section className="scroll-mt-28 rounded-2xl bg-surface p-6 shadow-card ring-1 ring-line">
      <div className="flex flex-col gap-3 border-b border-line pb-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-ink">Jaminan Kualitas Pre-Order</h2>
          <p className="pt-0.5 text-xs text-ink-soft">
            Standar pengerjaan seragam untuk institusi sekolah dan marching band.
          </p>
        </div>
        <span className="flex w-fit shrink-0 items-center gap-1.5 rounded-md border border-beige bg-beige-soft px-2.5 py-1 text-xs font-bold uppercase text-primary">
          <ShieldCheck className="size-3.5" aria-hidden="true" /> Garansi Jahitan Rapi
        </span>
      </div>
      <div className="grid grid-cols-1 gap-5 pt-5 md:grid-cols-3">
        {PURCHASE_PROTOCOLS.map(({ icon: Icon, title, body }) => (
          <div key={title} className="rounded-xl bg-beige-soft/70 p-5 ring-1 ring-beige">
            <p className="flex items-center gap-2 font-bold text-ink">
              <Icon className="size-4 text-primary" aria-hidden="true" /> {title}
            </p>
            <p className="pt-2 text-sm leading-relaxed text-ink-soft">{body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
