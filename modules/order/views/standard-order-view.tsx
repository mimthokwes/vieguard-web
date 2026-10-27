"use client";

import React, { useCallback, useEffect, useState, useTransition } from 'react';
import { ArrowLeft, ArrowRight, BadgeCheck, CircleCheck, Sheet } from 'lucide-react';
import { PageContainer } from '@/components/layout/page-header';
import { Button, ButtonLink } from '@/components/ui/button';
import { User } from '@/types/user';
import { submitStandardOrder } from '../actions';
import { Stepper, StepDef } from '../components/stepper';
import { StepIdentity } from '../components/step-identity';
import { StepRoster } from '../components/step-roster';
import { StepReview } from '../components/step-review';
import { clearDraft, EMPTY_DRAFT, loadDraft, saveDraft, StandardDraft } from '../components/standard-draft';

const STEPS: StepDef[] = [
  { title: 'Spesifikasi Dasar & Institusi', subtitle: 'Identitas & jadwal acara' },
  { title: 'Data Ukuran via Excel', subtitle: 'Unggah spreadsheet tunggal' },
  { title: 'Konfirmasi & Tinjauan', subtitle: 'Finalisasi & jadwal produksi' },
];

const STEP_HEADINGS = [
  {
    icon: BadgeCheck,
    eyebrow: 'Formulir Terstandarisasi Produksi Garmen',
    title: 'Langkah 1: Spesifikasi Dasar & Identitas Institusi',
    description: 'Lengkapi detail sekolah/organisasi dan jadwal pelaksanaan acara untuk alokasi kapasitas jahit workshop.',
  },
  {
    icon: Sheet,
    eyebrow: 'Standarisasi Data Batch Terpadu',
    title: 'Langkah 2: Pengumpulan Data Ukuran Siswa',
    description: 'Pengumpulan data ukuran siswa dilakukan terpusat melalui pengisian berkas spreadsheet resmi tanpa perlu mengisi per anak secara manual di web.',
  },
  {
    icon: CircleCheck,
    eyebrow: 'Validasi Akhir Transaksi',
    title: 'Langkah 3: Tinjauan & Konfirmasi Pesanan',
    description: 'Periksa kembali rincian identitas institusi, berkas data ukuran, dan rincian alur pengiriman sebelum pesanan diterbitkan.',
  },
];

function validateStep(step: number, d: StandardDraft): Record<string, string> {
  const e: Record<string, string> = {};
  if (step >= 1) {
    if (!d.institution.trim()) e.institution = 'Nama instansi wajib diisi.';
    if (!d.pic.trim()) e.pic = 'Penanggung jawab wajib diisi.';
    if (!d.phone.trim()) e.phone = 'Nomor WhatsApp wajib diisi.';
    if (!d.eventDate) e.eventDate = 'Tanggal acara wajib diisi.';
    if (!d.jenjang) e.jenjang = 'Pilih jenjang pendidikan.';
    if (!d.category) e.category = 'Pilih kategori seragam.';
  }
  if (step >= 2 && !d.roster) e.roster = 'Unggah berkas data ukuran terlebih dahulu.';
  return e;
}

