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
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        placeholder="nama@email.com"
        defaultValue={state.values?.email}
        error={state.fieldErrors?.email}
        required
      />

      <PasswordInput label="Kata Sandi" name="password" autoComplete="current-password" error={state.fieldErrors?.password} />

      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
        <Checkbox name="remember" label="Ingat saya" />
        <Link href="/chat" className="font-semibold text-primary hover:underline">
          Lupa sandi?
        </Link>
      </div>

      <SubmitButton label="Masuk" loadingLabel="Memverifikasi..." className="mt-2" />
    </form>
  );
}
