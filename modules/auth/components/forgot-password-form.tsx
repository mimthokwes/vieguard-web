"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Mail, KeyRound, Lock, CheckCircle2, ArrowLeft, RefreshCw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { PasswordInput } from './password-input';
import { OtpInput } from './otp-input';
import { Button } from '@/components/ui/button';
import { ErrorMessage } from '@/components/ui/error-message';

async function postJson(url: string, data: unknown) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    return { success: false, error: json.error || json.message || 'Terjadi kesalahan pada server.' };
  }
  return json;
}

type Step = 'email' | 'otp' | 'new-password' | 'success';

export function ForgotPasswordForm() {
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [successInfo, setSuccessInfo] = useState<string | undefined>(undefined);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Timer countdown for resending OTP
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // Step 1: Submit Email to send OTP
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(undefined);
    setSuccessInfo(undefined);

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError('Masukkan alamat email Anda.');
      return;
    }

    setLoading(true);
    try {
      const res = await postJson('/api/auth/forgot-password', { email: trimmedEmail });
      if (res.success) {
        setSuccessInfo(res.message || 'Kode OTP telah dikirim ke email Anda.');
        setResendCooldown(60);
        setStep('otp');
      } else {
        setError(res.error || 'Gagal mengirim kode OTP.');
      }
    } catch {
      setError('Terjadi kendala jaringan. Pastikan backend sedang aktif.');
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (resendCooldown > 0 || loading) return;
    setError(undefined);
    setSuccessInfo(undefined);
    setLoading(true);

    try {
      const res = await postJson('/api/auth/forgot-password', { email: email.trim() });
      if (res.success) {
        setSuccessInfo('Kode OTP baru telah dikirim ke email Anda.');
        setResendCooldown(60);
      } else {
        setError(res.error || 'Gagal mengirim ulang kode OTP.');
      }
    } catch {
      setError('Terjadi kendala saat mengirim ulang OTP.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(undefined);
    setSuccessInfo(undefined);

    const cleanOtp = otpCode.replace(/\D/g, '').trim();
    if (cleanOtp.length !== 6) {
      setError('Masukkan 6 digit kode OTP verifikasi.');
      return;
    }

    setLoading(true);
    try {
      const res = await postJson('/api/auth/verify-otp', {
        email: email.trim(),
        otpCode: cleanOtp,
      });
      if (res.success) {
        setSuccessInfo('Kode OTP terverifikasi.');
        setStep('new-password');
      } else {
        setError(res.error || 'Kode OTP tidak valid atau telah kadaluwarsa.');
      }
    } catch {
      setError('Terjadi kendala verifikasi OTP. Silakan coba kembali.');
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(undefined);
    setSuccessInfo(undefined);

    if (newPassword.length < 6) {
      setError('Kata sandi baru minimal 6 karakter.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Konfirmasi kata sandi tidak cocok.');
      return;
    }

    setLoading(true);
    try {
      const res = await postJson('/api/auth/reset-password', {
        email: email.trim(),
        otpCode: otpCode.replace(/\D/g, '').trim(),
        newPassword,
        confirmPassword,
      });

      if (res.success) {
        setStep('success');
      } else {
        setError(res.error || 'Gagal mengubah kata sandi.');
      }
    } catch {
      setError('Terjadi kendala saat menyimpan kata sandi baru.');
    } finally {
      setLoading(false);
    }
  };

  // Render Step 4: Success View
  if (step === 'success') {
    return (
      <div className="flex flex-col items-center text-center py-4">
        <div className="flex size-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 mb-4 ring-8 ring-emerald-50/50">
          <CheckCircle2 className="size-8" />
        </div>
        <h2 className="text-xl font-bold tracking-tight text-ink">
          Kata Sandi Berhasil Diperbarui
        </h2>
        <p className="mt-2 text-xs text-muted leading-relaxed max-w-xs">
          Kata sandi akun Anda telah berhasil diubah. Silakan masuk kembali menggunakan kata sandi baru Anda.
        </p>

        <div className="mt-6 w-full">
          <Link
            href="/login"
            className="flex h-10 w-full items-center justify-center rounded-[10px] bg-primary font-bold text-white shadow-button hover:bg-primary-light transition-colors text-sm"
          >
            Masuk ke Akun Sekarang
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <ErrorMessage message={error} />

      {successInfo && (
        <div className="rounded-lg bg-emerald-50 border border-emerald-200/60 p-3 text-xs font-medium text-emerald-800">
          {successInfo}
        </div>
      )}

      {/* STEP 1: INPUT EMAIL */}
      {step === 'email' && (
        <form onSubmit={handleRequestOtp} className="flex flex-col gap-4">
          <Input
            label="Email Terdaftar"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="nama@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            leftIcon={<Mail className="size-4" />}
            required
            autoFocus
          />

          <Button
            type="submit"
            variant="primary"
            fullWidth
            disabled={loading}
            className="mt-2"
          >
            {loading ? 'Mengirim Kode OTP...' : 'Kirim Kode OTP'}
          </Button>

          <div className="pt-2 text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-soft hover:text-primary transition-colors"
            >
              <ArrowLeft className="size-3.5" />
              Kembali ke halaman masuk
            </Link>
          </div>
        </form>
      )}

      {/* STEP 2: INPUT OTP */}
      {step === 'otp' && (
        <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4">
          <div className="py-1">
            <label className="text-[13px] font-medium text-ink block text-center mb-3">
              Masukkan 6 Digit Kode OTP
            </label>
            <OtpInput
              length={6}
              value={otpCode}
              onChange={(val) => setOtpCode(val)}
              disabled={loading}
              autoFocus
            />
            <p className="mt-2.5 text-[11px] text-muted text-center">
              Periksa kotak masuk atau folder spam email Anda
            </p>
          </div>

          <Button
            type="submit"
            variant="primary"
            fullWidth
            disabled={loading || otpCode.length !== 6}
            className="mt-1"
          >
            {loading ? 'Memverifikasi...' : 'Verifikasi Kode OTP'}
          </Button>

          <div className="flex items-center justify-between pt-2 text-xs">
            <button
              type="button"
              onClick={() => {
                setError(undefined);
                setSuccessInfo(undefined);
                setStep('email');
              }}
              className="inline-flex items-center gap-1 text-ink-soft hover:text-ink"
            >
              <ArrowLeft className="size-3" />
              Kembali
            </button>

            <button
              type="button"
              disabled={resendCooldown > 0 || loading}
              onClick={handleResendOtp}
              className="inline-flex items-center gap-1 font-semibold text-primary disabled:opacity-50 disabled:cursor-not-allowed hover:underline"
            >
              <RefreshCw className={`size-3 ${loading ? 'animate-spin' : ''}`} />
              {resendCooldown > 0 ? `Kirim ulang (${resendCooldown}s)` : 'Kirim ulang OTP'}
            </button>
          </div>
        </form>
      )}

      {/* STEP 3: BUAT PASSWORD BARU */}
      {step === 'new-password' && (
        <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
          <PasswordInput
            label="Kata Sandi Baru"
            name="newPassword"
            placeholder="Minimal 6 karakter"
            minLength={6}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            autoFocus
          />

          <PasswordInput
            label="Ulangi Kata Sandi Baru"
            name="confirmPassword"
            placeholder="Ketik ulang kata sandi"
            minLength={6}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <Button
            type="submit"
            variant="primary"
            fullWidth
            disabled={loading || !newPassword || !confirmPassword}
            className="mt-2"
          >
            {loading ? 'Menyimpan Kata Sandi...' : 'Simpan Kata Sandi Baru'}
          </Button>

          <div className="pt-1 text-center">
            <button
              type="button"
              onClick={() => setStep('otp')}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-soft hover:text-primary transition-colors"
            >
              <ArrowLeft className="size-3.5" />
              Kembali ke langkah OTP
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
