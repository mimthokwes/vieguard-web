import { BadgeTone } from '@/components/ui/badge';
import { Order, OrderStatus, OrderType, PaymentStatus, RentalStatus } from '@/types/order';
import { toNumber } from './format';

/** Labels and tones follow vieguard_app/lib/models/order_status.dart so web and admin app agree. */
export const ORDER_STATUS_META: Record<OrderStatus, { label: string; tone: BadgeTone }> = {
  pending: { label: 'Menunggu Konfirmasi', tone: 'warning' },
  dikonfirmasi: { label: 'Dikonfirmasi', tone: 'info' },
  diproses: { label: 'Diproses', tone: 'info' },
  siap_diambil: { label: 'Siap Kirim / Diambil', tone: 'success' },
  selesai: { label: 'Selesai', tone: 'success' },
  dibatalkan: { label: 'Dibatalkan', tone: 'danger' },
};

export const ORDER_TYPE_LABEL: Record<OrderType, string> = {
  beli: 'Pembelian',
  sewa: 'Penyewaan',
  custom: 'Pesanan Jahit',
};

export const RENTAL_STATUS_META: Record<RentalStatus, { label: string; tone: BadgeTone }> = {
  dipesan: { label: 'Dipesan', tone: 'info' },
  diambil: { label: 'Sedang Digunakan', tone: 'success' },
  dikembalikan: { label: 'Dikembalikan', tone: 'neutral' },
  terlambat: { label: 'Terlambat', tone: 'danger' },
};

export const PAYMENT_STATUS_META: Record<PaymentStatus, { label: string; tone: BadgeTone }> = {
  menunggu: { label: 'Menunggu Verifikasi', tone: 'warning' },
  terverifikasi: { label: 'Terverifikasi', tone: 'success' },
  ditolak: { label: 'Ditolak', tone: 'danger' },
};

/** Same rule as the admin app's `needsQuote`: a custom order still waiting for the admin's price. */
export function isAwaitingQuote(order: Pick<Order, 'orderType' | 'status' | 'totalPrice'>) {
  return order.orderType === 'custom' && order.status === 'pending' && toNumber(order.totalPrice) <= 0;
}

export function latestProgress(order: Pick<Order, 'statusHistory'>) {
  const history = order.statusHistory ?? [];
  if (history.length === 0) return null;
  return [...history].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()).at(-1)!;
}

/** Production milestones shown on the tracking timeline (Figma screen 15). */
export const PRODUCTION_STAGES = [
  { title: 'Pola & Pemotongan', threshold: 0 },
  { title: 'Bordir Lambang & Monogram', threshold: 20 },
  { title: 'Penjahitan Konstruksi', threshold: 40 },
  { title: 'Quality Control & Fitting', threshold: 70 },
  { title: 'Pengemasan & Ekspedisi', threshold: 90 },
];

/** Index of the active production stage, or -1 when production has not started. */
export function activeStageIndex(order: Pick<Order, 'status' | 'statusHistory'>) {
  if (order.status === 'siap_diambil' || order.status === 'selesai') return PRODUCTION_STAGES.length;
  if (order.status !== 'diproses' && order.status !== 'dikonfirmasi') return -1;
  const pct = latestProgress(order)?.progressPercentage ?? 0;
  let idx = 0;
  PRODUCTION_STAGES.forEach((s, i) => {
    if (pct >= s.threshold) idx = i;
  });
  return idx;
}

export function orderProgressPercent(order: Pick<Order, 'status' | 'statusHistory'>) {
  if (order.status === 'selesai' || order.status === 'siap_diambil') return 100;
  if (order.status === 'pending' || order.status === 'dibatalkan') return 0;
  return latestProgress(order)?.progressPercentage ?? 0;
}

export function orderTitle(order: Order) {
  const meta = parseOrderMeta(order);
  if (meta.packageName) return meta.packageName;
  const first = order.items[0];
  const name = first?.product?.name ?? first?.accessory?.name;
  if (name) return order.items.length > 1 ? `${name} +${order.items.length - 1} item` : name;
  return order.orderType === 'custom' ? 'Pesanan Jahit Seragam' : ORDER_TYPE_LABEL[order.orderType];
}

export function totalQuantity(order: Pick<Order, 'items'>) {
  return order.items.reduce((sum, i) => sum + i.quantity, 0);
}

/* ---------- Structured notes ----------
 * The website API has no columns for institution, PIC, event date, etc., so the order forms
 * write them as "Label: value" lines into customDetail.consultationNote. These helpers
 * write and read that block so the status pages can show the fields again.
 */

export interface OrderMeta {
  packageName?: string;
  institution?: string;
  pic?: string;
  phone?: string;
  eventDate?: string;
  model?: string;
  color?: string;
  accessories?: string[];
  rosterFile?: string;
  rosterCount?: number;
  address?: string;
  notes?: string;
}

const META_LABELS: Record<keyof OrderMeta, string> = {
  packageName: 'Paket',
  institution: 'Instansi',
  pic: 'PIC',
  phone: 'Kontak',
  eventDate: 'Target Acara',
  model: 'Model',
  color: 'Warna',
  accessories: 'Aksesoris',
  rosterFile: 'Berkas Ukuran',
  rosterCount: 'Jumlah Data Ukuran',
  address: 'Alamat Kirim',
  notes: 'Catatan',
};

export function formatOrderMeta(meta: OrderMeta): string {
  return (Object.keys(META_LABELS) as (keyof OrderMeta)[])
    .filter((k) => meta[k] !== undefined && meta[k] !== '' && !(Array.isArray(meta[k]) && (meta[k] as string[]).length === 0))
    .map((k) => {
      const v = meta[k];
      return `${META_LABELS[k]}: ${Array.isArray(v) ? v.join(', ') : String(v).replace(/\n+/g, ' ')}`;
    })
    .join('\n');
}

export function parseOrderMeta(order: Pick<Order, 'customOrderDetail'>): OrderMeta {
  const text = order.customOrderDetail?.consultationNote ?? '';
  const meta: OrderMeta = {};
  const byLabel = Object.fromEntries(Object.entries(META_LABELS).map(([k, v]) => [v.toLowerCase(), k as keyof OrderMeta]));
  for (const line of text.split('\n')) {
    const m = line.match(/^([^:]+):\s*(.*)$/);
    if (!m) continue;
    const key = byLabel[m[1]!.trim().toLowerCase()];
    if (!key) continue;
    const value = m[2]!.trim();
    if (key === 'accessories') meta.accessories = value.split(',').map((s) => s.trim()).filter(Boolean);
    else if (key === 'rosterCount') meta.rosterCount = Number(value) || undefined;
    else (meta as Record<string, string>)[key] = value;
  }
  return meta;
}
