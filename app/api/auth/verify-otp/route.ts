import { NextResponse } from 'next/server';
import { verifyPasswordResetOtp } from '@/modules/auth/services/auth-service';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const trimmedEmail = String(body?.email ?? '').trim().toLowerCase();
    const trimmedOtp = String(body?.otpCode ?? '').trim();

    if (!trimmedEmail) {
      return NextResponse.json(
        { success: false, error: 'Email tidak boleh kosong.' },
        { status: 400 }
      );
    }

    if (!trimmedOtp || trimmedOtp.length !== 6) {
      return NextResponse.json(
        { success: false, error: 'Masukkan 6 digit kode OTP.' },
        { status: 400 }
      );
    }

    const res = await verifyPasswordResetOtp(trimmedEmail, trimmedOtp);
    return NextResponse.json({ success: true, message: res.message });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message || 'Kode OTP tidak valid atau telah kadaluwarsa.' },
      { status: 400 }
    );
  }
}
