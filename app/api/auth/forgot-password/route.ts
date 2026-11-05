import { NextResponse } from 'next/server';
import { requestPasswordResetOtp } from '@/modules/auth/services/auth-service';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const trimmedEmail = String(body?.email ?? '').trim().toLowerCase();

    if (!trimmedEmail || !/^\S+@\S+\.\S+$/.test(trimmedEmail)) {
      return NextResponse.json(
        { success: false, error: 'Masukkan alamat email yang valid.' },
        { status: 400 }
      );
    }

    const res = await requestPasswordResetOtp(trimmedEmail);
    return NextResponse.json({ success: true, message: res.message });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message || 'Gagal mengirim kode OTP.' },
      { status: 400 }
    );
  }
}
