"use client";

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';

interface PasswordInputProps {
  label: string;
  name: string;
  placeholder?: string;
  autoComplete?: string;
  error?: string;
  minLength?: number;
}

/** Password field with the Figma "Tampilkan" toggle chip on the right. */
export function PasswordInput({ label, name, placeholder = 'Kata Sandi', autoComplete, error, minLength }: PasswordInputProps) {
  const [visible, setVisible] = useState(false);
  return (
    <Input
      label={label}
      name={name}
      type={visible ? 'text' : 'password'}
      placeholder={placeholder}
      autoComplete={autoComplete}
      minLength={minLength}
      error={error}
      required
      rightSlot={
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-pressed={visible}
          className="rounded border border-line bg-canvas px-3 py-1 text-xs text-ink-soft transition-colors hover:border-primary hover:text-primary"
        >
          {visible ? 'Sembunyikan' : 'Tampilkan'}
        </button>
      }
    />
  );
}
