"use client";

import React, { useActionState, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Award,
  CheckCircle2,
  FileImage,
  Headset,
  HelpCircle,
  ImagePlus,
  Link2,
  MessagesSquare,
  Palette,
  PencilRuler,
  Scissors,
  Send,
  ShieldCheck,
  Sparkles,
  Trash2,
  UploadCloud,
} from 'lucide-react';
import { PageContainer, PageHeader } from '@/components/layout/page-header';
import { ButtonLink } from '@/components/ui/button';
import { Input, Select, Textarea } from '@/components/ui/input';
import { ErrorMessage } from '@/components/ui/error-message';
import { SubmitButton } from '@/components/ui/submit-button';
import { submitCustomOrder, OrderActionState } from '@/modules/order/actions';
import { JENJANG_OPTIONS } from '@/modules/order/data';

const MATERIAL_PRESETS = [
  { name: 'American Drill 1919', note: 'Tegap, kuat, & awet' },
  { name: 'Nagata Drill Premium', note: 'Halus, rapat, & adem' },
  { name: 'Tessa / High Twist', note: 'Rapi & tidak mudah kusut' },
  { name: 'Beludru / Velvet Import', note: 'Mewah & mengkilap' },
  { name: 'Satin Bridal', note: 'Halus & kilau lembut' },
  { name: 'Kain Khusus Lainnya', note: 'Sesuai permintaan' },
];

const CATEGORY_OPTIONS = [
  'Seragam Pasukan Drumband',
  'Kostum Mayoret / Gitapati',
  'Kostum Field Commander',
  'Kostum Color Guard & Bendera',
  'Kostum Pawai & Karnaval Adat',
  'Jas Almamater / Institusi',
  'Lainnya',
];

const initialState: OrderActionState = {};

interface CustomViewProps {
  accessories: { name: string; description?: string | null }[];
  isLoggedIn?: boolean;
}