export function StandardOrderView({ user, initialStep, storePhone }: { user: User; initialStep: number; storePhone?: string | null }) {
  const [step, setStep] = useState(Math.min(Math.max(initialStep, 1), 3));
  const [draft, setDraft] = useState<StandardDraft>(EMPTY_DRAFT);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState('');
  const [savedNotice, setSavedNotice] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [submitting, startSubmit] = useTransition();

  // One-time hydration from localStorage after mount (unavailable during SSR).
  useEffect(() => {
    const stored = loadDraft();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDraft({
      ...EMPTY_DRAFT,
      pic: user.name ?? '',
      phone: user.phone ?? '',
      address: user.address ?? '',
      ...stored,
    });
    setHydrated(true);
  }, [user]);

  useEffect(() => {
    if (hydrated) saveDraft(draft);
  }, [draft, hydrated]);

  const update = useCallback((patch: Partial<StandardDraft>) => {
    setDraft((d) => ({ ...d, ...patch }));
    setErrors((prev) => {
      const next = { ...prev };
      for (const k of Object.keys(patch)) delete next[k];
      return next;
    });
  }, []);

  const goTo = (target: number) => {
    // Moving forward requires the earlier steps to be valid.
    if (target > step) {
      const e = validateStep(target - 1, draft);
      if (Object.keys(e).length > 0) {
        setErrors(e);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
    }
    setErrors({});
    setStep(target);
    window.history.replaceState(null, '', `?step=${target}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const submit = () => {
    const e = validateStep(2, draft);
    if (!draft.address.trim()) e.address = 'Alamat pengiriman wajib diisi.';
    if (Object.keys(e).length > 0) {
      setErrors(e);
      setSubmitError('Lengkapi data yang wajib diisi.');
      return;
    }
    setSubmitError('');
    startSubmit(async () => {
      // A successful submit redirects to the order page and never returns here,
      // so drop the stored draft up front and restore it if the server rejects.
      clearDraft();
      const result = await submitStandardOrder({
        ...draft,
        roster: draft.roster && { fileName: draft.roster.fileName, count: draft.roster.rows.length, sizeCounts: draft.roster.sizeCounts },
      });
      if (result?.error) {
        saveDraft(draft);
        setSubmitError(result.error);
        setErrors(result.fieldErrors ?? {});
      }
    });
  };

  const heading = STEP_HEADINGS[step - 1]!;
  const HeadingIcon = heading.icon;

  return (
    <PageContainer>
      <div className="pt-6">
        <Stepper steps={STEPS} current={step} />
      </div>

      <header className="max-w-3xl py-10">
        <p className="flex items-center gap-2 text-sm font-semibold text-ink">
          <HeadingIcon className="size-4 text-primary" aria-hidden="true" /> {heading.eyebrow}
        </p>
        <h1 className="pt-3 text-xl font-bold text-primary sm:text-2xl">Formulir Pemesanan Seragam Standar — {heading.title}</h1>
        <p className="pt-1 text-base leading-relaxed text-ink-soft">{heading.description}</p>
      </header>

      {!hydrated ? (
        <div className="h-96 animate-pulse rounded-2xl bg-beige-soft" />
      ) : step === 1 ? (
        <StepIdentity draft={draft} update={update} errors={errors} />
      ) : step === 2 ? (
        <StepRoster draft={draft} update={update} error={errors.roster} storePhone={storePhone} />
      ) : (
        <StepReview
          draft={draft}
          update={update}
          goTo={goTo}
          onSubmit={submit}
          onSaveDraft={() => {
            saveDraft(draft);
            setSavedNotice(true);
            setTimeout(() => setSavedNotice(false), 3000);
          }}
          submitting={submitting}
          error={submitError}
          errors={errors}
        />
      )}

      {savedNotice && (
        <p role="status" className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-xl border border-gold bg-primary px-5 py-3 text-sm font-semibold text-on-primary shadow-card">
          Draf tersimpan di perangkat ini. Anda bisa melanjutkannya kapan saja.
        </p>
      )}

      {step < 3 && (
        <nav className="mt-8 flex flex-col items-stretch gap-4 rounded-2xl bg-surface p-5 shadow-card ring-1 ring-line sm:flex-row sm:items-center sm:justify-between" aria-label="Navigasi langkah">
          {step === 1 ? (
            <ButtonLink href="/order" variant="soft" size="lg" className="border-0">
              <ArrowLeft className="size-4" aria-hidden="true" /> Kembali ke Pilih Paket
            </ButtonLink>
          ) : (
            <Button variant="soft" size="lg" className="border-0" onClick={() => goTo(step - 1)}>
              <ArrowLeft className="size-4" aria-hidden="true" /> Kembali ke Langkah {step - 1}
            </Button>
          )}
          <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
            {Object.keys(errors).length > 0 ? (
              <span className="text-sm font-semibold text-danger">Periksa kembali isian wajib yang ditandai.</span>
            ) : (
              <span className="hidden text-sm text-ink-soft md:inline">Periksa kembali isian wajib sebelum melanjutkan</span>
            )}
            <Button size="lg" className="!h-12" onClick={() => goTo(step + 1)}>
              {step === 1 ? 'Lanjut ke Langkah 2: Unggah Berkas Excel' : 'Lanjut ke Langkah 3: Tinjauan & Konfirmasi'}
              <ArrowRight className="size-4" aria-hidden="true" />
            </Button>
          </div>
        </nav>
      )}
    </PageContainer>
  );
}
