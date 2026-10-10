import React from 'react';
import { ClipboardList, ShieldCheck, SprayCan, Truck } from 'lucide-react';

const PROTOCOLS = [
  {
    icon: SprayCan,
    title: 'Sterilisasi Uap 100°C',
    body: 'Semua seragam melalui pencucian higienis dan setrika uap suhu tinggi sebelum dimasukkan ke garment bag tersegel.',
  },
  {
    icon: ClipboardList,
    title: 'Deposit Fleksibel / SPK Resmi',
    body: 'Institusi pendidikan dapat mengganti uang deposit tunai dengan Surat Perintah Kerja (SPK) atau rekomendasi resmi kepala sekolah.',
  },
  {
    icon: Truck,
    title: 'Pengiriman H-2 Acara',
    body: 'Armada tiba 48 jam sebelum hari gladi resik atau pentas guna memastikan fitting ukuran dan pengecekan fungsi alat.',
  },
];

/** "Jaminan & Protokol Sewa Resmi" block on the rental catalog (Figma screen 12). */
export function RentalGuarantees() {
  return (
    <section id="kebijakan" className="scroll-mt-28 rounded-2xl bg-surface p-6 shadow-card ring-1 ring-line">
      <div className="flex flex-col gap-3 border-b border-line pb-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-ink">Jaminan & Protokol Sewa Resmi</h2>
          <p className="pt-0.5 text-sm text-ink-soft">Standar kepatuhan resmi untuk sekolah, yayasan, instansi kedinasan, dan perkumpulan orkes drum.</p>
        </div>
        <span className="flex w-fit shrink-0 items-center gap-1.5 rounded-md border border-beige bg-beige-soft px-2.5 py-1 text-xs font-bold uppercase text-primary">
          <ShieldCheck className="size-3.5" aria-hidden="true" /> Kebijakan Armada Terverifikasi
        </span>
      </div>
      <div className="grid grid-cols-1 gap-5 pt-5 md:grid-cols-3">
        {PROTOCOLS.map(({ icon: Icon, title, body }) => (
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
