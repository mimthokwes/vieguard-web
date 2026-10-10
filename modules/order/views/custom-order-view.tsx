"use client";

import React, { useActionState, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Award, Download, Headset, Link2, Lock, MessageSquare, Palette, PencilRuler, Ruler, Send, ShieldCheck, TrendingUp, UploadCloud } from 'lucide-react';
import { PageContainer } from '@/components/layout/page-header';
import { Breadcrumb } from '@/components/layout/breadcrumb';
import { buttonClasses } from '@/components/ui/button';
import { Input, Select, Textarea } from '@/components/ui/input';
import { ErrorMessage } from '@/components/ui/error-message';
import { SubmitButton } from '@/components/ui/submit-button';
import { downloadRosterTemplate } from '@/lib/roster/roster';
import { OrderActionState, submitCustomOrder } from '../actions';
import { CUSTOM_MIN_QUANTITY, JENJANG_OPTIONS } from '../data';

const PROCEDURE = [
  { title: 'Unggah Formulir & Sketsa', body: 'Tim kurasi meneliti kelayakan bahan, kombinasi warna, dan ornamen bordir.' },
  { title: 'Tinjauan Pola oleh Master Tailor', body: 'Analisis struktur kain dan potongan jas memakan waktu 1–2 hari kerja.' },
  { title: 'Draf Penawaran Resmi & Sketsa 3D', body: 'Penerbitan rincian biaya per stel lengkap dengan visualisasi digital rendering.' },
  { title: 'Pembuatan Sampel Fisik Prototipe', body: 'Pengerjaan 1 stel master contoh uji pakai sebelum produksi serentak dimulai.' },
];

const initialState: OrderActionState = {};

interface CustomOrderViewProps {
  accessories: { name: string; description?: string | null }[];
}

