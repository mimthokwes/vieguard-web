"use client";

import React, { useActionState, useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  CheckCircle2,
  Download,
  Eye,
  EyeOff,
  FileSpreadsheet,
  FileText,
  ImagePlus,
  Link2,
  Loader2,
  MessagesSquare,
  Ruler,
  Send,
  Trash2,
  UploadCloud,
} from 'lucide-react';
import { PageContainer, PageHeader } from '@/components/layout/page-header';
import { Button, ButtonLink } from '@/components/ui/button';
import { Input, Select, Textarea } from '@/components/ui/input';
import { ErrorMessage } from '@/components/ui/error-message';
import { SubmitButton } from '@/components/ui/submit-button';
import { submitCustomOrder, OrderActionState } from '@/modules/order/actions';
import { JENJANG_OPTIONS } from '@/modules/order/data';
import { downloadRosterTemplate, parseRosterFile, RosterResult } from '@/lib/roster/roster';

const CATEGORY_OPTIONS = [
  'Seragam Pasukan Drumband',
  'Kostum Mayoret / Gitapati',
  'Kostum Field Commander',
  'Kostum Color Guard & Bendera',
  'Kostum Pawai & Karnaval Adat',
  'Jas Almamater / Institusi',
  'Lainnya',
];

const MATERIAL_OPTIONS = [
  { value: 'Katun', label: 'Katun (Adem, nyaman, & menyerap keringat)' },
  { value: 'Rayon', label: 'Rayon (Lembut, jatuh, & sejuk di kulit)' },
  { value: 'Linen', label: 'Linen (Kuat, bertekstur elegan, & serat alami)' },
  { value: 'Tencel', label: 'Tencel (Halus mewah, adem, & ramah lingkungan)' },
  { value: 'custom', label: 'Pilihan Sendiri (Tulis jenis kain sendiri)' },
];

export interface SizeFileAttachment {
  fileName: string;
  fileSize: number;
  fileType: 'excel' | 'pdf';
  parsedRoster?: RosterResult | null;
  rawFile?: File;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const initialState: OrderActionState = {};

interface CustomViewProps {
  accessories?: { name: string; description?: string | null }[];
  isLoggedIn?: boolean;
}

export function CustomView({ accessories = [], isLoggedIn = true }: CustomViewProps) {
  const [state, formAction] = useActionState(submitCustomOrder, initialState);
  const [description, setDescription] = useState('');
  const [materialType, setMaterialType] = useState<string>('Katun');
  const [customMaterial, setCustomMaterial] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('20');
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [selectedRefFiles, setSelectedRefFiles] = useState<File[]>([]);

  // Size file attachment state
  const [sizeFile, setSizeFile] = useState<SizeFileAttachment | null>(null);
  const [dragging, setDragging] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);
  const [showRosterPreview, setShowRosterPreview] = useState(false);
  const sizeFileInputRef = useRef<HTMLInputElement>(null);

