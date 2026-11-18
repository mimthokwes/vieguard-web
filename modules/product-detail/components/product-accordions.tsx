"use client";

import React, { useRef, useState } from 'react';
import {
  Archive,
  Check,
  Download,
  Eye,
  EyeOff,
  FileSpreadsheet,
  FileText,
  Loader2,
  Ruler,
  ShieldCheck,
  SprayCan,
  Trash2,
  UploadCloud,
} from 'lucide-react';
import { Product } from '@/types/product';
import { downloadRosterTemplate, parseRosterFile, RosterResult } from '@/lib/roster/roster';
import { Button } from '@/components/ui/button';
import { ErrorMessage } from '@/components/ui/error-message';

export interface SizeFileAttachment {
  file: File;
  fileName: string;
  fileSize: number;
  fileType: 'excel' | 'pdf';
  parsedRoster?: RosterResult | null;
}

const SANITATION = [
  { title: 'Pencucian Higienis', body: 'Setiap unit dicuci dan disetrika uap suhu tinggi setelah dikembalikan.' },
  { title: 'Inspeksi Fungsi & Jahitan', body: 'Kancing, resleting, dan ornamen diperiksa sebelum unit siap disewa kembali.' },
  { title: 'Garment Bag Tersegel', body: 'Tiap stel disimpan terpisah pada tas transparan anti-debu dengan label nomor stel.' },
];

const PRODUCTION_GUARANTEES = [
  { title: 'Pola Pas & Presisi', body: 'Setiap seragam dipotong berdasarkan rekap ukuran tubuh anggota tim Anda.' },
  { title: 'Material Kain Berkualitas', body: 'Bahan drill / wool touch premium pilihan dengan jahitan rapi ganda dan tahan lama.' },
  { title: 'Quality Control Menyeluruh', body: 'Inspeksi kancing, resleting, bordir, dan detail keliman sebelum proses pengiriman.' },
];

