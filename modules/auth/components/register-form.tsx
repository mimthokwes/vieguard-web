"use client";

import React, { useActionState } from 'react';
import { registerAction, FormState } from '../actions';
import { Checkbox, Input } from '@/components/ui/input';
import { SubmitButton } from '@/components/ui/submit-button';
import { ErrorMessage } from '@/components/ui/error-message';
import { PasswordInput } from './password-input';

const initialState: FormState = {};

export function RegisterForm() {
  const [state, formAction] = useActionState(registerAction, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-3.5">
      <ErrorMessage message={state.error} />

      <Input
        label="Nama Lengkap / Perwakilan Resmi Sekolah"
        name="name"
        autoComplete="name"
        placeholder="Nama Pelanggan"
        defaultValue={state.values?.name}
        error={state.fieldErrors?.name}
        required
      />
      <Input
        label="Alamat Email"
        name="email"
        type="email"
        autoComplete="email"
        placeholder="nama@sekolah.sch.id"
        defaultValue={state.values?.email}
        error={state.fieldErrors?.email}
        required
      />
      <Input
        label="Nomor WhatsApp / Telepon"
        name="phone"
        type="tel"
        autoComplete="tel"
        placeholder="+62 812-xxxx-xxxx"
        defaultValue={state.values?.phone}
        error={state.fieldErrors?.phone}
        required
      />
      <PasswordInput
        label="Buat Kata Sandi"
        name="password"
        autoComplete="new-password"
        placeholder="Minimal 6 karakter"
        minLength={6}
        error={state.fieldErrors?.password}
      />

      <Checkbox
        name="terms"
        required
        className="pt-1"
        label={
          <>
            Saya menyetujui <span className="font-bold text-ink underline">Syarat & Ketentuan</span> dan{' '}
            <span className="font-bold text-ink underline">Kebijakan Penyewaan</span>
            <span className="text-primary"> *</span>
          </>
        }
      />
      {state.fieldErrors?.terms && <p className="-mt-2 text-xs text-danger">{state.fieldErrors.terms}</p>}

      <SubmitButton label="Buat Akun Baru" loadingLabel="Mendaftarkan..." className="mt-1" />
    </form>
  );
}
