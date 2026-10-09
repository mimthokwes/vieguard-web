"use server";

import { loginUser, registerUser } from './lib/auth-api';
import { createSession } from '@/lib/session';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export interface FormState {
  error?: string;
  fieldErrors?: Record<string, string>;
  success?: boolean;
}

export async function loginAction(prevState: FormState, formData: FormData): Promise<FormState> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Email dan password wajib diisi.' };
  }

  let authData;
  try {
    authData = await loginUser(email, password);
  } catch (error) {
    return { error: (error as Error).message || 'Login gagal.' };
  }

  if (authData && authData.accessToken) {
    await createSession(authData.accessToken, authData.user);
  } else {
    return { error: 'Gagal mendapatkan akses token dari server.' };
  }

  revalidatePath('/');
  redirect('/');
}

export async function registerAction(prevState: FormState, formData: FormData): Promise<FormState> {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const phone = formData.get('phone') as string;
  const address = formData.get('address') as string;
  const password = formData.get('password') as string;

  if (!name || !email || !password) {
    return { error: 'Nama, email, dan password wajib diisi.' };
  }

  let authData;
  try {
    authData = await registerUser({ name, email, password, phone, address });
  } catch (error) {
    return { error: (error as Error).message || 'Registrasi gagal.' };
  }

  if (authData && authData.accessToken) {
    await createSession(authData.accessToken, authData.user);
  } else {
    return { error: 'Gagal membuat akun.' };
  }

  revalidatePath('/');
  redirect('/');
}