export function CustomOrderView({ accessories }: CustomOrderViewProps) {
  const [state, formAction] = useActionState(submitCustomOrder, initialState);
  const [description, setDescription] = useState('');
  const err = state.fieldErrors ?? {};

  return (
    <PageContainer>
      <Breadcrumb items={[{ label: 'Pilih Paket', href: '/order' }, { label: 'Formulir Paket Kustom Adibusana' }]} />

      <header className="flex flex-col gap-6 py-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-beige-soft px-4 py-1.5 text-sm font-semibold uppercase tracking-wide text-primary">
            <Palette className="size-4" aria-hidden="true" /> Layanan Masterpiece Atelier
          </span>
          <h1 className="pt-4 text-2xl font-bold text-primary sm:text-3xl">Formulir Pemesanan Paket Kustom (Bespoke Atelier)</h1>
          <p className="pt-2 text-base leading-relaxed text-ink-soft">
            Pengajuan rancangan seragam drum band & marching band eksklusif dengan desain baru, bordir sulam timbul, dan konsultasi privat master tailor.
          </p>
        </div>
        <div className="flex items-center gap-3 rounded-2xl bg-surface px-5 py-3.5 shadow-card ring-1 ring-line">
          <span className="flex size-10 items-center justify-center rounded-full bg-beige-soft text-primary">
            <Award className="size-5" aria-hidden="true" />
          </span>
          <div>
            <p className="font-semibold text-ink">Kualitas Konfeksi Grade A</p>
            <p className="text-sm text-ink-soft">Garansi Presisi Pola 100%</p>
          </div>
        </div>
      </header>

      <form action={formAction} className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_390px]">
        <div className="flex flex-col gap-6">
          {/* 01 Design reference */}
          <NumberedSection n="01" title="Sketsa / Gambar Referensi Desain" subtitle="Kirimkan visualisasi ide, mockup corel, foto referensi, atau pola corak" badge="Opsional">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div className="flex flex-col items-center justify-center rounded-xl bg-beige-soft p-6 text-center">
                <span className="flex size-14 items-center justify-center rounded-full bg-beige text-primary">
                  <UploadCloud className="size-6" aria-hidden="true" />
                </span>
                <p className="pt-4 font-semibold text-ink">Tautkan File Referensi Desain</p>
                <p className="pt-1 text-sm text-ink-soft">Unggah sketsa ke Google Drive / Dropbox, lalu tempel tautannya di bawah.</p>
                <div className="w-full pt-4 text-left">
                  <Input
                    name="designReference"
                    type="url"
                    aria-label="Tautan referensi desain"
                    placeholder="https://drive.google.com/..."
                    leftIcon={<Link2 className="size-4" />}
                    error={err.designReference}
                  />
                </div>
                <Link href="/chat?topic=Kirim%20sketsa%20desain%20kustom" className="pt-3 text-sm font-semibold text-primary hover:underline">
                  atau kirim file langsung lewat Obrolan
                </Link>
              </div>
              <figure className="relative min-h-[228px] overflow-hidden rounded-xl bg-beige-soft">
                <figcaption className="absolute inset-x-0 top-0 z-10 flex items-center justify-between bg-beige-soft/95 px-3 py-2.5 text-sm text-ink-soft">
                  Contoh Referensi Konsep
                </figcaption>
                <Image src="/images/portfolio/project-3.webp" alt="Contoh desain konsep atelier" fill sizes="(min-width: 768px) 300px, 100vw" className="object-cover" />
                <span className="absolute inset-x-0 bottom-0 z-10 flex items-center gap-2 bg-gradient-to-t from-black/70 to-transparent px-3 pb-3 pt-8 text-sm text-white">
                  <PencilRuler className="size-4" aria-hidden="true" /> Contoh Desain Konsep Atelier
                </span>
              </figure>
            </div>
          </NumberedSection>

          {/* 02 Description */}
          <NumberedSection n="02" title="Catatan Instruksi & Konsep Desain" subtitle="Jelaskan secara spesifik preferensi potongan, jahitan, dan identitas kontingen">
            <Textarea
              label="Deskripsi Detail & Filosofi Kostum"
              name="description"
              rows={4}
              required
              maxLength={1000}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Deskripsikan tema warna kustom, gaya potongan jas tunic, ornamen bordir kordon emas, jenis kerah mandarin, belahan belakang, atau aksen monogram logo instansi..."
              error={err.description}
            />
            <div className="flex justify-between pt-2 text-sm text-ink-soft">
              <span>Sertakan detail kode warna Pantone jika ada</span>
              <span>{description.length} / 1000 karakter</span>
            </div>
          </NumberedSection>

          {/* 03 Accessories */}
          <NumberedSection n="03" title="Pilihan Aksesoris Tambahan" subtitle="Lengkapi setelan seragam dengan ornamen pelengkap berkualitas panggung">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {accessories.map((a) => (
                <label key={a.name} className="flex cursor-pointer gap-3 rounded-xl bg-beige-soft p-5 transition-colors hover:bg-beige has-[:checked]:ring-2 has-[:checked]:ring-primary">
                  <input type="checkbox" name="accessories" value={a.name} className="mt-1 size-4 shrink-0 accent-primary" />
                  <span>
                    <span className="block text-ink">{a.name}</span>
                    {a.description && <span className="block pt-1 text-sm leading-6 text-ink-soft">{a.description}</span>}
                  </span>
                </label>
              ))}
            </div>
          </NumberedSection>

          {/* 04 Quantity & schedule */}
          <NumberedSection n="04" title="Kuantitas, Instansi & Target Penyelesaian" subtitle="Alokasikan waktu produksi atelier dan tentukan tenggat waktu acara">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <Input label="Nama Instansi / Sekolah" name="institution" required placeholder="Contoh: SMA Taruna Cendekia" error={err.institution} />
              <Select label="Jenjang" name="jenjang" defaultValue="">
                <option value="">Pilih jenjang (opsional)</option>
                {JENJANG_OPTIONS.map((j) => (
                  <option key={j.value} value={j.value}>
                    {j.label}
                  </option>
                ))}
              </Select>
              <Input
                label="Estimasi Kebutuhan Jumlah Stel"
                name="quantity"
                type="number"
                min={CUSTOM_MIN_QUANTITY}
                required
                placeholder={String(CUSTOM_MIN_QUANTITY)}
                rightSlot={<span className="pr-2 text-sm text-ink-soft">Stel</span>}
                hint={`Minimal pemesanan paket kustom: ${CUSTOM_MIN_QUANTITY} stel seragam tim`}
                error={err.quantity}
              />
              <Input
                label="Target Tanggal Acara / Gladi Bersih"
                name="eventDate"
                type="date"
                required
                hint="Disarankan minimal 30-45 hari sebelum acara puncak"
                error={err.eventDate}
              />
            </div>
            <div className="mt-6 flex flex-col gap-4 rounded-xl bg-beige-soft p-5 sm:flex-row sm:items-center">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary text-on-primary">
                <Ruler className="size-5" aria-hidden="true" />
              </span>
              <div className="flex-1">
                <p className="text-primary">Panduan Pengumpulan Ukuran Tim</p>
                <p className="pt-1 text-sm leading-6 text-ink-soft">
                  Data ukuran siswa/anggota dapat menggunakan <b>template berkas Excel resmi</b> yang kami sediakan, atau diukur langsung oleh tim penjahit saat sampel fisik prototipe disetujui bersama.
                </p>
              </div>
              <button type="button" onClick={downloadRosterTemplate} className={buttonClasses({ variant: 'outline', className: 'border-0 shrink-0' })}>
                <Download className="size-4" aria-hidden="true" /> Unduh Template
              </button>
            </div>
          </NumberedSection>
        </div>

        <aside className="h-fit rounded-2xl bg-surface p-6 shadow-card ring-1 ring-line lg:sticky lg:top-28">
          <p className="flex items-center gap-2 font-bold uppercase text-primary">
            <TrendingUp className="size-4" aria-hidden="true" /> Prosedur Kustomisasi
          </p>
          <p className="pt-1 text-ink">Alur Penawaran & Pembuatan Sampel</p>
          <p className="pt-1 text-sm text-ink-soft">Transparansi kerja dari tahap konsepsi hingga pengerjaan massal</p>
          <ol className="flex flex-col gap-5 pt-6">
            {PROCEDURE.map((p, i) => (
              <li key={p.title} className="flex gap-4">
                <span
                  className={`flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                    i === 0 ? 'bg-primary text-on-primary' : 'bg-beige-soft text-primary'
                  }`}
                >
                  {i + 1}
                </span>
                <span>
                  <span className="block text-ink">{p.title}</span>
                  <span className="block pt-1 text-sm leading-6 text-ink-soft">{p.body}</span>
                </span>
              </li>
            ))}
          </ol>
          <div className="mt-6 rounded-xl bg-beige-soft p-5">
            <div className="flex items-center justify-between gap-3 text-sm uppercase tracking-wide text-ink-soft">
              Status Dasar Harga
              <span className="flex items-center gap-1 font-bold normal-case text-gold-dark">
                <Lock className="size-3.5" aria-hidden="true" /> Draf Bebas Biaya
              </span>
            </div>
            <p className="pt-2 text-sm text-ink-soft">
              <b className="text-primary">Gratis</b> / Pengajuan Awal
            </p>
            <p className="pt-2 text-sm leading-6 text-ink-soft">
              Kalkulasi biaya final dihitung berdasarkan pilihan grade material drill/wool, ketebalan sulaman bordir kawat emas, dan aksesoris terpilih.
            </p>
          </div>

          <ErrorMessage message={state.error} className="mt-4" />

          <SubmitButton
            label="Ajukan Permohonan Penawaran Kustom"
            loadingLabel="Mengirim Permohonan..."
            icon={<Send className="size-4" aria-hidden="true" />}
            className="mt-6 !h-14"
          />
          <Link
            href="/chat?topic=Konsultasi%20paket%20kustom"
            className={buttonClasses({ variant: 'gold', size: 'lg', fullWidth: true, className: 'mt-3 !bg-warning-bg !text-gold-dark !shadow-none hover:!bg-gold-light/40' })}
          >
            <MessageSquare className="size-4" aria-hidden="true" /> Konsultasi Langsung via Chat
          </Link>
          <div className="flex justify-center gap-5 pt-5 text-sm text-ink-soft">
            <span className="flex items-center gap-1"><ShieldCheck className="size-3.5" aria-hidden="true" /> Transaksi Aman</span>
            <span className="flex items-center gap-1"><Headset className="size-3.5" aria-hidden="true" /> Respons Cepat 24j</span>
          </div>
        </aside>
      </form>
    </PageContainer>
  );
}

function NumberedSection({
  n,
  title,
  subtitle,
  badge,
  children,
}: {
  n: string;
  title: string;
  subtitle: string;
  badge?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl bg-surface p-6 shadow-card ring-1 ring-line sm:p-8">
      <div className="flex items-start justify-between gap-4 pb-6">
        <div className="flex gap-3">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-beige-soft text-sm font-bold text-primary">{n}</span>
          <div>
            <h2 className="text-ink">{title}</h2>
            <p className="text-sm text-ink-soft">{subtitle}</p>
          </div>
        </div>
        {badge && <span className="shrink-0 rounded-full bg-warning-bg px-4 py-1.5 text-sm font-semibold text-gold-dark">{badge}</span>}
      </div>
      {children}
    </section>
  );
}
