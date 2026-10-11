import React from 'react';
import { ArrowRight, Check, Factory, Info, PencilRuler, SlidersHorizontal } from 'lucide-react';
import { PageContainer } from '@/components/layout/page-header';
import { Breadcrumb } from '@/components/layout/breadcrumb';
import { ButtonLink } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CUSTOM_MIN_QUANTITY, STANDARD_PACKAGE } from '../data';

const STANDARD_FEATURES = [
  'Pola ergonomis teruji TK/SD/SMP/SMA',
  'Harga pasti per stel (fixed tier)',
  'Form pengisian ukuran mandiri (roster kolektif)',
  'Termasuk aksesori dasar: epolet, celana/rok & topi shako',
];

const CUSTOM_FEATURES = [
  'Desain 100% baru, sulaman benang emas kordon',
  'Konsultasi Penawaran Resmi & sketsa 3D konsep',
  'Prototipe sampel fisik dikirim sebelum jahit massal',
  'Tahapan termin fleksibel & uji kelayakan pasca-produksi',
];

const COMPARISON = [
  ['Kuantitas Minimum', 'Sesuai Roster Siswa', `${CUSTOM_MIN_QUANTITY} Stel atau Sesuai Kesepakatan`],
  ['Penyesuaian Desain', 'Pilihan Variasi Warna & Emblem Sekolah', '100% Desain Baru & Sketsa Bebas Tak Terbatas'],
  ['Waktu Produksi', STANDARD_PACKAGE.duration, '30 - 45 Hari Kerja'],
  ['Sampel Awal', 'Spesifikasi Digital / Mockup 2D', 'Prototipe Sampel Fisik Dikirim'],
  ['Jenis Bordir', 'Bordir Komputer Standar', 'Sulaman Benang Emas Kordon & Lencana Timbul 3D'],
  ['Saluran Konsultasi', 'Panduan Pengukuran Mandiri & CS Operasional', 'Obrolan Langsung Master Tailor & Pendampingan Desain'],
  ['Garansi & Permak', `Garansi Jahitan ${STANDARD_PACKAGE.warranty}`, 'Garansi Pas & Permak Khusus Tanpa Biaya Tambahan'],
];

