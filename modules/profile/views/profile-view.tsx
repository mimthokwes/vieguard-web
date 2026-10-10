"use client";

import React, { useActionState, useRef, useState } from 'react';
import {
  Building2,
  CircleCheck,
  Download,
  FileSpreadsheet,
  FileText,
  FileUp,
  Info,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Ruler,
  Save,
  ShieldCheck,
  Sheet,
  Trash2,
  Truck,
  User as UserIcon,
  UserCog,
  Users,
} from 'lucide-react';
import { User } from '@/types/user';
import { Breadcrumb } from '@/components/layout/breadcrumb';
import { PageContainer } from '@/components/layout/page-header';
import { Input, Textarea } from '@/components/ui/input';
import { ErrorMessage } from '@/components/ui/error-message';
import { SubmitButton } from '@/components/ui/submit-button';
import { CtaBanner } from '@/components/ui/cta-banner';
import { formatDate } from '@/lib/format';
import { downloadRosterTemplate, parseRosterFile } from '@/lib/roster/roster';
import { deleteSavedRoster, downloadRosterCsv, saveRoster, useSavedRosters } from '@/lib/roster/saved-rosters';
import { ProfileActionState, updateAddressAction, updateIdentityAction } from '../actions';

const initial: ProfileActionState = {};

function splitAddress(address?: string | null) {
  if (!address) return { recipient: '', street: '' };
  const [first, ...rest] = address.split('\n');
  return rest.length ? { recipient: first ?? '', street: rest.join(' ') } : { recipient: '', street: first ?? '' };
}

