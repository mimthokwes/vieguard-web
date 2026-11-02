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
        label="Nama Lengkap"
        name="name"
        autoComplete="name"
        placeholder="Nama Anda"
        defaultValue={state.values?.name}
        error={state.fieldErrors?.name}
        required
      />
      <Input
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        placeholder="nama@email.com"
        defaultValue={state.values?.email}
        error={state.fieldErrors?.email}
        required
      />
      <Input
        label="Nomor WhatsApp"
        name="phone"
        type="tel"
        autoComplete="tel"
        placeholder="08123456789"
        defaultValue={state.values?.phone}
        error={state.fieldErrors?.phone}
        required
      />
      <PasswordInput
        label="Kata Sandi"
        name="password"
        autoComplete="new-password"
        placeholder="Minimal 6 karakter"
        minLength={6}
        error={state.fieldErrors?.password}
      />

      <Checkbox
        name="terms"
        required
        className="pt-1 text-xs"
        label="Saya menyetujui Syarat & Ketentuan layanan VIEGUARD"
      />
      {state.fieldErrors?.terms && <p className="-mt-2 text-xs text-danger">{state.fieldErrors.terms}</p>}

      <SubmitButton label="Daftar" loadingLabel="Mendaftarkan..." className="mt-2" />
    </form>
  );
}
