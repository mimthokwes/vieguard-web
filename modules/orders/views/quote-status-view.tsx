import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Calculator,
  Check,
  CircleCheck,
  Download,
  FileText,
  Headset,
  Hourglass,
  Info,
  MessageSquare,
  MessagesSquare,
  NotebookPen,
  PencilRuler,
  ReceiptText,
  Route,
  ScrollText,
} from 'lucide-react';
import { Order } from '@/types/order';
import { StoreProfile } from '@/types/store';
import { Breadcrumb } from '@/components/layout/breadcrumb';
import { PageContainer } from '@/components/layout/page-header';
import { buttonClasses } from '@/components/ui/button';
import { CopyButton, PrintButton } from '@/components/ui/copy-button';
import { formatDate, formatDateTime } from '@/lib/format';
import { parseOrderMeta, totalQuantity } from '@/lib/order-status';

const STAGES = [
  { title: 'Draf Masuk & Form Diterima', body: 'Data ukuran awal, target perhelatan, serta berkas desain terekam.', icon: Check },
  { title: 'Peninjauan Pola & Material', body: 'Master tailor menguji kesesuaian gramasi kain, ornamen, dan struktur bahu.', icon: PencilRuler },
  { title: 'Penerbitan Rincian Biaya & Sketsa 3D', body: 'Rincian lembar penawaran harga resmi (RAB) dan visualisasi render akhir.', icon: ReceiptText },
  { title: 'Persetujuan & Pembuatan Sampel Fisik', body: 'Penerbitan PO, SPK Kedinasan resmi, dan penjadwalan fitting master sampel.', icon: CircleCheck },
];

const SERVICE_STANDARDS = [
  { title: 'Respons Cepat Maks. 24 Jam', body: 'Kalkulasi biaya dan kelayakan sketsa direspons cepat pada hari operasional.' },
  { title: 'Garansi Fitting Sampel Fisik 1 Stel', body: 'Pengerjaan sampel purwarupa disiapkan sebelum produksi massal dimulai.' },
  { title: 'Penyesuaian Anggaran Sekolah', body: 'Didukung skema pembayaran bertahap untuk institusi pendidikan dan instansi resmi.' },
];

function daysUntil(date?: string) {
  if (!date) return null;
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return null;
  return Math.ceil((d.getTime() - Date.now()) / 86400000);
}

