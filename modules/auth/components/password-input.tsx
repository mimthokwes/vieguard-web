"use client";

import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface PasswordInputProps {
  label: string;
  name: string;
  placeholder?: string;
  autoComplete?: string;
  error?: string;
  minLength?: number;
}

/** Password field with Eye / EyeOff icon toggle. */
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
          aria-label={visible ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
          title={visible ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
          className="flex size-8 items-center justify-center rounded-md text-ink-soft transition-colors hover:bg-beige-soft hover:text-ink focus:outline-none"
        >
          {visible ? (
            <Eye className="size-4" aria-hidden="true" />
          ) : (
            <EyeOff className="size-4" aria-hidden="true" />
          )}
        </button>
      }
    />
  );
}