  const err = state.fieldErrors ?? {};

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newFiles = Array.from(files);
    setSelectedRefFiles((prev) => [...prev, ...newFiles]);
    newFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPreviewImages((prev) => [...prev, String(event.target?.result)]);
        }
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const removePreview = (index: number) => {
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
    setSelectedRefFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCustomFormSubmit = (formData: FormData) => {
    for (const file of selectedRefFiles) {
      formData.append('referencePhotos', file);
    }
    formAction(formData);
  };

  const handleSizeFile = async (file: File) => {
    setParseError(null);
    const lower = file.name.toLowerCase();
    const isExcel = lower.endsWith('.xlsx') || lower.endsWith('.xls') || lower.endsWith('.csv');
    const isPdf = lower.endsWith('.pdf');

    if (!isExcel && !isPdf) {
      setParseError('Format berkas tidak didukung. Harap unggah berkas .xlsx, .xls, .csv, atau .pdf.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setParseError('Ukuran berkas maksimal 10MB.');
      return;
    }

    if (isExcel) {
      setParsing(true);
      try {
        const roster = await parseRosterFile(file);
        setSizeFile({
          fileName: file.name,
          fileSize: file.size,
          fileType: 'excel',
          parsedRoster: roster,
          rawFile: file,
        });
        if (roster.rows.length > 0) {
          setQuantity(String(roster.rows.length));
        }
      } catch (err: any) {
        setParseError(err.message || 'Gagal membaca isi berkas Excel. Pastikan format kolom sesuai template resmi.');
      } finally {
        setParsing(false);
      }
    } else {
      setSizeFile({
        fileName: file.name,
        fileSize: file.size,
        fileType: 'pdf',
        parsedRoster: null,
        rawFile: file,
      });
    }
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
        <form action={handleCustomFormSubmit} className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]">
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
                    type="text"
                    inputMode="numeric"
                    required
                    value={quantity}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '');
                      setQuantity(val);
                    }}
                    placeholder="Contoh: 20"
                    rightSlot={<span className="pr-3 text-xs font-semibold text-ink-soft">Stel</span>}
                    hint="Bebas masukkan angka jumlah kebutuhan (misal 20, 30, atau 50 stel)."
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

            {/* 02. Pilihan Bahan (Dropdown Awam & Opsi Custom) */}
            <SectionCard step="02" title="Pilihan Bahan">
              <div className="space-y-4">
                <Select
                  label="Pilihan Jenis Bahan *"
                  name="materialSelect"
                  value={materialType}
                  onChange={(e) => setMaterialType(e.target.value)}
                >
                  {MATERIAL_OPTIONS.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </Select>

                {materialType === 'custom' && (
                  <Input
                    label="Nama Bahan Pilihan Sendiri *"
                    name="customMaterialText"
                    required
                    value={customMaterial}
                    onChange={(e) => setCustomMaterial(e.target.value)}
                    placeholder="Tuliskan jenis kain yang Anda inginkan (misal: Drill American, Velvet, Satin, dll.)"
                  />
                )}

                <input
                  type="hidden"
                  name="material"
                  value={materialType === 'custom' ? customMaterial.trim() : materialType}
                />

                <Input
                  label="Catatan Karakteristik Bahan (Opsional)"
                  name="materialDetail"
                  placeholder="Contoh: Tekstur tebal, warna doff, tidak mudah kusut"
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

            {/* 04. Aksesoris Tambahan (Kolom Input Teks) */}
            <SectionCard step="04" title="Aksesoris Tambahan (Opsional)">
              <div className="space-y-3">
                <Textarea
                  label="Daftar Aksesoris yang Dibutuhkan"
                  name="accessoriesInput"
                  rows={3}
                  placeholder="Tuliskan aksesoris yang Anda butuhkan, contoh: Topi Shako 30 pcs, Sarung Tangan Putih 30 pasang, Sayap Mayoret, Selempang Dada Emas, dll."
                  hint="Tuliskan semua aksesoris yang Anda perlukan. Pisahkan dengan tanda koma (,) atau baris baru."
                />
              </div>
            </SectionCard>

            {/* 05. Upload Berkas Ukuran & Tanggal Acara */}
            <SectionCard step="05" title="Upload Berkas Ukuran & Tanggal Acara">
              <div className="space-y-6">
                {/* Info Card & Unduh Template */}
                <div className="rounded-xl border border-primary/20 bg-beige-soft p-5">
                  <div className="flex items-start gap-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary text-on-primary">
                      <Ruler className="size-5" />
                    </span>
                    <div>
                      <h3 className="text-base font-bold text-primary">Berkas Ukuran (Excel / PDF)</h3>
                      <p className="pt-1 text-sm leading-relaxed text-ink-soft">
                        Unggah daftar nama dan ukuran seragam menggunakan template <strong>Excel resmi</strong> atau berkas <strong>PDF</strong>.
                        Sistem akan otomatis mendeteksi jumlah kebutuhan dan rincian ukuran per siswa agar langsung masuk ke pesanan di sistem kami.
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-line/60 pt-4">
                    <span className="text-xs text-ink-soft">
                      Belum punya format ukuran? Unduh template Excel terstandar:
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={downloadRosterTemplate}
                      className="!border-primary !text-primary hover:!bg-primary/10"
                    >
                      <Download className="size-3.5" /> Unduh Template Excel
                    </Button>
                  </div>
                </div>

                {parseError && (
                  <div className="rounded-xl border border-danger/30 bg-danger/10 p-3 text-xs text-danger">
                    {parseError}
                  </div>
                )}

                {/* Upload Area atau Kartu Berkas Terunggah */}
                {!sizeFile ? (
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragging(true);
                    }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setDragging(false);
                      const file = e.dataTransfer.files?.[0];
                      if (file) handleSizeFile(file);
                    }}
                    onClick={() => sizeFileInputRef.current?.click()}
                    className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition-colors ${
                      dragging
                        ? 'border-primary bg-beige-soft'
                        : 'border-line bg-canvas hover:border-primary hover:bg-beige-soft/40'
                    }`}
                  >
                    <input
                      ref={sizeFileInputRef}
                      type="file"
                      accept=".xlsx,.xls,.csv,.pdf,application/pdf,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleSizeFile(file);
                      }}
                    />

                    {parsing ? (
                      <div className="flex flex-col items-center gap-2 py-4">
                        <Loader2 className="size-8 animate-spin text-primary" />
                        <p className="text-sm font-semibold text-ink">Sedang memproses berkas ukuran...</p>
                      </div>
                    ) : (
                      <>
                        <div className="flex size-14 items-center justify-center rounded-2xl bg-surface shadow-soft ring-1 ring-line">
                          <UploadCloud className="size-7 text-primary" />
                        </div>
                        <h4 className="pt-3 text-base font-bold text-ink">Unggah Berkas Ukuran</h4>
                        <p className="pt-1 text-sm text-ink-soft max-w-md">
                          Tarik dan lepas berkas Excel (.xlsx, .csv) atau PDF di sini, atau klik untuk memilih berkas dari perangkat Anda.
                        </p>
                        <span className="mt-3 inline-flex items-center rounded-full bg-beige-soft px-3 py-1 text-xs font-semibold text-primary">
                          Maksimal 10MB
                        </span>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-line bg-canvas p-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex size-12 shrink-0 items-center justify-center rounded-xl ${
                            sizeFile.fileType === 'excel' ? 'bg-success/15 text-success' : 'bg-danger/15 text-danger'
                          }`}
                        >
                          {sizeFile.fileType === 'excel' ? (
                            <FileSpreadsheet className="size-6" />
                          ) : (
                            <FileText className="size-6" />
                          )}
                        </div>
                        <div className="overflow-hidden">
                          <div className="flex items-center gap-2">
                            <p className="truncate font-bold text-ink text-sm sm:text-base">{sizeFile.fileName}</p>
                            <span
                              className={`rounded px-2 py-0.5 text-[11px] font-bold uppercase ${
                                sizeFile.fileType === 'excel'
                                  ? 'bg-success/15 text-success'
                                  : 'bg-danger/15 text-danger'
                              }`}
                            >
                              {sizeFile.fileType}
                            </span>
                          </div>
                          <p className="pt-0.5 text-xs text-ink-soft">
                            Ukuran: {formatFileSize(sizeFile.fileSize)} •{' '}
                            <span className="font-semibold text-success">Berkas Terlampir untuk Admin</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => sizeFileInputRef.current?.click()}
                        >
                          Ganti Berkas
                        </Button>
                        <button
                          type="button"
                          onClick={() => setSizeFile(null)}
                          className="flex size-9 items-center justify-center rounded-lg border border-line text-ink-soft transition hover:border-danger hover:bg-danger/10 hover:text-danger"
                          title="Hapus Berkas"
                          aria-label="Hapus Berkas"
                        >
                          <Trash2 className="size-4" />
                        </button>
                        <input
                          ref={sizeFileInputRef}
                          type="file"
                          accept=".xlsx,.xls,.csv,.pdf,application/pdf,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleSizeFile(file);
                          }}
                        />
                      </div>
                    </div>

                    {/* Ringkasan jika berkas Excel */}
                    {sizeFile.parsedRoster && (
                      <div className="mt-4 border-t border-line pt-4">
                        <div className="flex flex-wrap items-center justify-between gap-2 pb-3">
                          <p className="text-xs font-semibold text-ink-soft">
                            Terdeteksi: <strong className="text-ink">{sizeFile.parsedRoster.rows.length} data siswa</strong>
                          </p>
                          <button
                            type="button"
                            onClick={() => setShowRosterPreview((v) => !v)}
                            className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                          >
                            {showRosterPreview ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                            {showRosterPreview ? 'Sembunyikan Tabel' : 'Lihat Rincian Data'}
                          </button>
                        </div>

                        {/* Rincian per Ukuran */}
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(sizeFile.parsedRoster.sizeCounts).map(([size, count]) => (
                            <span
                              key={size}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface px-2.5 py-1 text-xs font-bold text-ink"
                            >
                              <span>Ukuran {size}:</span>
                              <span className="text-primary">{count} unit</span>
                            </span>
                          ))}
                        </div>

                        {/* Tabel Preview */}
                        {showRosterPreview && (
                          <div className="mt-4 max-h-60 overflow-y-auto rounded-xl border border-line bg-surface">
                            <table className="w-full text-left text-xs">
                              <thead className="sticky top-0 bg-canvas border-b border-line text-ink-soft">
                                <tr>
                                  <th className="p-2.5">No</th>
                                  <th className="p-2.5">Nama Siswa</th>
                                  <th className="p-2.5">L/P</th>
                                  <th className="p-2.5">Tinggi</th>
                                  <th className="p-2.5">Ukuran</th>
                                  <th className="p-2.5">Peran</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-line">
                                {sizeFile.parsedRoster.rows.map((row, idx) => (
                                  <tr key={idx} className="hover:bg-canvas/50">
                                    <td className="p-2.5 text-ink-soft">{idx + 1}</td>
                                    <td className="p-2.5 font-medium text-ink">{row.name}</td>
                                    <td className="p-2.5 text-ink-soft">{row.gender || '-'}</td>
                                    <td className="p-2.5 text-ink-soft">{row.heightCm ? `${row.heightCm} cm` : '-'}</td>
                                    <td className="p-2.5 font-bold text-primary">{row.size}</td>
                                    <td className="p-2.5 text-ink-soft">{row.role || '-'}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Hidden input data roster yang akan diparsing oleh server action */}
                <input
                  type="hidden"
                  name="rosterPayload"
                  value={
                    sizeFile
                      ? JSON.stringify({
                          fileName: sizeFile.fileName,
                          fileSize: sizeFile.fileSize,
                          fileType: sizeFile.fileType,
                          totalCount: sizeFile.parsedRoster?.rows.length || (Number(quantity) || 1),
                          sizeCounts: sizeFile.parsedRoster?.sizeCounts,
                          rows: sizeFile.parsedRoster?.rows,
                          rawHeaders: sizeFile.parsedRoster?.rawHeaders,
                          rawRows: sizeFile.parsedRoster?.rawRows,
                        })
                      : ''
                  }
                />

                {/* Target Tanggal Acara & Catatan Tambahan */}
                <div className="border-t border-line pt-4 space-y-4">
                  <Input
                    label="Target Tanggal / Rentang Waktu Acara *"
                    name="eventDate"
                    type="text"
                    required
                    placeholder="Contoh: 24 Nov - 30 Nov 2026 atau 24 November 2026"
                    hint="Tuliskan tanggal atau rentang waktu acara seragam akan digunakan (misal: 24 Nov - 30 Nov 2026)."
                    error={err.eventDate}
                  />

                  <Textarea
                    label="Catatan Tambahan (Opsional)"
                    name="consultationNote"
                    rows={2}
                    placeholder="Catatan tambahan untuk tim penjahit dan desainer VieGuard"
                  />
                </div>
              </div>
            </SectionCard>
          </div>

          {/* ─── Sidebar Aksi & Konsultasi ─── */}
          <aside className="lg:sticky lg:top-28 lg:h-fit">
            <div className="rounded-2xl bg-surface p-5 shadow-card ring-1 ring-line space-y-4">
              <div>
                <h3 className="font-bold text-ink text-base">Kirim Permohonan</h3>
                <p className="mt-1 text-xs text-ink-soft">
                  Desain dan berkas ukuran akan ditinjau admin untuk konfirmasi kelayakan produksi & penawaran resmi.
                </p>
              </div>

              {sizeFile && (
                <div className="rounded-xl border border-line bg-beige-soft/60 p-3 text-xs">
                  <p className="font-semibold text-ink">Berkas Ukuran Terpasang:</p>
                  <p className="truncate font-bold text-primary mt-0.5">{sizeFile.fileName}</p>
                  <p className="text-ink-soft mt-0.5">
                    {sizeFile.parsedRoster?.rows.length
                      ? `${sizeFile.parsedRoster.rows.length} Siswa Terdaftar`
                      : `${sizeFile.fileType.toUpperCase()} Terlampir`}
                  </p>
                </div>
              )}

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
