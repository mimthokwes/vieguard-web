"use server";

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { checkProductAvailability, getProductById } from '@/lib/api/product-api';
import { createOrder } from '@/lib/api/order-api';
import { getSessionUser } from '@/lib/session';
import { toNumber } from '@/lib/format';
import { Product } from '@/types/product';

export interface BookingInput {
  productId: string;
  mode: 'sewa' | 'beli';
  pickupDate?: string;
  returnDate?: string;
  /** variantId → quantity; key "" means "no specific size" for products without variants. */
  quantities: Record<string, number>;
  jenjang?: string;
  notes?: string;
}

export interface BookingResult {
  error?: string;
  needsLogin?: boolean;
}

export async function checkAvailabilityAction(productId: string, pickupDate: string, returnDate: string, variantId?: string) {
  try {
    const result = await checkProductAvailability(productId, pickupDate, returnDate, variantId);
    return { availableStock: result.availableStock };
  } catch (error) {
    return { error: (error as Error).message };
  }
}

function rentalDays(pickup: string, ret: string) {
  return Math.round((new Date(ret).getTime() - new Date(pickup).getTime()) / 86400000);
}

function unitPrice(product: Product, variantId: string, mode: 'sewa' | 'beli') {
  const variant = product.variants.find((v) => v.id === variantId);
  if (mode === 'sewa') return toNumber(variant?.priceRentOverride) || toNumber(product.basePriceRent);
  return toNumber(variant?.priceBuyOverride) || toNumber(product.basePriceBuy);
}

export async function submitBookingAction(input: BookingInput): Promise<BookingResult> {
  if (!(await getSessionUser())) return { needsLogin: true, error: 'Silakan masuk untuk melanjutkan pemesanan.' };

  const entries = Object.entries(input.quantities).filter(([, q]) => Number.isInteger(q) && q > 0);
  if (entries.length === 0) return { error: 'Isi jumlah unit yang dibutuhkan.' };

  let days = 1;
  if (input.mode === 'sewa') {
    if (!input.pickupDate || !input.returnDate) return { error: 'Pilih tanggal mulai sewa dan tanggal pengembalian.' };
    days = rentalDays(input.pickupDate, input.returnDate);
    if (days < 1) return { error: 'Tanggal pengembalian harus setelah tanggal mulai sewa.' };
    if (new Date(input.pickupDate).getTime() < new Date(new Date().toDateString()).getTime())
      return { error: 'Tanggal mulai sewa tidak boleh di masa lalu.' };
  }

  // Prices come from the product record, never from the browser.
  let product: Product;
  try {
    product = await getProductById(input.productId, { cache: 'no-store' });
  } catch {
    return { error: 'Produk tidak ditemukan.' };
  }

  const items = [];
  for (const [variantId, quantity] of entries) {
    const variant = product.variants.find((v) => v.id === variantId);
    if (variantId && !variant) return { error: 'Ukuran yang dipilih tidak valid.' };
    const price = unitPrice(product, variantId, input.mode);
    if (price <= 0) return { error: input.mode === 'sewa' ? 'Produk ini belum memiliki harga sewa.' : 'Produk ini belum memiliki harga jual.' };
    items.push({
      itemType: 'product' as const,
      productId: product.id,
      productVariantId: variant?.id,
      size: variant?.size,
      quantity,
      // Rental price is per unit per day; the backend multiplies by quantity only.
      unitPrice: input.mode === 'sewa' ? price * days : price,
    });
  }

  let orderId: string;
  try {
    const order = await createOrder({
      orderType: input.mode,
      requiresProduction: false,
      notes: [input.jenjang && `Jenjang: ${input.jenjang}`, input.notes?.trim()].filter(Boolean).join(' — ') || undefined,
      items,
      rentalDetail: input.mode === 'sewa' ? { pickupDate: input.pickupDate!, returnDate: input.returnDate! } : undefined,
    });
    orderId = order.id;
  } catch (error) {
    return { error: (error as Error).message || 'Gagal membuat pesanan.' };
  }

  revalidatePath('/orders');
  redirect(`/orders/${orderId}?created=1`);
}
