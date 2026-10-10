"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import {
  ArrowRight,
  Building2,
  CircleCheck,
  Clock,
  Headset,
  Loader2,
  Lock,
  MapPin,
  Package,
  Pencil,
  Replace,
  Shirt,
  ShieldCheck,
  Truck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox, Textarea } from '@/components/ui/input';
import { ErrorMessage } from '@/components/ui/error-message';
import { formatDate } from '@/lib/format';
import { STANDARD_PACKAGE } from '../data';
import { StandardDraft } from './standard-draft';
import { FormSection } from './stepper';
import { RosterFileRow, RosterPreview } from './step-roster';

interface StepReviewProps {
  draft: StandardDraft;
  update: (patch: Partial<StandardDraft>) => void;
  goTo: (step: number) => void;
  onSubmit: () => void;
  onSaveDraft: () => void;
  submitting: boolean;
  error?: string;
  errors: Record<string, string>;
}

export function StepReview({ draft, update, goTo, onSubmit, onSaveDraft, submitting, error, errors }: StepReviewProps) {
  const [agreed, setAgreed] = useState(false);
  const [preview, setPreview] = useState(false);
  const editLink = (label: string, step: number, Icon = Pencil) => (
    <button type="button" onClick={() => goTo(step)} className="flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
      <Icon className="size-3.5" aria-hidden="true" /> {label}
    </button>
  );

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_380px]">
      <div className="flex flex-col gap-6">
        <FormSection icon={<Building2 className="size-5" aria-hidden="true" />} title="Data Identitas & Acara" action={editLink('Ubah Data', 1)}>
          <dl className="grid grid-cols-1 gap-x-6 gap-y-4 rounded-xl bg-beige-soft p-5 sm:grid-cols-2">
            <ReviewItem label="Nama Instansi" value={draft.institution} />
            <ReviewItem label="Penanggung Jawab (PIC)" value={draft.pic} />
            <ReviewItem label="Nomor Kontak / WhatsApp" value={draft.phone} />
            <ReviewItem label="Jenjang Institusi" value={draft.jenjang} />
            <div className="sm:col-span-2">
              <dt className="text-sm text-ink-soft">Target Pelaksanaan Acara</dt>
              <dd className="flex items-center gap-2 pt-0.5 text-sm">
                <Clock className="size-4 text-gold-dark" aria-hidden="true" />
                <b className="text-primary">{formatDate(draft.eventDate, { day: 'numeric', month: 'long', year: 'numeric' })}</b>
                <span className="text-ink-soft">(Jadwal produksi {STANDARD_PACKAGE.duration})</span>
              </dd>
            </div>
          </dl>
        </FormSection>

        <FormSection
          icon={<Package className="size-5" aria-hidden="true" />}
          title="Berkas Data Ukuran Terlampir"
          action={
            draft.roster ? (
              <span className="flex items-center gap-1.5 rounded-full bg-success-bg px-3 py-1 text-sm font-semibold text-success">
                <span className="size-1.5 rounded-full bg-success" /> Berkas Terverifikasi
              </span>
            ) : undefined
          }
        >
          {draft.roster ? (
            <>
              <RosterFileRow roster={draft.roster} preview={preview} onTogglePreview={() => setPreview((v) => !v)} />
              <div className="pt-3">{editLink('Ganti Berkas', 2, Replace)}</div>
              {preview && <RosterPreview roster={draft.roster} />}
            </>
          ) : (
            <ErrorMessage message={errors.roster || 'Belum ada berkas ukuran. Kembali ke Langkah 2 untuk mengunggah.'} />
          )}
        </FormSection>

        <FormSection icon={<Shirt className="size-5" aria-hidden="true" />} title="Spesifikasi Produk & Komponen" action={editLink('Rombak Desain', 1)}>
          <div className="flex flex-col gap-6 sm:flex-row">
            <div className="relative h-56 w-full shrink-0 overflow-hidden rounded-xl bg-beige-soft sm:w-60">
              <Image src="/images/portfolio/project-1.webp" alt="" fill sizes="240px" className="object-cover" />
              <span className="absolute bottom-2 left-2 rounded-md bg-primary px-2.5 py-1 text-xs font-semibold text-on-primary">{draft.category || 'Model'}</span>
            </div>
            <div>
              <p className="text-primary">
                {STANDARD_PACKAGE.name} — {draft.category}
              </p>
              <p className="pt-2 text-sm leading-6 text-ink-soft">
                Warna: <b className="text-ink">{draft.color || 'Sesuai konsultasi'}</b>
                {draft.notes && (
                  <>
                    <br />
                    Catatan: {draft.notes}
                  </>
                )}
              </p>
              <ul className="grid grid-cols-1 gap-2 pt-4 sm:grid-cols-2">
                {STANDARD_PACKAGE.components.map((c) => (
                  <li key={c} className="flex items-center gap-2 rounded-lg bg-beige-soft px-3 py-2 text-sm text-ink">
                    <CircleCheck className="size-4 text-primary" aria-hidden="true" /> {c}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </FormSection>

        <FormSection icon={<Truck className="size-5" aria-hidden="true" />} title="Alamat & Ekspedisi Pengiriman Logistik">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-xl bg-beige-soft p-5">
              <p className="flex items-center gap-1.5 pb-3 text-primary">
                <MapPin className="size-4" aria-hidden="true" /> Alamat Instansi / Sekolah
              </p>
              <Textarea
                name="address"
                rows={3}
                aria-label="Alamat pengiriman"
                placeholder="Alamat lengkap pengiriman seragam"
                value={draft.address}
                onChange={(e) => update({ address: e.target.value })}
                error={errors.address}
              />
            </div>
            <div className="rounded-xl bg-beige-soft p-5">
              <p className="flex items-center gap-1.5 text-primary">
                <Truck className="size-4" aria-hidden="true" /> Pilihan Ekspedisi
              </p>
              <p className="pt-3 font-semibold text-ink">Kargo Resmi / Ekspedisi Darat</p>
              <p className="pt-1 text-sm leading-6 text-ink-soft">
                Kurir dan ongkos kirim ditentukan bengkel sesuai volume pesanan, lalu diinformasikan bersama penawaran resmi.
              </p>
            </div>
          </div>
        </FormSection>
      </div>

      <aside className="h-fit rounded-2xl bg-surface p-6 shadow-card ring-1 ring-line lg:sticky lg:top-28">
        <div className="flex items-center justify-between gap-3">
          <p className="text-primary">Rincian Estimasi Biaya</p>
          <span className="rounded-full bg-beige-soft px-3 py-1.5 text-sm font-bold text-primary">FORMULIR RESMI</span>
        </div>
        <div className="mt-6 flex flex-col gap-3 rounded-xl bg-beige-soft p-5 text-sm">
          <CostRow label={`Biaya Produksi Seragam (${draft.roster?.rows.length ?? 0} stel)`} value="Dikonfirmasi admin" />
          <CostRow label="Biaya Kemasan Khusus Box Shako" value="Termasuk" />
          <CostRow label="Ongkos Kirim Armada Kargo" value={<span className="text-gold-dark">Dihitung Workshop</span>} />
          <div className="flex items-start justify-between gap-4 border-t border-line pt-3">
            <b className="text-primary">Estimasi Total</b>
            <span className="text-right text-ink-soft">Kalkulasi final setelah verifikasi berkas</span>
          </div>
        </div>

        <div className="mt-6 rounded-xl bg-warning-bg p-5 text-sm leading-6 text-warning">
          <p className="flex items-center gap-2 font-semibold">
            <ShieldCheck className="size-4" aria-hidden="true" /> Ketentuan Uang Muka / SPK Resmi Sekolah
          </p>
          <p className="pt-1">
            Produksi dimulai setelah termin 50% DP diverifikasi bendahara atau terbitnya Surat Perintah Kerja (SPK) Kedinasan resmi dari pihak sekolah.
          </p>
        </div>

        <Checkbox
          className="mt-6 !text-sm !text-ink"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          label="Saya menyatakan bahwa data spesifikasi dan berkas ukuran yang diunggah telah sesuai dan menyetujui Syarat & Ketentuan Produksi."
        />

        <ErrorMessage message={error} className="mt-4" />

        <Button size="lg" fullWidth className="mt-6 !h-[52px]" disabled={!agreed || submitting || !draft.roster} onClick={onSubmit}>
          {submitting ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden="true" /> Mengirim Pesanan...
            </>
          ) : (
            <>
              Konfirmasi & Kirim Pesanan <ArrowRight className="size-4" aria-hidden="true" />
            </>
          )}
        </Button>
        <Button variant="ghost" fullWidth className="mt-2" onClick={onSaveDraft}>
          Simpan Draf & Lanjutkan Nanti
        </Button>
        <div className="flex justify-center gap-5 pt-5 text-sm text-ink-soft">
          <span className="flex items-center gap-1"><Lock className="size-3.5 text-success" aria-hidden="true" /> Koneksi Aman</span>
          <span className="flex items-center gap-1"><Headset className="size-3.5" aria-hidden="true" /> Bantuan PIC Teknis</span>
        </div>
      </aside>
    </div>
  );
}

function ReviewItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-sm text-ink-soft">{label}</dt>
      <dd className="pt-0.5 font-semibold text-ink">{value || '-'}</dd>
    </div>
  );
}

function CostRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-ink-soft">{label}</span>
      <span className="shrink-0 text-right font-semibold text-ink">{value}</span>
    </div>
  );
}