/** Splits a product description into checklist lines when it is written as a list. */
function componentLines(description?: string | null) {
  if (!description) return [];
  const parts = description
    .split(/\r?\n|;|•/)
    .map((s) => s.replace(/^[-*\d.\s]+/, '').trim())
    .filter(Boolean);
  return parts.length > 1 ? parts : [];
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

interface ProductTabsProps {
  product: Product;
  mode?: 'sewa' | 'beli';
  sizeFile?: SizeFileAttachment | null;
  onSizeFileChange?: (file: SizeFileAttachment | null) => void;
  activeTab?: 'components' | 'sizes' | 'sanitation';
  onTabChange?: (tab: 'components' | 'sizes' | 'sanitation') => void;
}

export function ProductTabs({
  product,
  mode = 'beli',
  sizeFile,
  onSizeFileChange,
  activeTab: controlledTab,
  onTabChange,
}: ProductTabsProps) {
  const [internalTab, setInternalTab] = useState<'components' | 'sizes' | 'sanitation'>('components');
  const tab = controlledTab ?? internalTab;
  const setTab = onTabChange ?? setInternalTab;

  const lines = componentLines(product.description);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [parsing, setParsing] = useState(false);
  const [parseError, setParseError] = useState('');
  const [dragging, setDragging] = useState(false);
  const [showRosterPreview, setShowRosterPreview] = useState(false);

  const TABS = [
    { key: 'components' as const, label: 'Komponen yang Didapat', icon: Archive },
    {
      key: 'sizes' as const,
      label: mode === 'beli' ? 'Deskripsi Ukuran' : 'Panduan Ukuran Armada',
      icon: Ruler,
    },
    {
      key: 'sanitation' as const,
      label: mode === 'beli' ? 'Jaminan Kualitas' : 'Protokol Sanitasi',
      icon: mode === 'beli' ? ShieldCheck : SprayCan,
    },
  ];

  const handleFile = async (file?: File | null) => {
    if (!file) return;
    setParseError('');
    const ext = file.name.toLowerCase();
    const isExcel = ext.endsWith('.xlsx') || ext.endsWith('.csv') || ext.endsWith('.xls');
    const isPdf = ext.endsWith('.pdf') || file.type === 'application/pdf';

    if (!isExcel && !isPdf) {
      setParseError('Format berkas tidak didukung. Harap unggah berkas Excel (.xlsx) atau PDF (.pdf).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setParseError('Ukuran berkas melebihi batas 10MB.');
      return;
    }

    if (isExcel) {
      setParsing(true);
      try {
        const parsed = await parseRosterFile(file);
        onSizeFileChange?.({
          file,
          fileName: file.name,
          fileSize: file.size,
          fileType: 'excel',
          parsedRoster: parsed,
        });
      } catch (err) {
        setParseError((err as Error).message || 'Gagal membaca berkas spreadsheet.');
      } finally {
        setParsing(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    } else {
      // PDF file
      onSizeFileChange?.({
        file,
        fileName: file.name,
        fileSize: file.size,
        fileType: 'pdf',
        parsedRoster: null,
      });
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <section id="product-tabs" className="overflow-hidden rounded-2xl bg-surface shadow-card ring-1 ring-line">
      <div className="flex overflow-x-auto bg-canvas px-4 scrollbar-none" role="tablist">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={tab === key}
            onClick={() => setTab(key)}
            className={`flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-4 text-[15px] font-semibold transition-colors ${
              tab === key ? 'border-primary text-primary' : 'border-transparent text-ink-soft hover:text-primary'
            }`}
          >
            <Icon className="size-4" aria-hidden="true" /> {label}
          </button>
        ))}
      </div>
      <div className="p-6" role="tabpanel">
        {tab === 'components' &&
          (lines.length > 0 ? (
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {lines.map((l) => (
                <CheckItem key={l} title={l} />
              ))}
            </ul>
          ) : (
            <p className="whitespace-pre-line text-[15px] leading-relaxed text-ink-soft">
              {product.description || 'Detail komponen akan diinformasikan admin saat konfirmasi pesanan.'}
            </p>
          ))}

        {tab === 'sizes' && (
          mode === 'beli' ? (
            /* PRE-ORDER: Hapus list stock yang tersedia, ganti dengan upload berkas Excel / PDF */
            <div className="flex flex-col gap-6">
              {/* Card Informasi Pre-Order */}
              <div className="rounded-xl border border-primary/20 bg-beige-soft p-5">
                <div className="flex items-start gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary text-on-primary">
                    <Ruler className="size-5" />
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-primary">Sistem Pre-Order: Bebas Tentukan Ukuran</h3>
                    <p className="pt-1 text-sm leading-relaxed text-ink-soft">
                      Pembelian seragam menggunakan sistem <strong>Pre-Order</strong> (dibuat baru sesuai pesanan).
                      Stok tidak dibatasi oleh unit di gudang. Kirimkan berkas daftar ukuran anggota (format <strong>Excel</strong> atau <strong>PDF</strong>)
                      agar tim kami dapat menyiapkan bahan kain dan jadwal jahit sebelum konfirmasi pesanan.
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

              {/* Upload Dropzone atau Kartu Berkas Terunggah */}
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
                    if (file) handleFile(file);
                  }}
                  onClick={() => fileInputRef.current?.click()}
                  className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition-colors ${
                    dragging
                      ? 'border-primary bg-beige-soft'
                      : 'border-line bg-canvas hover:border-primary hover:bg-beige-soft/40'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xlsx,.xls,.csv,.pdf,application/pdf,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFile(file);
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
                      <h4 className="pt-3 text-base font-bold text-ink">Unggah Berkas Ukuran Anggota</h4>
                      <p className="pt-1 text-sm text-ink-soft max-w-md">
                        Tarik & letakkan berkas <strong>Excel (.xlsx)</strong> atau <strong>PDF (.pdf)</strong> di sini, atau klik untuk memilih berkas dari perangkat.
                      </p>
                      <span className="mt-3 rounded-full bg-beige-soft px-3 py-1 text-xs font-semibold text-primary">
                        Maksimal ukuran file: 10MB
                      </span>
                    </>
                  )}
                </div>
              ) : (
                /* Tampilan ketika berkas sudah dipilih/diunggah */
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
                        onClick={() => fileInputRef.current?.click()}
                      >
                        Ganti Berkas
                      </Button>
                      <button
                        type="button"
                        onClick={() => onSizeFileChange?.(null)}
                        className="flex size-9 items-center justify-center rounded-lg border border-line text-ink-soft transition hover:border-danger hover:bg-danger/10 hover:text-danger"
                        title="Hapus Berkas"
                        aria-label="Hapus Berkas"
                      >
                        <Trash2 className="size-4" />
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".xlsx,.xls,.csv,.pdf,application/pdf,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFile(file);
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

                  {/* Keterangan jika berkas PDF */}
                  {sizeFile.fileType === 'pdf' && (
                    <div className="mt-4 rounded-xl border border-line/60 bg-surface p-3 text-xs text-ink-soft">
                      <p>
                        💡 <strong>Dokumen PDF Terlampir:</strong> Admin VIEGUARD akan memeriksa data ukuran yang tertera di dalam dokumen PDF ini saat memproses pengajuan pesanan Anda sebelum konfirmasi pembayaran DP dibuka.
                      </p>
                    </div>
                  )}
                </div>
              )}

              <ErrorMessage message={parseError} />
            </div>
          ) : (
            /* MODE SEWA: Panduan Ukuran & Stok Sewa */
            product.variants.length > 0 ? (
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-line text-xs uppercase text-ink-soft">
                    <th className="py-2">Ukuran</th>
                    <th className="py-2">Stok Sewa Tersedia</th>
                  </tr>
                </thead>
                <tbody>
                  {product.variants.map((v) => (
                    <tr key={v.id} className="border-b border-line last:border-0">
                      <td className="py-2.5 font-bold text-primary">{v.size}</td>
                      <td className="py-2.5 text-ink">{Math.max(0, v.stockRent - (v.stockInService ?? 0))} unit</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-[15px] text-ink-soft">Ukuran tersedia dalam satu ukuran standar. Konsultasikan kebutuhan khusus lewat Obrolan.</p>
            )
          )
        )}

        {tab === 'sanitation' && (
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {(mode === 'beli' ? PRODUCTION_GUARANTEES : SANITATION).map((s) => (
              <CheckItem key={s.title} title={s.title} body={s.body} />
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

function CheckItem({ title, body }: { title: string; body?: string }) {
  return (
    <li className="flex gap-3 rounded-xl bg-canvas p-3">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-on-primary">
        <Check className="size-4" strokeWidth={3} aria-hidden="true" />
      </span>
      <span>
        <span className="block text-[15px] text-ink">{title}</span>
        {body && <span className="block text-[13px] text-ink-soft">{body}</span>}
      </span>
    </li>
  );
}
