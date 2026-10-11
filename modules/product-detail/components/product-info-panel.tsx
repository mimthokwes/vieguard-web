"use client";

import React, { useEffect, useMemo, useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BadgeCheck, CalendarDays, CalendarRange, Clock, Headset, Loader2, Minus, MessagesSquare, Plus, ShieldCheck, ShoppingBag, Smartphone, Truck } from 'lucide-react';
import { Product } from '@/types/product';
import { Button, buttonClasses } from '@/components/ui/button';
import { ErrorMessage } from '@/components/ui/error-message';
import { formatRupiah, toNumber } from '@/lib/format';
import { JENJANG_OPTIONS } from '@/modules/order/data';
import { checkAvailabilityAction, submitBookingAction } from '../actions';

type Mode = 'sewa' | 'beli';

function addDays(iso: string, n: number) {
  const d = new Date(iso);
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

const today = () => new Date().toISOString().slice(0, 10);

interface BookingPanelProps {
  product: Product;
  modes: Mode[];
  initialDate?: string;
  isLoggedIn: boolean;
  loginHref: string;
}

/** Date + quantity booking card with live cost breakdown (Figma screen 13). */
export function BookingPanel({ product, modes, initialDate, isLoggedIn, loginHref }: BookingPanelProps) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>(modes[0]!);
  const start = initialDate && initialDate >= today() ? initialDate : addDays(today(), 3);
  const [pickup, setPickup] = useState(start);
  const [ret, setRet] = useState(addDays(start, 3));
  const [jenjang, setJenjang] = useState('');
  const hasVariants = product.variants.length > 0;
  const [quantities, setQuantities] = useState<Record<string, number>>(() => (hasVariants ? ({} as Record<string, number>) : { '': 1 }));
  const [availabilityResult, setAvailabilityResult] = useState<{ key: string; stock?: number; error?: string } | null>(null);
  const [error, setError] = useState('');
  const [pending, startTransition] = useTransition();

  const days = Math.max(0, Math.round((new Date(ret).getTime() - new Date(pickup).getTime()) / 86400000));
  const totalQty = Object.values(quantities).reduce((s, q) => s + (q || 0), 0);

  const priceFor = (variantId: string) => {
    const v = product.variants.find((x) => x.id === variantId);
    return mode === 'sewa'
      ? toNumber(v?.priceRentOverride) || toNumber(product.basePriceRent)
      : toNumber(v?.priceBuyOverride) || toNumber(product.basePriceBuy);
  };
  const subtotal = useMemo(
    () => Object.entries(quantities).reduce((s, [id, q]) => s + priceFor(id) * (q || 0) * (mode === 'sewa' ? days : 1), 0),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [quantities, mode, days]
  );
  const basePrice = mode === 'sewa' ? toNumber(product.basePriceRent) : toNumber(product.basePriceBuy);

  const availabilityKey = `${pickup}|${ret}`;
  const availability =
    availabilityResult?.key === availabilityKey
      ? { loading: false, stock: availabilityResult.stock, error: availabilityResult.error }
      : { loading: mode === 'sewa' && days >= 1, stock: undefined, error: undefined };

  useEffect(() => {
    if (mode !== 'sewa' || days < 1) return;
    let cancelled = false;
    checkAvailabilityAction(product.id, pickup, ret).then((r) => {
      if (!cancelled) setAvailabilityResult({ key: `${pickup}|${ret}`, stock: r.availableStock, error: r.error });
    });
    return () => {
      cancelled = true;
    };
  }, [product.id, pickup, ret, mode, days]);

  const stockLimit = (variantId: string) => {
    const v = product.variants.find((x) => x.id === variantId);
    if (!v) return 999;
    return mode === 'sewa' ? Math.max(0, v.stockRent - (v.stockInService ?? 0)) : Math.max(0, v.stockBuy);
  };

  const setQty = (id: string, q: number) => setQuantities((prev) => ({ ...prev, [id]: Math.max(0, Math.min(q, stockLimit(id))) }));

  const submit = () => {
    setError('');
    if (!isLoggedIn) {
      router.push(loginHref);
      return;
    }
    if (totalQty === 0) {
      setError('Isi jumlah unit yang dibutuhkan.');
      return;
    }
    if (mode === 'sewa' && availability.stock !== undefined && totalQty > availability.stock) {
      setError(`Stok tersedia pada tanggal tersebut hanya ${availability.stock} unit.`);
      return;
    }
    startTransition(async () => {
      const result = await submitBookingAction({
        productId: product.id,
        mode,
        pickupDate: mode === 'sewa' ? pickup : undefined,
        returnDate: mode === 'sewa' ? ret : undefined,
        quantities,
        jenjang: jenjang || undefined,
      });
      if (result?.needsLogin) router.push(loginHref);
      else if (result?.error) setError(result.error);
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <section className="rounded-2xl bg-surface p-6 shadow-card ring-1 ring-line">
        <div className="flex items-center gap-3 border-b border-line pb-4">
          <span className="flex size-10 items-center justify-center rounded-lg bg-primary text-on-primary">
            {mode === 'sewa' ? <CalendarDays className="size-5" aria-hidden="true" /> : <ShoppingBag className="size-5" aria-hidden="true" />}
          </span>
          <div>
            <h2 className="text-lg font-bold text-ink">{mode === 'sewa' ? 'Pemesanan Tanggal & Armada Sewa' : 'Pembelian Produk'}</h2>
            <p className="text-xs text-ink-soft">{mode === 'sewa' ? 'Konfigurasi jadwal dan kuota seragam' : 'Pilih ukuran dan jumlah unit'}</p>
          </div>
        </div>

        {modes.length > 1 && (
          <div className="mt-4 grid grid-cols-2 gap-1 rounded-lg bg-beige-soft p-1" role="tablist">
            {modes.map((m) => (
              <button
                key={m}
                type="button"
                role="tab"
                aria-selected={mode === m}
                onClick={() => setMode(m)}
                className={`rounded py-2 text-sm font-semibold ${mode === m ? 'bg-surface text-primary shadow-soft' : 'text-ink-soft'}`}
              >
                {m === 'sewa' ? 'Sewa' : 'Beli'}
              </button>
            ))}
          </div>
        )}

        {mode === 'sewa' && (
          <>
            <div className="grid grid-cols-2 gap-3 pt-5">
              <DateField label="Tanggal Mulai Sewa" value={pickup} min={today()} onChange={(v) => {
                setPickup(v);
                if (ret <= v) setRet(addDays(v, 1));
              }} />
              <DateField label="Tanggal Pengembalian" value={ret} min={addDays(pickup, 1)} onChange={setRet} />
            </div>
            <div className="mt-4 flex items-center justify-between rounded-xl bg-beige-soft px-4 py-3">
              <span className="flex items-center gap-2 text-sm font-semibold text-ink">
                <Clock className="size-4 text-primary" aria-hidden="true" /> Durasi Sewa Terhitung:
              </span>
              <span className="text-xl font-extrabold text-primary">{days} Hari</span>
            </div>
            <p className="pt-2 text-xs font-semibold" aria-live="polite">
              {availability.loading ? (
                <span className="flex items-center gap-1.5 text-ink-soft"><Loader2 className="size-3 animate-spin" /> Mengecek ketersediaan...</span>
              ) : availability.error ? (
                <span className="text-warning">Ketersediaan belum bisa dicek: {availability.error}</span>
              ) : availability.stock !== undefined ? (
                <span className={availability.stock > 0 ? 'text-success' : 'text-danger'}>
                  {availability.stock > 0 ? `Tersedia ${availability.stock} unit pada tanggal ini` : 'Tidak tersedia pada tanggal ini'}
                </span>
              ) : null}
            </p>
          </>
        )}

        <div className="pt-4">
          <p className="pb-2 text-sm font-semibold text-ink">{hasVariants ? 'Jumlah per Ukuran' : 'Jumlah Unit Dibutuhkan'}</p>
          <ul className="flex flex-col gap-2">
            {(hasVariants ? product.variants : [{ id: '', size: 'Standar' }]).map((v) => {
              const limit = stockLimit(v.id);
              const q = quantities[v.id] ?? 0;
              return (
                <li key={v.id || 'std'} className="flex items-center justify-between gap-3 rounded-xl bg-canvas px-3 py-2">
                  <span className="text-sm">
                    <b className="text-ink">{v.size}</b>
                    {hasVariants && <span className="pl-2 text-xs text-muted">stok {limit}</span>}
                  </span>
                  <span className="flex items-center gap-1">
                    <StepperButton label={`Kurangi ${v.size}`} onClick={() => setQty(v.id, q - 1)} disabled={q <= 0}>
                      <Minus className="size-3.5" />
                    </StepperButton>
                    <input
                      type="number"
                      min={0}
                      max={limit}
                      value={q}
                      aria-label={`Jumlah ukuran ${v.size}`}
                      onChange={(e) => setQty(v.id, Number(e.target.value) || 0)}
                      className="h-9 w-14 rounded-lg border border-line bg-surface text-center text-sm font-bold text-ink focus:border-primary focus:outline-none"
                    />
                    <StepperButton label={`Tambah ${v.size}`} onClick={() => setQty(v.id, q + 1)} disabled={q >= limit}>
                      <Plus className="size-3.5" />
                    </StepperButton>
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        <label className="block pt-4">
          <span className="pb-1.5 text-sm font-semibold text-ink">Jenjang Institusi</span>
          <select
            value={jenjang}
            onChange={(e) => setJenjang(e.target.value)}
            className="mt-1.5 h-11 w-full rounded-lg border border-line bg-canvas px-3 text-sm text-ink focus:border-primary focus:outline-none"
          >
            <option value="">Pilih jenjang (opsional)</option>
            {JENJANG_OPTIONS.map((j) => (
              <option key={j.value} value={j.value}>
                {j.label}
              </option>
            ))}
          </select>
        </label>

        <div className="mt-5 rounded-xl bg-beige-soft p-4 text-sm">
          <p className="pb-3 text-xs font-bold uppercase tracking-wide text-ink">Rincian Kalkulasi Biaya</p>
          <CostRow label={mode === 'sewa' ? 'Biaya Satuan Sewa:' : 'Harga Satuan:'} value={basePrice > 0 ? `${formatRupiah(basePrice)}${mode === 'sewa' ? ' / unit / hari' : ''}` : '-'} />
          <CostRow label={mode === 'sewa' ? `Subtotal (${days} Hari × ${totalQty} Unit):` : `Subtotal (${totalQty} Unit):`} value={formatRupiah(subtotal)} />
          {mode === 'sewa' && (
            <div className="flex justify-between gap-3 py-1">
              <span className="text-ink-soft">
                Jaminan Keamanan:
                <span className="block text-xs font-semibold text-primary">Opsi Bebas Deposit via SPK</span>
              </span>
              <span className="text-right font-semibold text-ink">Ditentukan admin</span>
            </div>
          )}
          <CostRow label={mode === 'sewa' ? 'Ongkos Kirim Antar-Jemput:' : 'Ongkos Kirim:'} value={<span className="font-normal text-ink-soft">Dihitung saat konfirmasi</span>} />
          <div className="mt-2 flex items-end justify-between border-t border-line pt-3">
            <span>
              <b className="text-base text-ink">Total Estimasi:</b>
              <span className="block text-xs text-ink-soft">Belum termasuk ongkir</span>
            </span>
            <span className="text-2xl font-extrabold text-primary">{formatRupiah(subtotal)}</span>
          </div>
        </div>

        {mode === 'sewa' && (
          <p className="mt-4 flex gap-2 rounded-xl bg-warning-bg p-4 text-[13px] font-semibold leading-5 text-gold-dark">
            <ShieldCheck className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            Kebijakan Sekolah / Dinas: Institusi resmi dapat menggunakan Surat Rekomendasi Resmi / SPK Kepala Sekolah bertanda tangan basah sebagai pengganti deposit uang tunai.
          </p>
        )}

        <ErrorMessage message={error} className="mt-4" />

        <Button size="lg" fullWidth className="mt-5 !h-12" onClick={submit} disabled={pending || (mode === 'sewa' && days < 1)}>
          {pending ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <Smartphone className="size-4" aria-hidden="true" />}
          {!isLoggedIn ? 'Masuk untuk Melanjutkan' : mode === 'sewa' ? 'Lanjutkan Booking & Reservasi Tanggal' : 'Pesan Sekarang'}
        </Button>
        <Link
          href={`/chat?topic=${encodeURIComponent(`Ketersediaan ${product.name}`)}`}
          className={buttonClasses({ variant: 'soft', size: 'lg', fullWidth: true, className: 'mt-2 border-0' })}
        >
          <MessagesSquare className="size-4" aria-hidden="true" /> Konsultasi Ketersediaan via Chat
        </Link>
        <p className="pt-3 text-center text-xs text-ink-soft">
          {mode === 'sewa' ? 'Pesanan otomatis dibatalkan bila belum dikonfirmasi admin dalam 1 jam.' : 'Admin akan mengonfirmasi ketersediaan dan ongkos kirim.'}
        </p>
      </section>

      <div className="grid grid-cols-3 divide-x divide-line rounded-2xl bg-surface py-4 shadow-card ring-1 ring-line">
        <Feature icon={<BadgeCheck className="size-5" />} label="Kualitas Terjamin" />
        <Feature icon={<Truck className="size-5" />} label="Antar Tepat Waktu" />
        <Feature icon={<Headset className="size-5" />} label="Pendamping Fitting" />
      </div>
    </div>
  );
}

function DateField({ label, value, min, onChange }: { label: string; value: string; min: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-ink">{label}</span>
      <span className="relative mt-1.5 block">
        <CalendarRange className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden="true" />
        <input
          type="date"
          value={value}
          min={min}
          onChange={(e) => onChange(e.target.value)}
          className="h-11 w-full rounded-lg bg-canvas pl-9 pr-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </span>
    </label>
  );
}

function StepperButton({ children, label, onClick, disabled }: { children: React.ReactNode; label: string; onClick: () => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className="flex size-9 items-center justify-center rounded-lg bg-surface text-primary ring-1 ring-line transition-colors hover:bg-beige-soft disabled:opacity-40"
    >
      {children}
    </button>
  );
}

function CostRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-3 py-1">
      <span className="text-ink-soft">{label}</span>
      <span className="text-right font-semibold text-ink">{value}</span>
    </div>
  );
}

function Feature({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5 px-2 text-center">
      <span className="text-primary">{icon}</span>
      <span className="text-xs font-semibold text-ink">{label}</span>
    </div>
  );
}