export function CustomView({ accessories, isLoggedIn = true }: CustomViewProps) {
  const [state, formAction] = useActionState(submitCustomOrder, initialState);
  const [description, setDescription] = useState('');
  const [selectedMaterial, setSelectedMaterial] = useState<string>('American Drill 1919');
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  const err = state.fieldErrors ?? {};

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPreviewImages((prev) => [...prev, String(event.target?.result)]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removePreview = (index: number) => {
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <PageContainer>
      <div className="space-y-6 pb-16">
        <PageHeader
          eyebrow="LAYANAN CUSTOM"
          title="Pesanan Custom"
          description="Kirim spesifikasi desain seragam Anda untuk ditinjau admin."
          aside={
            <ButtonLink
              href="/chat?topic=Konsultasi%20Pesanan%20Custom%20Desain"
              variant="outline"
              size="sm"
              className="inline-flex items-center gap-2 !border-primary !text-primary hover:!bg-primary/5"
            >
              <MessagesSquare className="size-4" /> Chat Admin
            </ButtonLink>
          }
        />

        {/* ─── Formulir Pemesanan Custom ─── */}
        <form action={formAction} className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]">
          <div className="space-y-6">
            <ErrorMessage message={state.error} />

            {/* 01. Konsep & Model Seragam */}
            <SectionCard step="01" title="Model Seragam">
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Input
                    label="Nama Sekolah / Tim"
                    name="institution"
                    required
                    placeholder="Nama instansi atau tim"
                    error={err.institution}
                  />

                  <Select label="Kategori Seragam" name="category" defaultValue="Seragam Pasukan Drumband">
                    {CATEGORY_OPTIONS.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </Select>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Select label="Jenjang (Opsional)" name="jenjang" defaultValue="">
                    <option value="">Pilih jenjang</option>
                    {JENJANG_OPTIONS.map((j) => (
                      <option key={j.value} value={j.value}>
                        {j.label}
                      </option>
                    ))}
                  </Select>

                  <Input
                    label="Jumlah Kebutuhan"
                    name="quantity"
                    type="number"
                    min={1}
                    required
                    placeholder="Jumlah stel"
                    rightSlot={<span className="pr-3 text-xs font-semibold text-ink-soft">Stel</span>}
                    error={err.quantity}
                  />
                </div>

                <div>
                  <Textarea
                    label="Deskripsi Model *"
                    name="description"
                    rows={4}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Warna, model kerah, bordir, dan detail lainnya"
                    error={err.description}
                  />
                  <div className="mt-1 flex justify-between text-xs text-ink-soft">
                    <span>Min. 10 karakter</span>
                    <span>{description.length} / 2000</span>
                  </div>
                </div>
              </div>
            </SectionCard>

            {/* 02. Bahan */}
            <SectionCard step="02" title="Pilihan Bahan">
              <div className="space-y-4">
                <input type="hidden" name="material" value={selectedMaterial} />
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {MATERIAL_PRESETS.map((m) => {
                    const isSelected = selectedMaterial === m.name;
                    return (
                      <button
                        type="button"
                        key={m.name}
                        onClick={() => setSelectedMaterial(m.name)}
                        className={`flex flex-col text-left rounded-xl p-3 transition ring-1 ${
                          isSelected
                            ? 'bg-beige-soft ring-2 ring-primary text-primary shadow-sm'
                            : 'bg-surface ring-line text-ink hover:bg-beige-soft/60'
                        }`}
                      >
                        <span className="flex items-center justify-between font-bold text-sm">
                          {m.name}
                          {isSelected && <CheckCircle2 className="size-4 text-primary" />}
                        </span>
                        <span className="mt-0.5 text-xs text-ink-soft">{m.note}</span>
                      </button>
                    );
                  })}
                </div>

                <Input
                  label="Catatan Bahan (Opsional)"
                  name="materialDetail"
                  placeholder="Jenis kain tambahan jika ada"
                />
              </div>
            </SectionCard>

            {/* 03. Foto Referensi */}
            <SectionCard step="03" title="Foto Referensi">
              <div className="space-y-4">
                {/* File Upload Box */}
                <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-line bg-canvas p-5 text-center transition hover:border-primary">
                  <label htmlFor="ref-files" className="cursor-pointer flex flex-col items-center">
                    <span className="flex size-12 items-center justify-center rounded-full bg-beige-soft text-primary shadow-soft">
                      <ImagePlus className="size-5" />
                    </span>
                    <span className="mt-2 block font-bold text-sm text-ink">
                      Pilih Foto Referensi
                    </span>
                    <span className="mt-0.5 block text-xs text-ink-soft">
                      JPG, PNG, atau WEBP
                    </span>
                    <input
                      id="ref-files"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileChange}
                      className="sr-only"
                    />
                  </label>
                </div>

                {/* Previews */}
                {previewImages.length > 0 && (
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-ink pb-2">
                      Foto Referensi Terpilih ({previewImages.length}):
                    </p>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                      {previewImages.map((src, idx) => (
                        <div key={idx} className="group relative aspect-square overflow-hidden rounded-xl border border-line bg-beige-soft">
                          <img src={src} alt={`Referensi ${idx + 1}`} className="size-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removePreview(idx)}
                            className="absolute right-1.5 top-1.5 flex size-7 items-center justify-center rounded-full bg-black/70 text-white transition hover:bg-danger"
                            title="Hapus foto"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Cloud Link Input */}
                <div className="pt-1">
                  <Input
                    label="Tautan Cloud (Opsional)"
                    name="designReference"
                    type="url"
                    placeholder="https://drive.google.com/..."
                    leftIcon={<Link2 className="size-4" />}
                    hint="Pastikan tautan dapat dibuka publik."
                    error={err.designReference}
                  />
                  <input
                    type="hidden"
                    name="uploadedPreviews"
                    value={previewImages.slice(0, 3).join('|||')}
                  />
                </div>
              </div>
            </SectionCard>

            {/* 04. Aksesoris */}
            {accessories.length > 0 && (
              <SectionCard step="04" title="Aksesoris (Opsional)">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {accessories.map((a) => (
                    <label
                      key={a.name}
                      className="flex cursor-pointer items-start gap-3 rounded-xl bg-surface p-3 ring-1 ring-line transition hover:bg-beige-soft has-[:checked]:ring-2 has-[:checked]:ring-primary"
                    >
                      <input
                        type="checkbox"
                        name="accessories"
                        value={a.name}
                        className="mt-0.5 size-4 shrink-0 accent-primary"
                      />
                      <span className="text-xs">
                        <strong className="block text-sm text-ink">{a.name}</strong>
                        {a.description && <span className="text-ink-soft">{a.description}</span>}
                      </span>
                    </label>
                  ))}
                </div>
              </SectionCard>
            )}

            {/* 05. Jadwal & Catatan */}
            <SectionCard step="05" title="Jadwal & Catatan">
              <div className="space-y-4">
                <Input
                  label="Target Tanggal Acara *"
                  name="eventDate"
                  type="date"
                  required
                  min={new Date().toISOString().slice(0, 10)}
                  hint="Disarankan minimal H-30 acara."
                  error={err.eventDate}
                />

                <Textarea
                  label="Catatan Tambahan (Opsional)"
                  name="consultationNote"
                  rows={2}
                  placeholder="Catatan untuk tim penjahit"
                />
              </div>
            </SectionCard>
          </div>

          {/* ─── Sidebar Aksi & Konsultasi ─── */}
          <aside className="lg:sticky lg:top-28 lg:h-fit">
            <div className="rounded-2xl bg-surface p-5 shadow-card ring-1 ring-line space-y-4">
              <div>
                <h3 className="font-bold text-ink text-base">Kirim Permohonan</h3>
                <p className="mt-1 text-xs text-ink-soft">
                  Desain akan ditinjau admin untuk konfirmasi kelayakan produksi.
                </p>
              </div>

              {isLoggedIn ? (
                <SubmitButton
                  label="Kirim Pengajuan"
                  loadingLabel="Mengirim..."
                  icon={<Send className="size-4" />}
                  fullWidth
                  size="lg"
                />
              ) : (
                <div className="space-y-2">
                  <ButtonLink href="/login?next=/custom" variant="primary" fullWidth size="lg">
                    Masuk Akun
                  </ButtonLink>
                  <p className="text-center text-xs text-ink-soft">
                    Masuk untuk menyimpan pengajuan Anda.
                  </p>
                </div>
              )}

              <div className="relative py-1">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-line" />
                </div>
                <div className="relative flex justify-center text-[11px] uppercase tracking-wider">
                  <span className="bg-surface px-2.5 text-ink-soft">Butuh Bantuan?</span>
                </div>
              </div>

              <div className="space-y-2">
                <Link
                  href="/chat?topic=Konsultasi%20Pesanan%20Custom%20Desain"
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-line bg-canvas py-2.5 text-xs font-semibold text-ink transition hover:border-primary hover:text-primary hover:bg-beige-soft"
                >
                  <MessagesSquare className="size-4 text-primary" /> Konsultasi Admin
                </Link>
                <p className="text-center text-[11px] text-ink-soft">
                  Tanya model atau harga via chat.
                </p>
              </div>
            </div>
          </aside>
        </form>
      </div>
    </PageContainer>
  );
}

function SectionCard({
  step,
  title,
  subtitle,
  children,
}: {
  step: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl bg-surface p-5 shadow-card ring-1 ring-line sm:p-6">
      <div className="flex items-center gap-3 border-b border-line pb-3 mb-4">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary text-xs font-bold text-white">
          {step}
        </span>
        <div>
          <h2 className="text-base font-bold text-ink">{title}</h2>
          {subtitle && <p className="text-xs text-ink-soft mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {children}
    </section>
  );
}
