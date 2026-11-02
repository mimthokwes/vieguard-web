"use server";

import { revalidatePath } from 'next/cache';
import { apiClient } from '@/lib/api-client';
import { getSessionToken, getSessionUser } from '@/lib/session';

export interface TestimonialActionState {
  success?: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
}

export async function submitTestimonialAction(
  _prev: TestimonialActionState,
  formData: FormData,
): Promise<TestimonialActionState> {
  const user = await getSessionUser();
  const token = await getSessionToken();

  if (!user || !token) {
    return { error: 'Silakan masuk terlebih dahulu untuk memberikan cerita atau ulasan.' };
  }

  const orderId = String(formData.get('orderId') ?? '').trim();
  const rating = Number(formData.get('rating') ?? 5);
  const comment = String(formData.get('comment') ?? '').trim();

  const fieldErrors: Record<string, string> = {};
  if (!orderId) fieldErrors.orderId = 'Pilih pesanan yang ingin diulas.';
  if (!rating || rating < 1 || rating > 5) fieldErrors.rating = 'Pilih rating bintang 1 sampai 5.';
  if (!comment || comment.length < 10) fieldErrors.comment = 'Tuliskan cerita / ulasan Anda minimal 10 karakter.';

  if (Object.keys(fieldErrors).length > 0) {
    return { error: 'Lengkapi isian ulasan dengan benar.', fieldErrors };
  }

  try {
    await apiClient('/testimonials', {
      method: 'POST',
      token,
      body: {
        orderId,
        rating,
        comment,
      },
    });

    revalidatePath('/about');
    return { success: true };
  } catch (err) {
    return { error: (err as Error).message || 'Gagal mengirim ulasan.' };
  }
}
