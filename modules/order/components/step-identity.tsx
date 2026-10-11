"use client";

import React from 'react';
import Image from 'next/image';
import { Award, Building2, Flag, GraduationCap, Info, MessageSquare, Ruler, Shirt, ShieldCheck, Sheet, User } from 'lucide-react';
import { Input, Textarea } from '@/components/ui/input';
import { COLOR_PRESETS, JENJANG_OPTIONS, STANDARD_PACKAGE, UNIFORM_CATEGORIES } from '../data';
import { StandardDraft, minEventDate } from './standard-draft';
import { FormSection, SummaryRow } from './stepper';

const CATEGORY_ICONS = { shirt: Shirt, flag: Flag, award: Award } as const;

interface StepIdentityProps {
  draft: StandardDraft;
  update: (patch: Partial<StandardDraft>) => void;
  errors: Record<string, string>;
}

export function StepIdentity({ draft, update, errors }: StepIdentityProps) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_390px]">
      <div className="flex flex-col gap-6">
        <FormSection icon={<Building2 className="size-5" aria-hidden="true" />} title="Data Lembaga & Penanggung Jawab">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <Input
              label="Nama Instansi / Sekolah"
              name="institution"
              required
              placeholder="Contoh: SMA Negeri 1 Harapan Bangsa"
              leftIcon={<GraduationCap className="size-4" />}
              value={draft.institution}
              onChange={(e) => update({ institution: e.target.value })}
              error={errors.institution}
            />
            <Input
              label="Penanggung Jawab / PIC"
              name="pic"
              required
              placeholder="Nama Lengkap Koordinator"
              leftIcon={<User className="size-4" />}
              value={draft.pic}
              onChange={(e) => update({ pic: e.target.value })}
              error={errors.pic}
            />
            <Input
              label="Nomor WhatsApp / Kontak Darurat"
              name="phone"
              type="tel"
              required
              placeholder="+62 812-xxxx-xxxx"
              leftIcon={<MessageSquare className="size-4" />}
              value={draft.phone}
              onChange={(e) => update({ phone: e.target.value })}
              error={errors.phone}
            />
            <Input
              label="Target Tanggal Acara / Pemakaian"
              name="eventDate"
              type="date"
              required
              min={minEventDate()}
              value={draft.eventDate}
              onChange={(e) => update({ eventDate: e.target.value })}
              error={errors.eventDate}
              hint="Jadwal pengerjaan minimal 14 - 21 hari kalender sebelum tanggal acara."
            />
          </div>

          <fieldset className="pt-6">
            <legend className="pb-2 text-[13px] font-medium text-ink">
              Jenjang Pendidikan / Kluster Usia <span className="text-primary">*</span>
            </legend>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-6">
              {JENJANG_OPTIONS.map((j) => {
                const active = draft.jenjang === j.value;
                return (
                  <button
                    key={j.value}
                    type="button"
                    aria-pressed={active}
                    onClick={() => update({ jenjang: j.value })}
                    className={`flex flex-col items-center justify-center rounded-xl px-2 py-3 text-center transition-colors ${
                      active ? 'bg-primary text-on-primary shadow-button' : 'bg-beige-soft text-ink hover:bg-beige'
                    }`}
                  >
                    <span className="text-sm font-semibold">{j.label}</span>
                    <span className={`text-xs ${active ? 'text-white/70' : 'text-muted'}`}>{j.hint}</span>
                  </button>
                );
              })}
            </div>
            {errors.jenjang && <p className="pt-1.5 text-xs text-danger">{errors.jenjang}</p>}
          </fieldset>

          <fieldset className="pt-6">
            <legend className="pb-2 text-[13px] font-medium text-ink">
              Pilihan Kategori Seragam & Varian Model <span className="text-primary">*</span>
            </legend>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {UNIFORM_CATEGORIES.map((c) => {
                const Icon = CATEGORY_ICONS[c.icon];
                const active = draft.category === c.value;
                return (
                  <button
                    key={c.value}
                    type="button"
                    aria-pressed={active}
                    onClick={() => update({ category: c.value })}
                    className={`flex flex-col items-start gap-2 rounded-xl p-5 text-left transition-all ${
                      active ? 'bg-surface shadow-card ring-2 ring-primary' : 'bg-beige-soft hover:bg-beige'
                    }`}
                  >
                    <Icon className="size-5 text-primary" aria-hidden="true" />
                    <span className="text-sm font-semibold text-ink">{c.value}</span>
                    <span className="text-[13px] leading-5 text-ink-soft">{c.description}</span>
                  </button>
                );
              })}
            </div>
            {errors.category && <p className="pt-1.5 text-xs text-danger">{errors.category}</p>}
          </fieldset>

          <div className="grid grid-cols-1 gap-5 pt-6 md:grid-cols-[300px_1fr]">
            <fieldset>
              <legend className="pb-2 text-[13px] font-medium text-ink">Pilihan Warna Utama Kain</legend>
              <div className="rounded-xl bg-beige-soft p-2.5">
                <div className="flex flex-wrap gap-2 pb-2.5">
                  {COLOR_PRESETS.map((c) => (
                    <button
                      key={c.hex}
                      type="button"
                      title={c.name}
                      aria-label={c.name}
                      aria-pressed={draft.color === c.name}
                      onClick={() => update({ color: c.name })}
                      className={`size-8 rounded-full border border-line-strong transition-transform hover:scale-110 ${
                        draft.color === c.name ? 'ring-2 ring-primary ring-offset-2' : ''
                      }`}
                      style={{ backgroundColor: c.hex }}
                    />
                  ))}
                </div>
                <input
                  aria-label="Nama warna kain"
                  value={draft.color}
                  onChange={(e) => update({ color: e.target.value })}
                  placeholder="Tulis kombinasi warna"
                  className="h-10 w-full rounded-lg border border-line bg-surface px-3 text-sm text-ink focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </fieldset>
            <Textarea
              label="Catatan Teknis / Permintaan Desain Tambahan"
              name="notes"
              rows={4}
              placeholder="Tuliskan spesifikasi bordir logo instansi, posisi nama regu, preferensi furing dalam, atau ketentuan khusus seragam..."
              value={draft.notes}
              onChange={(e) => update({ notes: e.target.value })}
            />
          </div>
        </FormSection>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <FeatureNote icon={<Ruler className="size-5" />} title="Standar Pola Ergonomis" body="Pola potong dirancang leluasa untuk gerakan manuver instrumen." />
          <FeatureNote icon={<Award className="size-5" />} title="Bordir Komputer Presisi" body="Kerapatan benang bordir tinggi, tahan cuci berkali-kali tanpa luntur." />
        </div>
      </div>

      <aside className="flex flex-col gap-6">
        <div className="rounded-2xl bg-surface p-6 shadow-card ring-1 ring-line">
          <div className="flex items-center justify-between pb-6">
            <p className="text-sm uppercase tracking-wider text-ink-soft">Ringkasan Konfigurasi</p>
            <span className="rounded-md bg-beige-soft px-2 py-0.5 text-sm text-primary">Langkah 1/3</span>
          </div>
          <PackageSummaryHead />
          <div className="mt-4 rounded-xl bg-beige-soft px-3 py-2">
            <SummaryRow label="Model Terpilih" value={draft.category || '-'} />
            <SummaryRow label="Estimasi Durasi" value={STANDARD_PACKAGE.duration} />
            <SummaryRow label="Metode Ukur" value="Form Excel (Langkah 2)" accent />
            <SummaryRow label="Garansi Revisi Jahit" value={STANDARD_PACKAGE.warranty} />
          </div>
          <div className="mt-5 flex gap-3 rounded-xl bg-beige-soft p-5">
            <Sheet className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
            <div>
              <p className="font-semibold text-primary">Pengisian Ukuran Badan di Langkah 2</p>
              <p className="pt-1 text-sm leading-6 text-ink-soft">
                Anda tidak perlu memasukkan ukuran satu per satu sekarang. Di langkah selanjutnya, kami menyediakan format Excel siap unduh untuk mendata seluruh personil.
              </p>
            </div>
          </div>
          <p className="flex items-start gap-2 pt-5 text-sm text-ink-soft">
            <ShieldCheck className="mt-0.5 size-4 shrink-0 text-muted" aria-hidden="true" />
            Garansi 100% perbaikan jika ukuran tidak sesuai data form.
          </p>
        </div>
        <div className="flex items-start gap-3 rounded-2xl bg-surface p-5 text-sm text-ink-soft shadow-card ring-1 ring-line">
          <Info className="mt-0.5 size-4 shrink-0 text-gold-dark" aria-hidden="true" />
          Harga per stel dikonfirmasi admin setelah data ukuran diverifikasi. Anda akan menerima notifikasi penawaran resmi.
        </div>
      </aside>
    </div>
  );
}

export function PackageSummaryHead() {
  return (
    <div className="flex items-center gap-4">
      <div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-beige-soft">
        <Image src="/images/portfolio/project-6.webp" alt="" fill sizes="80px" className="object-cover" />
      </div>
      <div>
        <p className="font-semibold text-ink">{STANDARD_PACKAGE.name}</p>
        <p className="text-sm text-ink-soft">{STANDARD_PACKAGE.subtitle}</p>
        <p className="text-sm text-ink-soft">
          Harga: <span className="font-bold text-primary">dikonfirmasi admin</span>
        </p>
      </div>
    </div>
  );
}

function FeatureNote({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="flex items-center gap-5 rounded-2xl bg-surface p-5 shadow-card ring-1 ring-line">
      <span className="flex size-16 shrink-0 items-center justify-center rounded-xl bg-beige-soft text-primary">{icon}</span>
      <div>
        <p className="font-semibold text-ink">{title}</p>
        <p className="text-sm leading-6 text-ink-soft">{body}</p>
      </div>
    </div>
  );
}
