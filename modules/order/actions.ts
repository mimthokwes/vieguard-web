"use server";

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { createOrder } from '@/lib/api/order-api';
import { getSessionUser } from '@/lib/session';
import { formatOrderMeta } from '@/lib/order-status';
import { CUSTOM_MIN_QUANTITY, STANDARD_PACKAGE } from './data';

export interface OrderActionState {
  error?: string;
  fieldErrors?: Record<string, string>;
}

export interface StandardOrderInput {
  institution: string;
  pic: string;
  phone: string;
  eventDate: string;
  jenjang: string;
  category: string;
  color: string;
  notes: string;
  address: string;
  roster: { fileName: string; count: number; sizeCounts: Record<string, number> } | null;
}

export async function submitStandardOrder(input: StandardOrderInput): Promise<OrderActionState> {
  if (!(await getSessionUser())) return { error: 'Sesi berakhir. Silakan masuk kembali.' };

  const fieldErrors: Record<string, string> = {};
  if (!input.institution.trim()) fieldErrors.institution = 'Nama instansi wajib diisi.';
  if (!input.pic.trim()) fieldErrors.pic = 'Penanggung jawab wajib diisi.';
  if (!input.phone.trim()) fieldErrors.phone = 'Nomor WhatsApp wajib diisi.';
  if (!input.eventDate) fieldErrors.eventDate = 'Tanggal acara wajib diisi.';
  if (!input.jenjang) fieldErrors.jenjang = 'Pilih jenjang.';
  if (!input.category) fieldErrors.category = 'Pilih kategori seragam.';
  if (!input.roster || input.roster.count === 0) fieldErrors.roster = 'Unggah berkas data ukuran terlebih dahulu.';
  if (!input.address.trim()) fieldErrors.address = 'Alamat pengiriman wajib diisi.';
  if (Object.keys(fieldErrors).length > 0) return { error: 'Lengkapi data yang wajib diisi.', fieldErrors };

  // One line item per size group; the admin sets the unit price when confirming.
  const items = Object.entries(input.roster!.sizeCounts).map(([size, quantity]) => ({
    itemType: 'product' as const,
    quantity,
    size,
    unitPrice: 0,
  }));

  let orderId: string;
  try {
    const order = await createOrder({
      orderType: 'custom',
      requiresProduction: true,
      notes: input.notes.trim() || undefined,
      items,
      customDetail: {
        jenisJenjang: input.jenjang,
        designDescription: `${STANDARD_PACKAGE.name} — ${input.category}. Warna: ${input.color || '-'}.`,
        consultationNote: formatOrderMeta({
          packageName: `${STANDARD_PACKAGE.name} — ${input.category}`,
          institution: input.institution.trim(),
          pic: input.pic.trim(),
          phone: input.phone.trim(),
          eventDate: input.eventDate,
          model: input.category,
          color: input.color,
          rosterFile: input.roster!.fileName,
          rosterCount: input.roster!.count,
          address: input.address.trim(),
        }),
      },
    });
    orderId = order.id;
  } catch (error) {
    return { error: (error as Error).message || 'Gagal mengirim pesanan.' };
  }

  revalidatePath('/orders');
  redirect(`/orders/${orderId}?created=1`);
}

export async function submitCustomOrder(_prev: OrderActionState, formData: FormData): Promise<OrderActionState> {
  if (!(await getSessionUser())) return { error: 'Sesi berakhir. Silakan masuk kembali.' };

  const get = (k: string) => String(formData.get(k) ?? '').trim();
  const quantity = Number(get('quantity'));
  const accessories = formData.getAll('accessories').map(String);
  const values = {
    institution: get('institution'),
    jenjang: get('jenjang'),
    designReference: get('designReference'),
    description: get('description'),
    eventDate: get('eventDate'),
  };

  const fieldErrors: Record<string, string> = {};
  if (!values.institution) fieldErrors.institution = 'Nama instansi wajib diisi.';
  if (values.description.length < 20) fieldErrors.description = 'Jelaskan konsep desain minimal 20 karakter.';
  if (values.description.length > 1000) fieldErrors.description = 'Maksimal 1000 karakter.';
  if (!Number.isInteger(quantity) || quantity < CUSTOM_MIN_QUANTITY)
    fieldErrors.quantity = `Minimal pemesanan paket kustom ${CUSTOM_MIN_QUANTITY} stel.`;
  if (!values.eventDate) fieldErrors.eventDate = 'Tanggal acara wajib diisi.';
  if (values.designReference && !/^https?:\/\//i.test(values.designReference))
    fieldErrors.designReference = 'Masukkan tautan yang diawali http:// atau https://';
  if (Object.keys(fieldErrors).length > 0) return { error: 'Periksa kembali isian formulir.', fieldErrors };

  const user = await getSessionUser();
  let orderId: string;
  try {
    const order = await createOrder({
      orderType: 'custom',
      requiresProduction: true,
      items: [{ itemType: 'product', quantity, unitPrice: 0 }],
      customDetail: {
        designReference: values.designReference || undefined,
        designDescription: values.description,
        jenisJenjang: values.jenjang || undefined,
        consultationNote: formatOrderMeta({
          packageName: 'Paket Kustom Adibusana (Bespoke)',
          institution: values.institution,
          pic: user?.name,
          phone: user?.phone ?? undefined,
          eventDate: values.eventDate,
          accessories,
        }),
      },
    });
    orderId = order.id;
  } catch (error) {
    return { error: (error as Error).message || 'Gagal mengirim permohonan.' };
  }

  revalidatePath('/orders');
  redirect(`/orders/${orderId}?created=1`);
}
