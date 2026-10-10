"use server";

import { revalidatePath } from 'next/cache';
import { apiClient } from '@/lib/api-client';
import { getSessionToken, getSessionUser, updateSessionUser } from '@/lib/session';
import { User } from '@/types/user';

export interface ProfileActionState {
  error?: string;
  success?: string;
  fieldErrors?: Record<string, string>;
}

/** Only name, phone and address are sent — never pass arbitrary form fields to PUT /users/me. */
async function putProfile(patch: { name?: string; phone?: string; address?: string }) {
  const token = await getSessionToken();
  if (!token) throw new Error('Sesi berakhir. Silakan masuk kembali.');
  const updated = await apiClient<User>('/users/me', { method: 'PUT', body: JSON.stringify(patch), token });
  const current = await getSessionUser();
  await updateSessionUser({ ...(current ?? {}), ...updated } as User);
  revalidatePath('/', 'layout');
}

export async function updateIdentityAction(_prev: ProfileActionState, formData: FormData): Promise<ProfileActionState> {
  const name = String(formData.get('name') ?? '').trim();
  const phone = String(formData.get('phone') ?? '').trim();
  const fieldErrors: Record<string, string> = {};
  if (name.length < 2) fieldErrors.name = 'Nama minimal 2 karakter.';
  if (phone && !/^[+\d][\d\s-]{6,19}$/.test(phone)) fieldErrors.phone = 'Format nomor telepon tidak valid.';
  if (Object.keys(fieldErrors).length) return { fieldErrors, error: 'Periksa kembali isian.' };
  try {
    await putProfile({ name, phone });
    return { success: 'Data identitas berhasil diperbarui.' };
  } catch (error) {
    return { error: (error as Error).message };
  }
}

export async function updateAddressAction(_prev: ProfileActionState, formData: FormData): Promise<ProfileActionState> {
  const recipient = String(formData.get('recipient') ?? '').trim();
  const street = String(formData.get('street') ?? '').trim();
  if (street.length < 10) return { fieldErrors: { street: 'Alamat minimal 10 karakter.' }, error: 'Periksa kembali isian.' };
  // The API has a single address column; keep the recipient/building on the first line.
  const address = recipient ? `${recipient}\n${street}` : street;
  try {
    await putProfile({ address });
    return { success: 'Alamat pengiriman berhasil diperbarui.' };
  } catch (error) {
    return { error: (error as Error).message };
  }
}
