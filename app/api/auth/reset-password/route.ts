import { NextResponse } from 'next/server';
import { resetPasswordWithOtp } from '@/modules/auth/services/auth-service';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const trimmedEmail = String(body?.email ?? '').trim().toLowerCase();
    const trimmedOtp = String(body?.otpCode ?? '').trim();
    const newPassword = String(body?.newPassword ?? '');
    const confirmPassword = String(body?.confirmPassword ?? '');

    if (!trimmedEmail || !trimmedOtp) {
      return NextResponse.json(
        { success: false, error: 'Sesi reset password tidak valid. Silakan ulangi proses.' },
        { status: 400 }
      );
    }

    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Kata sandi baru minimal 6 karakter.' },
        { status: 400 }
      );
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { success: false, error: 'Konfirmasi kata sandi tidak cocok.' },
        { status: 400 }
      );
    }

    const res = await resetPasswordWithOtp({
      email: trimmedEmail,
      otpCode: trimmedOtp,
      newPassword,
    });

    return NextResponse.json({ success: true, message: res.message });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message || 'Gagal mereset kata sandi.' },
      { status: 400 }
    );
  }
}
