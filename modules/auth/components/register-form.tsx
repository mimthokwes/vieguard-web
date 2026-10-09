"use client";

import React, { useActionState, useState } from 'react';
import { User as UserIcon, Mail, Phone, MapPin, Lock, Eye, EyeOff } from 'lucide-react';
import { registerAction, FormState } from '../actions';
import { Input } from '@/components/ui/input';
import { SubmitButton } from '@/components/ui/submit-button';
import { ErrorMessage } from '@/components/ui/error-message';

const initialState: FormState = {};

export function RegisterForm() {
  const [state, formAction] = useActionState(registerAction, initialState);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {state.error && <ErrorMessage message={state.error} />}

      <Input
        label="Nama Lengkap"
        name="name"
        type="text"
        placeholder="mis. Dian Sastrowardoyo"
        required
        leftIcon={<UserIcon className="w-4 h-4" />}
      />

      <Input
        label="Alamat Email"
        name="email"
        type="email"
        placeholder="klien.utama@vieguard.id"
        required
        leftIcon={<Mail className="w-4 h-4" />}
      />

      <Input
        label="Nomor Handphone / WhatsApp"
        name="phone"
        type="tel"
        placeholder="0812-3456-7890"
        leftIcon={<Phone className="w-4 h-4" />}
      />

      <Input
        label="Alamat Lengkap"
        name="address"
        type="text"
        placeholder="Alamat pengiriman / domisili lengkap..."
        leftIcon={<MapPin className="w-4 h-4" />}
      />

      <Input
        label="Kata Sandi"
        name="password"
        type={showPassword ? 'text' : 'password'}
        placeholder="••••••••••••"
        required
        leftIcon={<Lock className="w-4 h-4" />}
        rightIcon={
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-[#8C857B] hover:text-[#1C1C1C]"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        }
      />

      <SubmitButton
        label="Daftarkan Akun Klien →"
        loadingLabel="Mendaftarkan Akun..."
        variant="primary"
        className="py-3.5 text-sm rounded-xl font-bold tracking-wide mt-2"
      />
    </form>
  );
}
