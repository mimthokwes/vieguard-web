"use client";

import React, { useActionState, useState } from 'react';
import Link from 'next/link';
import { Mail, Lock, Eye, EyeOff, User, Phone, MapPin } from 'lucide-react';
import { loginAction, FormState } from '../actions';
import { Input } from '@/components/ui/input';
import { SubmitButton } from '@/components/ui/submit-button';
import { ErrorMessage } from '@/components/ui/error-message';

const initialState: FormState = {};

export function LoginForm() {
  const [state, formAction] = useActionState(loginAction, initialState);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {state.error && <ErrorMessage message={state.error} />}

      <Input
        label="Nama Lengkap"
        name="name"
        type="text"
        placeholder="mis. Dian Sastrowardoyo"
        leftIcon={<User className="w-4 h-4 text-[#8C857B]" />}
      />

      <Input
        label="Alamat Email"
        name="email"
        type="email"
        placeholder="klien.utama@vieguard.id"
        required
        leftIcon={<Mail className="w-4 h-4 text-[#8C857B]" />}
      />

      <Input
        label="Nomor Handphone / WhatsApp"
        name="phone"
        type="tel"
        placeholder="0812-3456-7890"
        leftIcon={<Phone className="w-4 h-4 text-[#8C857B]" />}
      />

      <Input
        label="Alamat Lengkap"
        name="address"
        type="text"
        placeholder="Alamat pengiriman / domisili lengkap..."
        leftIcon={<MapPin className="w-4 h-4 text-[#8C857B]" />}
      />

      <div className="relative">
        <div className="flex items-center justify-between mb-1">
          <label className="text-xs font-bold text-[#1C1C1C]">Kata Sandi</label>
          <Link
            href="/forgot-password"
            className="text-xs text-[#C48B54] hover:underline font-semibold"
          >
            Lupa kata sandi?
          </Link>
        </div>
        <div className="relative">
          <Input
            name="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••••••"
            required
            leftIcon={<Lock className="w-4 h-4 text-[#8C857B]" />}
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
        </div>
      </div>

      <div className="flex items-center gap-2.5 my-1">
        <input
          type="checkbox"
          id="remember"
          name="remember"
          className="w-4 h-4 accent-[#161616] rounded border-[#E6E1DA] cursor-pointer"
        />
        <label htmlFor="remember" className="text-xs text-[#6B655C] cursor-pointer font-medium">
          Ingat sesi saya di perangkat ini
        </label>
      </div>

      <SubmitButton
        label="Masuk ke Ruang Klien →"
        loadingLabel="Memverifikasi Kredensial..."
        variant="primary"
        className="py-3.5 text-sm rounded-2xl font-bold tracking-wide bg-[#161616] hover:bg-[#C48B54] text-white shadow-md transition-all cursor-pointer mt-2"
      />
    </form>
  );
}