export function QuoteStatusView({ order, store, justCreated }: { order: Order; store?: StoreProfile | null; justCreated?: boolean }) {
  const meta = parseOrderMeta(order);
  const detail = order.customOrderDetail;
  const remaining = daysUntil(meta.eventDate);
  const active = 1; // stage index: the order is waiting for the tailor's review
  const isImageRef = !!detail?.designReference && /\.(png|jpe?g|webp|gif)(\?.*)?$/i.test(detail.designReference);
  const phone = store?.whatsappNumber || store?.phone;
  const chatHref = `/chat?topic=${encodeURIComponent(`Penawaran ${order.orderNumber}`)}`;

  return (
    <PageContainer>
      <Breadcrumb items={[{ label: 'Pesanan dan Sewa Saya', href: '/orders' }, { label: 'Ruang Penawaran & Negosiasi' }]} />

      {justCreated && (
        <p role="status" className="mt-6 flex items-center gap-2 rounded-xl border border-success/25 bg-success-bg px-4 py-3 text-sm font-semibold text-success">
          <CircleCheck className="size-4" aria-hidden="true" /> Permohonan berhasil dikirim. Admin akan meninjau dan mengirim penawaran resmi.
        </p>
      )}

      <section className="relative mt-6 overflow-hidden rounded-2xl bg-surface p-8 shadow-card ring-1 ring-line">
        <div className="pointer-events-none absolute -right-16 -top-16 size-64 rounded-full bg-gold-light/20 blur-3xl" aria-hidden="true" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-warning-bg px-2.5 py-1 text-xs font-semibold text-warning">
              <Hourglass className="size-3.5" aria-hidden="true" /> Menunggu Kalkulasi Resmi Master Tailor
            </span>
            <h1 className="pt-3 text-3xl font-extrabold leading-tight tracking-tight text-ink sm:text-4xl">
              Status Pengajuan Draf Penawaran & Negosiasi Desain
            </h1>
            <p className="pt-3 text-base leading-relaxed text-ink-soft">
              Permohonan seragam Anda sedang ditinjau dan dikalkulasi oleh Master Tailor bengkel kami.
            </p>
          </div>
          <div className="rounded-xl bg-beige-soft px-4 py-3 text-right">
            <p className="text-xs font-semibold uppercase text-ink-soft">Nomor Registrasi Draf</p>
            <p className="flex items-center justify-end gap-2 text-xl font-extrabold text-primary">
              {order.orderNumber} <CopyButton value={order.orderNumber} label="Salin nomor pesanan" />
            </p>
            <p className="text-xs text-ink-soft">Diterima: {formatDateTime(order.createdAt)} WIB</p>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-8 pt-8 lg:grid-cols-[1fr_384px]">
        <div className="flex flex-col gap-8">
          <section className="rounded-2xl bg-surface p-8 shadow-card ring-1 ring-line">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
              <h2 className="flex items-center gap-2 text-lg font-bold text-ink">
                <Route className="size-5 text-primary" aria-hidden="true" /> Tahapan Verifikasi & Pembuatan Quotation
              </h2>
              <span className="text-xs font-semibold text-primary">Langkah {active + 1} dari 4</span>
            </div>
            <ol className="grid grid-cols-1 gap-4 pt-6 sm:grid-cols-2 xl:grid-cols-4">
              {STAGES.map((s, i) => {
                const done = i < active;
                const current = i === active;
                const Icon = s.icon;
                return (
                  <li key={s.title} className={`flex flex-col rounded-xl p-4 ${current ? 'bg-beige-soft ring-1 ring-beige' : done ? 'bg-canvas' : ''}`}>
                    <div className="flex items-center justify-between">
                      <span
                        className={`flex size-8 items-center justify-center rounded-full ${
                          done || current ? 'bg-primary text-on-primary' : 'bg-canvas text-muted'
                        }`}
                      >
                        <Icon className="size-4" aria-hidden="true" />
                      </span>
                      {current ? (
                        <span className="rounded bg-warning-bg px-2 py-0.5 text-xs font-bold text-gold-dark">Aktif</span>
                      ) : (
                        <span className="text-xs text-muted">Tahap 0{i + 1}</span>
                      )}
                    </div>
                    <p className={`pt-4 font-bold ${current ? 'text-primary' : done ? 'text-ink' : 'text-muted'}`}>{s.title}</p>
                    <p className={`pt-2 text-[13px] leading-5 ${done || current ? 'text-ink-soft' : 'text-muted'}`}>{s.body}</p>
                    <p className="mt-auto pt-4 text-xs font-semibold">
                      {done ? (
                        <span className="text-primary">Selesai Diverifikasi</span>
                      ) : current ? (
                        <span className="flex items-center gap-1.5 text-warning">
                          <span className="size-1.5 rounded-full bg-gold" /> Sedang Diproses oleh Desainer
                        </span>
                      ) : (
                        <span className="text-muted">{i === STAGES.length - 1 ? 'Tahap Final' : `Menunggu Tahap ${i} Selesai`}</span>
                      )}
                    </p>
                  </li>
                );
              })}
            </ol>
          </section>

          <section className="rounded-2xl bg-surface p-8 shadow-card ring-1 ring-line">
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-line pb-4">
              <div>
                <h2 className="text-lg font-bold text-ink">Ringkasan Rencana Pemesanan</h2>
                <p className="text-[13px] text-ink-soft">Spesifikasi atribut busana korps seragam yang diajukan ke bengkel garmen.</p>
              </div>
              {meta.packageName && <span className="rounded-full bg-beige-soft px-3 py-1 text-xs font-bold text-primary">{meta.packageName}</span>}
            </div>
            <div className="flex flex-col gap-6 pt-6 md:flex-row">
              <figure className="w-full shrink-0 md:w-56">
                <div className="relative h-72 overflow-hidden rounded-xl bg-beige-soft">
                  {isImageRef ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={detail!.designReference!} alt="Lampiran desain" className="size-full object-cover" />
                  ) : (
                    <Image src="/images/portfolio/project-3.webp" alt="" fill sizes="224px" className="object-cover" />
                  )}
                  <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-primary-deep/90 to-transparent px-3 pb-3 pt-10 text-white">
                    <span className="block text-xs font-semibold uppercase text-white/70">Lampiran Visual</span>
                    <span className="block text-sm font-bold">{detail?.designReference ? 'Referensi Desain Klien' : 'Contoh Konsep'}</span>
                  </span>
                </div>
                {detail?.designReference && !isImageRef && (
                  <a href={detail.designReference} target="_blank" rel="noreferrer" className="mt-2 block truncate text-center text-xs font-semibold text-primary underline">
                    Buka tautan referensi
                  </a>
                )}
              </figure>
              <div className="flex flex-1 flex-col gap-3">
                <dl className="grid grid-cols-1 gap-5 rounded-xl bg-beige-soft p-6 sm:grid-cols-2">
                  <Meta label="Nama Instansi" value={meta.institution ?? '-'} sub={detail?.jenisJenjang ?? undefined} />
                  <Meta label="Penanggung Jawab" value={meta.pic ?? '-'} sub={meta.phone} />
                  <Meta label="Estimasi Kebutuhan" value={`${totalQuantity(order)} Stel Seragam`} big />
                  <Meta
                    label="Target Acara"
                    value={formatDate(meta.eventDate, { day: 'numeric', month: 'long', year: 'numeric' })}
                    sub={remaining !== null ? (remaining >= 0 ? `Sisa waktu produksi: ${remaining} hari` : 'Tanggal acara sudah lewat') : undefined}
                    subAccent
                  />
                  {meta.accessories && meta.accessories.length > 0 && (
                    <div className="border-t border-line pt-4 sm:col-span-2">
                      <dt className="text-xs font-semibold uppercase text-ink-soft">Aksesoris Pilihan</dt>
                      <dd className="flex flex-wrap gap-2 pt-2">
                        {meta.accessories.map((a) => (
                          <span key={a} className="rounded-full bg-surface px-3 py-1 text-xs font-semibold text-primary">
                            {a}
                          </span>
                        ))}
                      </dd>
                    </div>
                  )}
                </dl>
                {(detail?.designDescription || order.notes) && (
                  <div className="flex gap-3 rounded-xl bg-canvas p-5">
                    <NotebookPen className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                    <div>
                      <p className="text-sm font-semibold text-ink">Catatan Khusus Penjahitan:</p>
                      <p className="text-[15px] leading-6 text-ink-soft">{detail?.designDescription || order.notes}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          <section className="rounded-2xl bg-surface p-8 shadow-card ring-1 ring-line">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="flex items-center gap-2 text-lg font-bold text-ink">
                <ScrollText className="size-5 text-primary" aria-hidden="true" /> Status Penawaran Biaya Resmi
              </h2>
              <span className="rounded-full bg-warning-bg px-3 py-1 text-xs font-semibold text-warning">Menunggu Estimasi Resmi</span>
            </div>
            <div className="mt-6 flex flex-col gap-6 rounded-xl bg-beige-soft p-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex gap-4">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-surface text-primary">
                  <Calculator className="size-6" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase text-ink-soft">Dasar Harga Saat Ini</p>
                  <p className="text-2xl font-extrabold text-primary">
                    Belum ditetapkan <span className="text-sm font-normal text-ink-soft">(Menunggu Verifikasi)</span>
                  </p>
                  <p className="max-w-xs pt-1 text-xs leading-5 text-ink-soft">
                    Kalkulasi meliputi bahan kain drill eksekutif, ornamen logam, serta jasa pengerjaan pola kustom.
                  </p>
                </div>
              </div>
              <div className="rounded-xl bg-surface px-5 py-3 text-center shadow-soft">
                <p className="text-xs text-ink-soft">Tenggat Waktu Komitmen</p>
                <p className="font-bold text-primary">Maks. 24 Jam Kerja</p>
              </div>
            </div>
            <p className="mt-4 flex gap-2 rounded-xl bg-warning-bg px-4 py-3 text-[13px] leading-5 text-warning">
              <Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              Estimasi rincian biaya per stel dan total akan diterbitkan maksimal dalam 1×24 jam kerja. Anda akan menerima notifikasi begitu penawaran tersedia.
            </p>
          </section>
        </div>

        <aside className="flex flex-col gap-6">
          <section className="rounded-2xl bg-surface p-8 shadow-card ring-1 ring-line">
            <div className="flex gap-3">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-beige-soft text-primary">
                <MessagesSquare className="size-5" aria-hidden="true" />
              </span>
              <h2 className="text-lg font-bold text-ink">Ruang Diskusi & Negosiasi Langsung</h2>
            </div>
            <p className="pt-4 text-[15px] leading-6 text-ink-soft">
              Perlu menambahkan revisi sketsa atau menegosiasikan spesifikasi kain? Hubungi tim desainer penanggung jawab proyek Anda.
            </p>
            <div className="mt-5 flex items-center gap-3 rounded-xl bg-beige-soft p-3">
              <span className="flex size-12 items-center justify-center rounded-full border border-gold-light bg-maroon-gradient font-display text-sm font-bold text-gold-light">VG</span>
              <div>
                <p className="text-sm font-bold text-ink">Tim Desainer VIEGUARD</p>
                <p className="text-xs text-ink-soft">Kepala Desain Pola Korps Musik</p>
                <p className="flex items-center gap-1 text-xs font-semibold text-primary">
                  <span className="size-1.5 rounded-full bg-success" /> {store?.operationalHours || 'Senin - Sabtu, 08.00 - 17.00'}
                </p>
              </div>
            </div>
            <Link href={chatHref} className={buttonClasses({ size: 'lg', fullWidth: true, className: 'mt-6' })}>
              <MessageSquare className="size-4" aria-hidden="true" /> Buka Ruang Obrolan Desainer
            </Link>
            <PrintButton className={buttonClasses({ variant: 'soft', size: 'lg', fullWidth: true, className: 'mt-3 border-0' })}>
              <Download className="size-4" aria-hidden="true" /> Cetak Ringkasan Draf
            </PrintButton>
          </section>

          <section className="rounded-2xl bg-surface p-8 shadow-card ring-1 ring-line">
            <h2 className="text-sm font-bold uppercase tracking-wider text-ink-soft">Standar Layanan Kami</h2>
            <ul className="flex flex-col gap-4 pt-5">
              {SERVICE_STANDARDS.map((s) => (
                <li key={s.title} className="flex gap-3">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-beige-soft text-primary">
                    <Check className="size-3.5" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-[13px] font-bold text-ink">{s.title}</p>
                    <p className="text-xs leading-5 text-ink-soft">{s.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {phone && (
            <section className="rounded-2xl bg-maroon-gradient p-6 text-white shadow-card">
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
                <Headset className="size-4" aria-hidden="true" /> Bantuan Cepat Bengkel
              </p>
              <p className="pt-3 text-[15px] leading-6 text-white/80">
                Butuh bantuan cepat via telepon? Hubungi PIC bengkel di{' '}
                <a href={`tel:${phone}`} className="font-semibold text-white underline">
                  {phone}
                </a>
              </p>
              {store?.operationalHours && (
                <p className="mt-4 border-t border-white/15 pt-3 text-xs text-white/70">Jam Operasional: {store.operationalHours}</p>
              )}
            </section>
          )}

          <Link href="/orders" className="flex items-center justify-center gap-2 text-sm font-semibold text-primary hover:underline">
            <FileText className="size-4" aria-hidden="true" /> Kembali ke daftar pesanan
          </Link>
        </aside>
      </div>
    </PageContainer>
  );
}

function Meta({ label, value, sub, big = false, subAccent = false }: { label: string; value: string; sub?: string; big?: boolean; subAccent?: boolean }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase text-ink-soft">{label}</dt>
      <dd className={`pt-0.5 font-bold ${big ? 'text-xl text-primary' : 'text-[15px] text-ink'}`}>{value}</dd>
      {sub && <dd className={`text-[13px] ${subAccent ? 'text-primary' : 'text-ink-soft'}`}>{sub}</dd>}
    </div>
  );
}
