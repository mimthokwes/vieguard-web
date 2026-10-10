"use client";

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeftRight,
  CircleCheck,
  CircleHelp,
  Download,
  Eye,
  EyeOff,
  FileSpreadsheet,
  FileText,
  Info,
  Loader2,
  MessageSquare,
  PersonStanding,
  Phone,
  Ruler,
  Save,
  ShieldCheck,
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ErrorMessage } from '@/components/ui/error-message';
import { downloadRosterTemplate, parseRosterFile, RosterResult } from '@/lib/roster/roster';
import { saveRoster, useSavedRosters } from '@/lib/roster/saved-rosters';
import { StandardDraft } from './standard-draft';
import { SummaryRow } from './stepper';

const GUIDE = [
  { icon: Ruler, title: '1. Gunakan Pita Ukur Fleksibel', body: 'Gunakan meteran jahit fleksibel (pita kain), jangan gunakan penggaris kaku atau pita tukang bangunan untuk menghindari deviasi lekuk tubuh.' },
  { icon: PersonStanding, title: '2. Ukuran Pas Badan (Bukan Baju Longgar)', body: 'Ukur pas di atas kaos tipis tanpa menarik pita terlalu kencang. Pola kami sudah mengalkulasi toleransi ruang gerak 4-6 cm.' },
  { icon: FileText, title: '3. Tuliskan Kode Ukuran Sesuai Standar', body: 'Masukkan angka dalam satuan sentimeter (cm). Untuk ukuran shako, gunakan keliling kepala tepat di atas alis telinga (contoh: 56, 58).' },
  { icon: Save, title: '4. Simpan dalam Format .xlsx atau .csv', body: 'Pertahankan struktur header kolom dari template. Jangan mengubah urutan atau nama kolom bawaan.' },
];

interface StepRosterProps {
  draft: StandardDraft;
  update: (patch: Partial<StandardDraft>) => void;
  error?: string;
  storePhone?: string | null;
}

