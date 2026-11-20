"use server";

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { createOrder } from './services/order-service';
import { getSessionUser } from '@/lib/session';
import { formatOrderMeta } from '@/lib/order-status';
import { encodeOrderId } from '@/lib/order-hash';
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
  redirect(`/orders/${encodeOrderId(orderId)}?created=1`);
}

export async function submitCustomOrder(_prev: OrderActionState, formData: FormData): Promise<OrderActionState> {
  if (!(await getSessionUser())) return { error: 'Sesi berakhir. Silakan masuk kembali.' };

  const get = (k: string) => String(formData.get(k) ?? '').trim();
  const quantity = Number(get('quantity')) || 1;
  const accessoriesInput = get('accessoriesInput');
  const accessoriesListFromInput = accessoriesInput
    ? accessoriesInput.split(/[\n,]+/).map((s) => s.trim()).filter(Boolean)
    : [];
  const accessories = [
    ...accessoriesListFromInput,
    ...formData.getAll('accessories').map(String),
  ];
  const material = get('material');
  const materialDetail = get('materialDetail');
  const fullMaterial = [material, materialDetail].filter(Boolean).join(' — ');
  const category = get('category');
  const consultationNote = get('consultationNote');

  const values = {
    institution: get('institution'),
    jenjang: get('jenjang'),
    designReference: get('designReference'),
    description: get('description'),
    eventDate: get('eventDate'),
  };

  const fieldErrors: Record<string, string> = {};
  if (!values.institution) fieldErrors.institution = 'Nama instansi / pemesan wajib diisi.';
  if (values.description.length < 10) fieldErrors.description = 'Jelaskan konsep dan deskripsi barang minimal 10 karakter.';
  if (values.description.length > 2000) fieldErrors.description = 'Maksimal 2000 karakter.';
  if (!Number.isInteger(quantity) || quantity < 1)
    fieldErrors.quantity = `Jumlah pesanan minimal 1 stel.`;
  if (!values.eventDate) fieldErrors.eventDate = 'Target tanggal acara wajib diisi.';
  if (values.designReference && !values.designReference.startsWith('data:') && !/^https?:\/\//i.test(values.designReference))
    fieldErrors.designReference = 'Masukkan tautan yang diawali http:// atau https://';
  if (Object.keys(fieldErrors).length > 0) return { error: 'Periksa kembali isian formulir.', fieldErrors };

  const rosterJsonRaw = get('rosterPayload');
  let rosterPayload: any = null;
  if (rosterJsonRaw) {
    try {
      rosterPayload = JSON.parse(rosterJsonRaw);
    } catch {}
  }

  const formatRoleWithMeasurements = (r: any) => {
    const parts: string[] = [];
    if (r.chestCm) parts.push(`LD:${r.chestCm}`);
    if (r.waistCm) parts.push(`LP:${r.waistCm}`);
    if (r.shoulderCm) parts.push(`B:${r.shoulderCm}`);
    if (r.armCm) parts.push(`PL:${r.armCm}`);
    if (r.pantsCm) parts.push(`PC:${r.pantsCm}`);
    if (r.headCm) parts.push(`LK:${r.headCm}`);

    const tag = parts.length > 0 ? `[${parts.join(' ')}]` : '';
    const baseRole = (r.role || '').trim();
    if (!tag) return baseRole || undefined;
    if (!baseRole) return tag.slice(0, 60);
    const combined = `${baseRole} ${tag}`;
    return combined.length <= 60 ? combined : `${baseRole.slice(0, Math.max(0, 58 - tag.length))} ${tag}`.slice(0, 60);
  };

  const orderSizeEntries = rosterPayload?.rows?.map((r: any) => ({
    studentName: r.name,
    gender: r.gender,
    heightCm: r.heightCm,
    size: r.size,
    role: formatRoleWithMeasurements(r),
  }));

  const rosterJson = rosterPayload ? JSON.stringify({
    fileName: rosterPayload.fileName,
    rawHeaders: rosterPayload.rawHeaders,
    rawRows: rosterPayload.rawRows,
    rows: rosterPayload.rows,
  }) : undefined;

  const user = await getSessionUser();

  const baseConsultNote = formatOrderMeta({
    packageName: 'Pesanan Custom (Pre-Order Desain Sendiri)',
    institution: values.institution,
    pic: user?.name,
    phone: user?.phone ?? undefined,
    eventDate: values.eventDate,
    material: fullMaterial || undefined,
    accessories,
    rosterFile: rosterPayload?.fileName,
    rosterCount: rosterPayload?.rows?.length || quantity,
    notes: consultationNote || undefined,
  });

  const fullConsultationNote = rosterJson
    ? `${baseConsultNote}\n===ROSTER_JSON_START===\n${rosterJson}\n===ROSTER_JSON_END===`
    : baseConsultNote;

  const items = rosterPayload?.sizeCounts && Object.keys(rosterPayload.sizeCounts).length > 0
    ? Object.entries(rosterPayload.sizeCounts as Record<string, number>).map(([size, q]) => ({
        itemType: 'product' as const,
        quantity: q,
        size,
        unitPrice: 0,
      }))
    : [{ itemType: 'product' as const, quantity, unitPrice: 0 }];

  const combinedDescription = [
    category && `Kategori: ${category}`,
    fullMaterial && `Preferensi Bahan: ${fullMaterial}`,
    rosterPayload?.fileName && `Berkas Ukuran: ${rosterPayload.fileName} (${rosterPayload.rows?.length || quantity} Siswa)`,
    `\nDeskripsi Desain & Model:\n${values.description}`,
  ]
    .filter(Boolean)
    .join('\n');

  let orderId: string;
  try {
    const order = await createOrder({
      orderType: 'custom',
      requiresProduction: true,
      items,
      orderSizeEntries,
      customDetail: {
        designReference: values.designReference || undefined,
        designDescription: combinedDescription,
        jenisJenjang: values.jenjang || undefined,
        consultationNote: fullConsultationNote,
      },
    });
    orderId = order.id;
  } catch (error) {
    return { error: (error as Error).message || 'Gagal mengirim permohonan.' };
  }

  revalidatePath('/orders');
  redirect(`/orders/${encodeOrderId(orderId)}?created=1`);
}
