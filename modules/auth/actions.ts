"use server";

import { loginUser, registerUser } from './lib/auth-api';
import { createSession } from '@/lib/session';
import { ApiError } from '@/lib/api-client';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export interface FormState {
  error?: string;
  fieldErrors?: Record<string, string>;
  values?: Record<string, string>;
  success?: boolean;
}

function flattenFieldErrors(error: unknown): Record<string, string> | undefined {
  if (!(error instanceof ApiError) || !error.errors) return undefined;
  return Object.fromEntries(Object.entries(error.errors).map(([field, messages]) => [field, messages[0] ?? '']));
}

/** Only allow same-site relative redirects. */
function safeNext(raw: FormDataEntryValue | null): string {
  const next = typeof raw === 'string' ? raw : '';
  return next.startsWith('/') && !next.startsWith('//') ? next : '/';
}

export async function loginAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');
  const values = { email };

  if (!email || !password) {
    return { error: 'Email dan kata sandi wajib diisi.', values };
  }

  let authData;
  try {
    authData = await loginUser(email, password);
  } catch (error) {
    return { error: (error as Error).message || 'Login gagal.', fieldErrors: flattenFieldErrors(error), values };
  }

  if (!authData?.accessToken) {
    return { error: 'Gagal mendapatkan akses token dari server.', values };
  }
  await createSession(authData.accessToken, authData.user, authData.refreshToken);

  revalidatePath('/', 'layout');
  redirect(safeNext(formData.get('next')));
}

export async function registerAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const name = String(formData.get('name') ?? '').trim();
  const email = String(formData.get('email') ?? '').trim();
  const phone = String(formData.get('phone') ?? '').trim();
  const password = String(formData.get('password') ?? '');
  const values = { name, email, phone };

  const fieldErrors: Record<string, string> = {};
  if (name.length < 2) fieldErrors.name = 'Nama minimal 2 karakter.';
  if (!email) fieldErrors.email = 'Email wajib diisi.';
  if (!phone) fieldErrors.phone = 'Nomor WhatsApp wajib diisi.';
  if (password.length < 6) fieldErrors.password = 'Kata sandi minimal 6 karakter.';
  if (!formData.get('terms')) fieldErrors.terms = 'Anda harus menyetujui Syarat & Ketentuan.';
  if (Object.keys(fieldErrors).length > 0) {
    return { error: 'Periksa kembali isian formulir.', fieldErrors, values };
  }

  let authData;
  try {
    authData = await registerUser({ name, email, password, phone });
  } catch (error) {
    return { error: (error as Error).message || 'Registrasi gagal.', fieldErrors: flattenFieldErrors(error), values };
  }

  if (!authData?.accessToken) {
    return { error: 'Akun dibuat, tetapi sesi gagal dibuat. Silakan masuk.', values };
  }
  await createSession(authData.accessToken, authData.user, authData.refreshToken);

  revalidatePath('/', 'layout');
  redirect('/order');
}