export function StepRoster({ draft, update, error, storePhone }: StepRosterProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [parsing, setParsing] = useState(false);
  const [parseError, setParseError] = useState('');
  const [dragging, setDragging] = useState(false);
  const [preview, setPreview] = useState(false);
  const saved = useSavedRosters();
  const roster = draft.roster;

  const handleFile = async (file?: File | null) => {
    if (!file) return;
    setParsing(true);
    setParseError('');
    try {
      const parsed = await parseRosterFile(file);
      update({ roster: parsed });
      saveRoster(parsed);
    } catch (e) {
      setParseError((e as Error).message);
    } finally {
      setParsing(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_390px]">
      <div className="flex flex-col gap-6">
        <section className="flex flex-col gap-6 rounded-2xl bg-beige-soft p-8 ring-1 ring-beige md:flex-row md:items-center md:justify-between">
          <div className="max-w-md">
            <h2 className="flex items-center gap-2 font-semibold text-primary">
              <Download className="size-5" aria-hidden="true" /> Unduh Berkas Template Resmi
            </h2>
            <p className="pt-2 text-sm leading-relaxed text-ink-soft">
              Unduh format tabel yang telah disesuaikan dengan parameter pengukuran seragam drum band & marching band (Lingkar Dada, Panjang Lengan, Panjang Celana/Rok, Ukuran Topi Shako).
            </p>
            <div className="flex flex-wrap gap-x-8 gap-y-1 pt-3 text-sm text-ink-soft">
              <span className="flex items-center gap-1.5"><CircleCheck className="size-3.5" aria-hidden="true" /> Kolom Terstandar</span>
              <span className="flex items-center gap-1.5"><ArrowLeftRight className="size-3.5" aria-hidden="true" /> Bisa dibuka di MS Excel</span>
            </div>
          </div>
          <Button size="lg" onClick={downloadRosterTemplate} className="shrink-0">
            <Download className="size-4" aria-hidden="true" /> Unduh Template Excel
          </Button>
        </section>

        <section className="rounded-2xl bg-surface p-8 shadow-card ring-1 ring-line">
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              handleFile(e.dataTransfer.files?.[0]);
            }}
            className={`flex flex-col items-center rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-colors ${
              dragging ? 'border-primary bg-beige-soft' : 'border-transparent bg-canvas'
            }`}
          >
            <span className="flex size-20 items-center justify-center rounded-2xl bg-surface text-primary shadow-card">
              {parsing ? <Loader2 className="size-8 animate-spin" aria-hidden="true" /> : <FileText className="size-8" aria-hidden="true" />}
            </span>
            <p className="pt-6 text-ink">Tarik & Letakkan Berkas Excel yang Sudah Diisi ke Sini</p>
            <p className="pt-1 text-sm text-ink-soft">
              atau{' '}
              <button type="button" onClick={() => inputRef.current?.click()} className="font-semibold text-primary underline">
                Klik untuk Memilih Berkas dari Komputer
              </button>
            </p>
            <input
              ref={inputRef}
              type="file"
              accept=".xlsx,.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv"
              className="sr-only"
              onChange={(e) => handleFile(e.target.files?.[0])}
            />
            <span className="mt-5 flex items-center gap-2 rounded-lg bg-beige-soft px-3 py-1.5 text-sm text-ink-soft">
              <Info className="size-4" aria-hidden="true" /> Mendukung format .xlsx atau .csv (Maksimum 10MB)
            </span>
            <div className="flex gap-6 pt-5 text-sm text-muted">
              <span className="flex items-center gap-1"><CircleCheck className="size-3.5" aria-hidden="true" /> Validasi Baris Otomatis</span>
              <span className="flex items-center gap-1"><ShieldCheck className="size-3.5" aria-hidden="true" /> Diproses di Perangkat Anda</span>
            </div>
          </div>

          <ErrorMessage message={parseError || error} className="mt-4" />

          {roster && <RosterFileRow roster={roster} preview={preview} onTogglePreview={() => setPreview((v) => !v)} onRemove={() => update({ roster: null })} />}
          {roster && preview && <RosterPreview roster={roster} />}

          {!roster && saved.length > 0 && (
            <div className="mt-6">
              <p className="pb-2 text-xs font-semibold uppercase tracking-wide text-ink-soft">Atau gunakan berkas tersimpan</p>
              <ul className="flex flex-col gap-2">
                {saved.map((r) => (
                  <li key={r.id} className="flex items-center gap-3 rounded-xl bg-canvas p-3">
                    <FileSpreadsheet className="size-5 shrink-0 text-success" aria-hidden="true" />
                    <span className="min-w-0 flex-1 truncate text-sm text-ink">
                      {r.fileName} <span className="text-xs text-muted">· {r.rows.length} siswa</span>
                    </span>
                    <Button size="sm" variant="soft" onClick={() => update({ roster: r })}>
                      Gunakan
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        <section className="rounded-2xl bg-surface p-8 shadow-card ring-1 ring-line">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-ink">Petunjuk & Standar Pengukuran Lapangan</h2>
              <p className="pt-1 text-sm text-ink-soft">Pastikan tim pembina mengikuti panduan teknis berikut sebelum menyalin data ke dalam tabel excel.</p>
            </div>
            <Ruler className="size-6 shrink-0 text-ink" aria-hidden="true" />
          </div>
          <ul className="grid grid-cols-1 gap-4 pt-6 md:grid-cols-2">
            {GUIDE.map(({ icon: Icon, title, body }) => (
              <li key={title} className="flex gap-3 rounded-xl bg-beige-soft/70 p-3">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-surface text-primary">
                  <Icon className="size-4" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-ink">{title}</p>
                  <p className="pt-1 text-sm leading-6 text-ink-soft">{body}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <aside className="flex flex-col gap-6">
        <div className="rounded-2xl bg-surface p-6 shadow-card ring-1 ring-line">
          <div className="flex items-start justify-between gap-3 pb-4">
            <div>
              <p className="text-sm uppercase tracking-wider text-ink-soft">Ringkasan Pesanan</p>
              <p className="text-ink">{draft.institution || 'Paket Standar Institusi'}</p>
            </div>
            <span className="rounded-full bg-beige-soft px-3 py-1 text-sm text-primary">Standard Tier</span>
          </div>
          <SummaryRow label="Kategori Seragam" value={draft.category || '-'} />
          <SummaryRow label="Jumlah Personil" value={roster ? `${roster.rows.length} Personil` : 'Belum diunggah'} />
          <SummaryRow label="Metode Validasi Ukuran" value="Excel Batch Import" accent />
          <SummaryRow label="Revisi Data" value={<span className="text-gold-dark">Sebelum dikonfirmasi admin</span>} />
          <div className="mt-4 rounded-xl bg-beige-soft p-4">
            <p className="flex items-center gap-2 font-semibold text-primary">
              <ShieldCheck className="size-4" aria-hidden="true" /> Klausul Produksi Penjahitan
            </p>
            <p className="pt-1 text-sm leading-6 text-ink-soft">
              Produksi massal penjahitan seragam dimulai 1 hari kerja setelah data ukuran tervalidasi pada langkah konfirmasi akhir.
            </p>
          </div>
        </div>

        <div className="rounded-2xl bg-surface p-6 shadow-card ring-1 ring-line">
          <p className="flex items-center gap-2 text-ink">
            <CircleHelp className="size-4 text-primary" aria-hidden="true" /> Butuh Bantuan Pengukuran?
          </p>
          <p className="pt-2 text-sm leading-6 text-ink-soft">
            Jika sekolah Anda membutuhkan kunjungan tim teknis untuk asistensi pengukuran langsung di workshop/sekolah:
          </p>
          <div className="flex flex-col gap-2 pt-4">
            {storePhone && (
              <a href={`tel:${storePhone}`} className="flex items-center gap-3 rounded-xl bg-beige-soft p-3 hover:bg-beige">
                <span className="flex size-8 items-center justify-center rounded-lg bg-surface text-primary"><Phone className="size-4" aria-hidden="true" /></span>
                <span className="text-sm">
                  <span className="block text-ink-soft">Layanan Telepon Workshop</span>
                  <span className="block text-primary">{storePhone}</span>
                </span>
              </a>
            )}
            <Link href="/chat?topic=Bantuan%20pengukuran%20seragam" className="flex items-center gap-3 rounded-xl bg-beige-soft p-3 hover:bg-beige">
              <span className="flex size-8 items-center justify-center rounded-lg bg-surface text-primary"><MessageSquare className="size-4" aria-hidden="true" /></span>
              <span className="text-sm">
                <span className="block text-ink-soft">Live Chat Penjahit Senior</span>
                <span className="block text-primary">Konsultasi Pola Tubuh Online</span>
              </span>
            </Link>
          </div>
        </div>
      </aside>
    </div>
  );
}

export function RosterFileRow({
  roster,
  preview,
  onTogglePreview,
  onRemove,
}: {
  roster: RosterResult;
  preview: boolean;
  onTogglePreview: () => void;
  onRemove?: () => void;
}) {
  return (
    <div className="mt-6 flex items-center gap-4 rounded-xl bg-surface p-4 shadow-soft ring-1 ring-line">
      <FileSpreadsheet className="size-6 shrink-0 text-primary" aria-hidden="true" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-ink">
          {roster.fileName} <span className="text-sm text-muted">({Math.max(1, Math.round(roster.fileSize / 1024))} KB)</span>
        </p>
        <p className="flex flex-wrap items-center gap-x-2 text-sm">
          <span className="flex items-center gap-1 font-semibold text-success">
            <CircleCheck className="size-4" aria-hidden="true" /> Tervalidasi
          </span>
          <span className="text-ink-soft">• {roster.rows.length} Baris Siswa Terdeteksi</span>
          {roster.invalidRows.length > 0 && (
            <span className="text-warning">• {roster.invalidRows.length} baris dilewati (nama/ukuran kosong)</span>
          )}
        </p>
      </div>
      <button type="button" onClick={onTogglePreview} aria-label={preview ? 'Sembunyikan data' : 'Lihat data'} className="rounded-lg p-2 text-ink-soft hover:bg-beige-soft hover:text-primary">
        {preview ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
      </button>
      {onRemove && (
        <button type="button" onClick={onRemove} aria-label="Hapus berkas" className="rounded-lg p-2 text-ink-soft hover:bg-danger-bg hover:text-danger">
          <Trash2 className="size-5" />
        </button>
      )}
    </div>
  );
}

export function RosterPreview({ roster }: { roster: RosterResult }) {
  return (
    <div className="mt-4">
      <div className="flex flex-wrap gap-2 pb-3">
        {Object.entries(roster.sizeCounts).map(([size, count]) => (
          <span key={size} className="rounded-md bg-beige-soft px-2.5 py-1 text-xs font-bold text-primary">
            {size}: {count}
          </span>
        ))}
      </div>
      <div className="max-h-72 overflow-auto rounded-xl ring-1 ring-line">
        <table className="w-full text-left text-sm">
          <thead className="sticky top-0 bg-beige-soft text-xs uppercase text-ink-soft">
            <tr>
              <th className="px-3 py-2">#</th>
              <th className="px-3 py-2">Nama</th>
              <th className="px-3 py-2">L/P</th>
              <th className="px-3 py-2">Tinggi</th>
              <th className="px-3 py-2">Ukuran</th>
              <th className="px-3 py-2">Peran</th>
            </tr>
          </thead>
          <tbody>
            {roster.rows.map((r, i) => (
              <tr key={i} className="border-t border-line">
                <td className="px-3 py-1.5 text-muted">{i + 1}</td>
                <td className="px-3 py-1.5 text-ink">{r.name}</td>
                <td className="px-3 py-1.5">{r.gender ?? '-'}</td>
                <td className="px-3 py-1.5">{r.heightCm ? `${r.heightCm} cm` : '-'}</td>
                <td className="px-3 py-1.5 font-bold text-primary">{r.size}</td>
                <td className="px-3 py-1.5">{r.role ?? '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