export function PackageSelectView() {
  return (
    <PageContainer>
      <div className="mx-auto max-w-[964px]">
        <Breadcrumb items={[{ label: 'Pilih Paket Pemesanan' }]} />

        <header className="pb-12 pt-8">
          <Badge pill icon={<Factory className="size-3.5" aria-hidden="true" />}>
            PROTOKOL MANUFAKTUR & PENGADAAN SERAGAM
          </Badge>
          <h1 className="pt-3 text-3xl font-extrabold tracking-tight text-ink sm:text-[32px]">Pilih Jalur & Paket Pemesanan Seragam</h1>
          <p className="max-w-2xl pt-2 text-base leading-relaxed text-ink-soft">
            Tentukan jalur produksi seragam sekolah atau marching band: Paket Standar Katalog atau Paket Kustom Adibusana / Bespoke
          </p>
        </header>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <PackageCard
            badge={<Badge pill>PO CEPAT & HEMAT BIAYA</Badge>}
            icon={<SlidersHorizontal className="size-5 text-muted" aria-hidden="true" />}
            title={STANDARD_PACKAGE.name}
            description="Harga pasti per siswa dengan pola ergonomis standar dan pilihan kain teruji. Proses jahit borongan yang efisien, pengerjaan cepat dan terstandardisasi."
            featuresTitle="Parameter Produksi Termasuk"
            features={STANDARD_FEATURES}
            checkClass="border-primary text-primary"
            duration={STANDARD_PACKAGE.duration}
            tier="Katalog Standar"
            price="Harga sesuai kuantitas roster"
            cta={
              <ButtonLink href="/order/standard" size="lg" fullWidth>
                Pilih Paket Standar & Isi Roster <ArrowRight className="size-4" aria-hidden="true" />
              </ButtonLink>
            }
          />
          <PackageCard
            highlighted
            badge={<Badge pill tone="gold">EKSKLUSIF 1 SEKOLAH 1 DESAIN</Badge>}
            icon={<PencilRuler className="size-5 text-primary" aria-hidden="true" />}
            title="Paket Kustom Adibusana (Bespoke)"
            description="Desain 100% baru dan eksklusif, sulaman benang emas kordon bordir timbul, kostum mayoret/field commander bertema mandiri. Memerlukan konsultasi resmi bersama penjahit utama."
            featuresTitle="Kapabilitas Adibusana Bespoke"
            features={CUSTOM_FEATURES}
            checkClass="border-gold text-gold-dark"
            duration="30 - 45 Hari Kerja"
            tier="Adibusana Atelier"
            price="Konsultasi Penawaran Resmi"
            cta={
              <ButtonLink href="/order/custom" variant="outline" size="lg" fullWidth className="!border-2 !border-primary">
                Ajukan Konsultasi Kustom Bespoke <ArrowRight className="size-4" aria-hidden="true" />
              </ButtonLink>
            }
          />
        </div>

        <section className="mt-8 rounded-2xl bg-surface p-6 shadow-card ring-1 ring-line" aria-labelledby="matrix-title">
          <div className="flex items-center justify-between gap-3 border-b border-line pb-4">
            <h2 id="matrix-title" className="text-sm font-bold uppercase tracking-wide text-primary">
              Matriks Perbandingan Jalur Produksi
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-[13px]">
              <thead>
                <tr className="border-b border-line text-sm font-bold text-primary">
                  <th className="py-4 pr-4">Parameter Pengerjaan</th>
                  <th className="py-4 pr-4">{STANDARD_PACKAGE.name}</th>
                  <th className="py-4">Paket Kustom Adibusana</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map(([param, standard, custom], i) => (
                  <tr key={param} className={`border-b border-line last:border-0 ${i % 2 === 1 ? 'bg-beige-soft/60' : ''}`}>
                    <th scope="row" className="py-3 pr-4 font-bold text-ink">
                      {param}
                    </th>
                    <td className="py-3 pr-4 text-ink-soft">{standard}</td>
                    <td className="py-3 text-primary">{custom}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <aside className="mt-8 flex flex-col gap-4 rounded-2xl bg-surface p-5 shadow-card ring-1 ring-line sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-beige-soft text-primary">
              <Info className="size-5" aria-hidden="true" />
            </span>
            <p className="text-sm leading-relaxed text-ink-soft">
              Butuh seragam atau alat mendadak? Lihat Katalog Sewa Kilat drum band, seragam kejuaraan, dan perlengkapan bendera.
            </p>
          </div>
          <ButtonLink href="/rental" variant="outline" className="shrink-0 !border-2 !border-primary">
            Lihat Katalog Sewa Kilat <ArrowRight className="size-4" aria-hidden="true" />
          </ButtonLink>
        </aside>
      </div>
    </PageContainer>
  );
}

function PackageCard({
  highlighted = false,
  badge,
  icon,
  title,
  description,
  featuresTitle,
  features,
  checkClass,
  duration,
  tier,
  price,
  cta,
}: {
  highlighted?: boolean;
  badge: React.ReactNode;
  icon: React.ReactNode;
  title: string;
  description: string;
  featuresTitle: string;
  features: string[];
  checkClass: string;
  duration: string;
  tier: string;
  price: string;
  cta: React.ReactNode;
}) {
  return (
    <article
      className={`flex flex-col rounded-2xl bg-surface p-5 shadow-card ${highlighted ? 'ring-2 ring-beige' : 'ring-1 ring-line'}`}
    >
      <div className="flex items-start justify-between">
        {badge}
        {icon}
      </div>
      <h2 className="border-b border-line pb-3 pt-5 text-xl font-bold text-ink">{title}</h2>
      <p className="pt-4 text-sm leading-6 text-ink-soft">{description}</p>
      <h3 className="pt-6 text-xs font-bold uppercase tracking-wide text-primary">{featuresTitle}</h3>
      <ul className="flex flex-col gap-2 pt-2">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2.5 text-sm text-ink-soft">
            <span className={`mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-sm border ${checkClass}`}>
              <Check className="size-3" strokeWidth={3} aria-hidden="true" />
            </span>
            {f}
          </li>
        ))}
      </ul>
      <div className="mt-6 flex flex-wrap items-center justify-between gap-2 rounded-lg bg-beige-soft px-3.5 py-3">
        <span className="text-xs font-bold uppercase text-ink-soft">Waktu Kerja: {duration}</span>
        <span className="rounded border border-line bg-surface px-2 py-0.5 text-[11px] font-bold uppercase text-primary">Tier: {tier}</span>
      </div>
      <div className="mt-auto border-t border-line pt-5">
        <p className="mt-0 text-xs font-medium uppercase text-muted">Dasar Harga</p>
        <p className="pb-4 pt-1 text-xl font-extrabold text-primary">{price}</p>
        {cta}
      </div>
    </article>
  );
}
