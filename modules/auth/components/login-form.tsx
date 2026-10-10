"use client";

import React, { useActionState } from 'react';
import Link from 'next/link';
import { loginAction, FormState } from '../actions';
import { Checkbox, Input } from '@/components/ui/input';
import { SubmitButton } from '@/components/ui/submit-button';
import { ErrorMessage } from '@/components/ui/error-message';
import { PasswordInput } from './password-input';

const initialState: FormState = {};

export function LoginForm({ next }: { next?: string }) {
  const [state, formAction] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <ErrorMessage message={state.error} />
      {next && <input type="hidden" name="next" value={next} />}

      <Input
        label="Alamat Email"
        name="email"
        type="email"
        autoComplete="email"
        placeholder="Email pelanggan terdaftar"
        defaultValue={state.values?.email}
        error={state.fieldErrors?.email}
        required
      />

      <PasswordInput label="Kata Sandi" name="password" autoComplete="current-password" error={state.fieldErrors?.password} />

      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
        <Checkbox name="remember" label="Ingat saya di perangkat ini" />
        <Link href="/chat" className="text-xs font-semibold text-primary hover:underline">
          Lupa Kata Sandi? Hubungi admin via chat
        </Link>
      </div>

      <SubmitButton label="Masuk ke Akun" loadingLabel="Memverifikasi..." className="mt-1" />
    </form>
  );
}