export function ProfileView({ user }: { user: User }) {
  const [identityState, identityAction] = useActionState(updateIdentityAction, initial);
  const [addressState, addressAction] = useActionState(updateAddressAction, initial);
  const rosters = useSavedRosters();
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);
  const { recipient, street } = splitAddress(user.address);


  const totalStudents = rosters.reduce((s, r) => s + r.rows.length, 0);

  const handleUpload = async (file?: File | null) => {
    if (!file) return;
    setUploading(true);
    setUploadError('');
    try {
      saveRoster(await parseRosterFile(file));
    } catch (e) {
      setUploadError((e as Error).message);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  return (
    <PageContainer>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Breadcrumb items={[{ label: 'Pengaturan Akun & Profil' }]} />
        <span className="flex items-center gap-2 rounded-full bg-beige-soft px-3 py-1 text-xs font-semibold text-ink-soft">
          <span className="size-1.5 rounded-full bg-gold" aria-hidden="true" /> ID Pelanggan: <b className="text-ink">#{String(user.id)}</b>
        </span>
      </div>

      <section className="relative mt-6 overflow-hidden rounded-2xl bg-surface p-8 shadow-card ring-1 ring-line">
        <div className="pointer-events-none absolute -right-16 -top-10 size-72 rounded-full bg-gold-light/20 blur-3xl" aria-hidden="true" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-primary">
              <UserCog className="size-4" aria-hidden="true" /> Konfigurasi Akun Pelanggan
            </p>
            <h1 className="pt-3 text-3xl font-extrabold leading-tight tracking-tight text-ink sm:text-4xl">Pengaturan Profil & Berkas Ukuran Siswa Tersimpan</h1>
            <p className="pt-3 text-base leading-relaxed text-ink-soft">
              Kelola data kontak penanggung jawab, alamat pengiriman, dan berkas rekap ukuran siswa untuk pemesanan berikutnya.
            </p>
          </div>
          <div className="flex flex-col gap-4 rounded-2xl bg-beige-soft p-4 sm:flex-row sm:items-center">
            <Stat icon={<Sheet className="size-5" />} label="Total Berkas Tersimpan" value={`${rosters.length} Spreadsheet`} />
            <span className="hidden h-12 w-px bg-line-strong sm:block" aria-hidden="true" />
            <Stat icon={<Users className="size-5" />} label="Siswa Terkatalog" value={`${totalStudents} Personel`} gold />
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 pt-8 lg:grid-cols-[1fr_492px]">
        <div className="flex flex-col gap-6">
          <Panel icon={<Building2 className="size-5" />} title="Data Identitas & PIC" subtitle="Kontak resmi penanggung jawab pemesanan busana" badge="Akun Pelanggan">
            <form action={identityAction} className="flex flex-col gap-5">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <Input label="Nama Lengkap / Penanggung Jawab (PIC)" name="name" required defaultValue={user.name} leftIcon={<UserIcon className="size-4" />} error={identityState.fieldErrors?.name} />
                <Input label="Nomor Telepon / WhatsApp" name="phone" type="tel" defaultValue={user.phone ?? ''} placeholder="+62 812-xxxx-xxxx" leftIcon={<Phone className="size-4" />} error={identityState.fieldErrors?.phone} />
              </div>
              <Input label="Email Akun" name="email" type="email" defaultValue={user.email} disabled leftIcon={<Mail className="size-4" />} hint="Email digunakan untuk masuk dan tidak dapat diubah dari sini." />
              <FormFeedback state={identityState} />
              <div className="flex justify-end">
                <SubmitButton label="Perbarui Data Identitas" loadingLabel="Menyimpan..." fullWidth={false} size="lg" icon={<Save className="size-4" aria-hidden="true" />} />
              </div>
            </form>
          </Panel>

          <Panel icon={<Truck className="size-5" />} title="Alamat Pengiriman & Ekspedisi Logistik" subtitle="Hub serah terima koli dan peti pakaian seragam" badge="Default Pesanan" badgeGold>
            <form action={addressAction} className="flex flex-col gap-5">
              <Input label="Nama Penerima / Gedung Tujuan" name="recipient" defaultValue={recipient} placeholder="Contoh: Gedung Kesenian & Ruang Alat (Blok C Lantai 1)" leftIcon={<Building2 className="size-4" />} />
              <Textarea label="Alamat Lengkap Pengiriman" name="street" required rows={3} defaultValue={street} placeholder="Jalan, kelurahan, kecamatan, kota, kode pos" error={addressState.fieldErrors?.street} />
              <div className="flex items-center gap-4 rounded-xl bg-canvas p-3">
                <span className="flex size-14 shrink-0 items-center justify-center rounded-lg bg-beige-soft text-primary">
                  <MapPin className="size-6" aria-hidden="true" />
                </span>
                <p className="text-[13px] leading-5 text-ink-soft">
                  Alamat ini otomatis dipakai sebagai alamat pengiriman pada formulir pesanan seragam. Ekspedisi dan ongkir ditentukan bengkel sesuai volume.
                </p>
              </div>
              <FormFeedback state={addressState} />
              <div className="flex justify-end">
                <SubmitButton label="Ubah Alamat Pengiriman" loadingLabel="Menyimpan..." fullWidth={false} size="lg" icon={<CircleCheck className="size-4" aria-hidden="true" />} />
              </div>
            </form>
          </Panel>
        </div>

        <Panel icon={<FileText className="size-5" />} title="Berkas Ukuran Siswa Tersimpan" subtitle="Format spreadsheet (.xlsx / .csv)" iconGold>
          <div className="flex gap-3 rounded-xl bg-canvas p-4">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-warning-bg text-gold-dark">
              <Info className="size-4" aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-semibold text-ink">Kebijakan Pengisian Terpusat</p>
              <p className="pt-1 text-[13px] leading-5 text-ink-soft">
                Pencatatan data ukuran terpusat melalui file spreadsheet. Unggah template yang telah diisi tanpa perlu input manual per anak di web.
              </p>
            </div>
          </div>

          <p className="pt-6 text-xs font-semibold uppercase tracking-wide text-ink-soft">Standardisasi Format</p>
          <button type="button" onClick={downloadRosterTemplate} className="mt-2 flex w-full items-center gap-4 rounded-xl bg-surface p-4 text-left shadow-soft ring-1 ring-line hover:ring-primary">
            <span className="flex size-10 items-center justify-center rounded-lg bg-success-bg text-success">
              <FileSpreadsheet className="size-5" aria-hidden="true" />
            </span>
            <span className="flex-1">
              <span className="block text-sm font-bold text-ink">Unduh Template Resmi</span>
              <span className="block text-[13px] text-ink-soft">Kolom nama, jenis kelamin, tinggi, ukuran, dan peran</span>
            </span>
            <Download className="size-4 text-primary" aria-hidden="true" />
          </button>

          <p className="pt-6 text-xs font-semibold uppercase tracking-wide text-ink-soft">Unggah Pembaruan</p>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              handleUpload(e.dataTransfer.files?.[0]);
            }}
            className="mt-2 flex w-full flex-col items-center rounded-xl bg-canvas px-6 py-8 text-center transition-colors hover:bg-beige-soft"
          >
            <span className="flex size-14 items-center justify-center rounded-xl bg-beige-soft text-primary">
              {uploading ? <Loader2 className="size-6 animate-spin" aria-hidden="true" /> : <FileUp className="size-6" aria-hidden="true" />}
            </span>
            <span className="pt-4 text-lg font-bold text-ink">Unggah Rekap Berkas Baru</span>
            <span className="pt-1 text-[13px] text-ink-soft">Tarik dan lepaskan file spreadsheet atau klik untuk menelusuri komputer Anda.</span>
            <span className="mt-3 flex items-center gap-1.5 rounded bg-beige-soft px-2 py-1 font-mono text-xs font-bold text-ink-soft">
              <CircleCheck className="size-3.5" aria-hidden="true" /> Dukungan format: .xlsx, .csv
            </span>
          </button>
          <input ref={fileRef} type="file" accept=".xlsx,.csv" className="sr-only" onChange={(e) => handleUpload(e.target.files?.[0])} />
          <ErrorMessage message={uploadError} className="mt-3" />

          <div className="flex items-center justify-between pt-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">Arsip Berkas Tersimpan</p>
            <p className="text-xs font-semibold text-primary">{rosters.length} berkas</p>
          </div>
          <ul className="flex flex-col gap-3 pt-3">
            {rosters.length === 0 && <li className="rounded-xl bg-canvas p-4 text-center text-sm text-ink-soft">Belum ada berkas tersimpan.</li>}
            {rosters.map((r) => (
              <li key={r.id} className="flex items-center gap-3 rounded-xl bg-canvas p-4 shadow-soft">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-success-bg text-success">
                  <FileText className="size-5" aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-ink">{r.fileName}</p>
                  <p className="flex flex-wrap items-center gap-1.5 pt-0.5 text-xs text-ink-soft">
                    <span className="rounded bg-beige-soft px-1.5 py-0.5 font-semibold text-primary">{r.rows.length} Siswa Terdata</span>
                    Diunggah {formatDate(r.savedAt)}
                  </p>
                </div>
                <button type="button" onClick={() => downloadRosterCsv(r)} className="flex items-center gap-1.5 rounded-lg bg-surface px-3 py-2 text-xs font-semibold text-primary shadow-soft hover:bg-beige-soft">
                  <Download className="size-3.5" aria-hidden="true" /> Unduh
                </button>
                <button
                  type="button"
                  onClick={() => deleteSavedRoster(r.id)}
                  aria-label={`Hapus ${r.fileName}`}
                  className="flex size-9 items-center justify-center rounded-lg bg-surface text-danger shadow-soft hover:bg-danger-bg"
                >
                  <Trash2 className="size-4" aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
          <p className="flex items-start gap-2 pt-5 text-[13px] text-ink-soft">
            <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
            Berkas disimpan di perangkat ini dan bisa dipilih ulang saat mengisi Langkah 2 formulir Paket Standar.
          </p>
        </Panel>
      </div>

      <div className="pt-8">
        <CtaBanner
          eyebrow="Standar Pemotongan & Penjahitan Presisi"
          title="Penyelarasan Akurat Berdasarkan Data Spreadsheet"
          description="Setiap baris ukuran di berkas spreadsheet menjadi acuan pemotongan pola kami, memastikan seragam marching band, paduan suara, dan kontingen parade Anda pas tanpa perlu pengukuran tatap muka berulang."
          decoration={<Ruler className="pointer-events-none absolute right-12 top-1/2 hidden size-48 -translate-y-1/2 text-white/10 md:block" aria-hidden="true" />}
        />
      </div>
    </PageContainer>
  );
}

function Panel({
  icon,
  title,
  subtitle,
  badge,
  badgeGold = false,
  iconGold = false,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  badge?: string;
  badgeGold?: boolean;
  iconGold?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section className="h-fit overflow-hidden rounded-2xl bg-surface shadow-card ring-1 ring-line">
      <div className="flex items-center justify-between gap-3 bg-canvas px-8 py-6">
        <div className="flex items-center gap-3">
          <span className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${iconGold ? 'bg-gold text-on-gold' : 'bg-primary text-on-primary'}`}>{icon}</span>
          <div>
            <h2 className="text-lg font-bold text-ink">{title}</h2>
            <p className="text-xs text-ink-soft">{subtitle}</p>
          </div>
        </div>
        {badge && (
          <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${badgeGold ? 'bg-warning-bg text-gold-dark' : 'bg-beige-soft text-primary'}`}>{badge}</span>
        )}
      </div>
      <div className="p-8">{children}</div>
    </section>
  );
}

function Stat({ icon, label, value, gold = false }: { icon: React.ReactNode; label: string; value: string; gold?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <span className={`flex size-12 items-center justify-center rounded-xl ${gold ? 'bg-warning-bg text-gold-dark' : 'bg-surface text-primary'}`}>{icon}</span>
      <div>
        <p className="text-[11px] font-semibold uppercase text-ink-soft">{label}</p>
        <p className="text-lg font-bold text-ink">{value}</p>
      </div>
    </div>
  );
}

function FormFeedback({ state }: { state: ProfileActionState }) {
  if (state.success) {
    return (
      <p role="status" className="flex items-center gap-2 rounded-lg bg-success-bg px-4 py-2.5 text-sm font-semibold text-success">
        <CircleCheck className="size-4" aria-hidden="true" /> {state.success}
      </p>
    );
  }
  return <ErrorMessage message={state.error} />;
}
