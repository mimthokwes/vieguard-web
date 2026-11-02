"use client";

import React, { useActionState, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  Building2,
  Camera,
  CheckCircle2,
  Clock,
  GraduationCap,
  HeartHandshake,
  Mail,
  MapPin,
  MessagesSquare,
  PackageCheck,
  Phone,
  Send,
  Star,
  Users,
} from 'lucide-react';
import { StoreProfile } from '@/types/store';
import { Testimonial } from '@/types/testimonial';
import { User } from '@/types/user';
import { Order } from '@/types/order';
import { PageContainer, PageHeader } from '@/components/layout/page-header';
import { ButtonLink } from '@/components/ui/button';
import { SubmitButton } from '@/components/ui/submit-button';
import { ErrorMessage } from '@/components/ui/error-message';
import { PORTFOLIO_PROJECTS, categoryLabel } from '@/modules/portfolio/data';
import { submitTestimonialAction, TestimonialActionState } from '../actions';

interface AboutViewProps {
  store: StoreProfile | null;
  testimonials: Testimonial[];
  user: User | null;
  completedOrders?: Order[];
}

const initialState: TestimonialActionState = {};

export function AboutView({ store, testimonials, user, completedOrders = [] }: AboutViewProps) {
  const [selectedRating, setSelectedRating] = useState<number>(5);
  const [state, formAction] = useActionState(submitTestimonialAction, initialState);

  // Orders that can be reviewed
  const reviewableOrders = useMemo(() => {
    const existingOrderIds = new Set(testimonials.map((t) => t.orderId).filter(Boolean));
    return completedOrders.filter((o) => !existingOrderIds.has(o.id));
  }, [completedOrders, testimonials]);

  const customerPhotos = PORTFOLIO_PROJECTS.slice(0, 6);

  return (
    <PageContainer>
      <div className="space-y-10 pb-16">
        <PageHeader
          eyebrow="PROFIL USAHA"
          title={`Tentang ${store?.storeName || 'Vieguard'}`}
          description={
            store?.description ||
            'Konveksi, perlengkapan, dan persewaan seragam marching band terpercaya untuk sekolah dan instansi.'
          }
          aside={
            <ButtonLink
              href="/chat?topic=Konsultasi%20Profil%20Usaha"
              variant="outline"
              size="sm"
              className="inline-flex items-center gap-2 !border-primary !text-primary hover:!bg-primary/5"
            >
              <MessagesSquare className="size-4" /> Chat Admin
            </ButtonLink>
          }
        />

        {/* ─── 1. Informasi Usaha & Workshop ─── */}
        <section aria-label="Informasi Usaha" className="rounded-2xl bg-surface p-6 sm:p-8 shadow-card ring-1 ring-line">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-line pb-6">
            <div className="flex items-center gap-3.5">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Building2 className="size-6" />
              </span>
              <div>
                <h2 className="text-xl font-bold text-ink">{store?.storeName || 'Vieguard Marching Band'}</h2>
                <p className="text-xs text-ink-soft">Workshop resmi & layanan konsultasi seragam</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 self-start rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200 sm:self-auto">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              Workshop Aktif & Siap Melayani
            </span>
          </div>

          <div className="grid grid-cols-1 gap-6 pt-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* Alamat */}
            <div className="flex flex-col gap-1.5 rounded-xl bg-beige-soft/50 p-4 border border-line/60">
              <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
                <MapPin className="size-4" /> Alamat Workshop
              </span>
              <p className="pt-1 text-sm font-semibold leading-relaxed text-ink">
                {store?.address || 'Jl. Merdeka No. 45, Kota Malang, Jawa Timur'}
              </p>
              <p className="mt-auto pt-2 text-[11px] text-ink-soft">Kunjungan & konsultasi langsung</p>
            </div>

            {/* Jam Kerja */}
            <div className="flex flex-col gap-1.5 rounded-xl bg-beige-soft/50 p-4 border border-line/60">
              <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
                <Clock className="size-4" /> Jam Operasional
              </span>
              <p className="pt-1 text-sm font-semibold text-ink">
                {store?.operationalHours || 'Senin - Sabtu: 08:00 - 17:00 WIB'}
              </p>
              <p className="mt-auto pt-2 text-[11px] text-ink-soft">Minggu & Hari Libur: Janji Temu</p>
            </div>

            {/* Telepon / WA */}
            <div className="flex flex-col gap-1.5 rounded-xl bg-beige-soft/50 p-4 border border-line/60">
              <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
                <Phone className="size-4" /> Kontak Langsung
              </span>
              <p className="pt-1 text-sm font-semibold text-ink">
                {store?.whatsappNumber || store?.phone || '0812-3456-7890'}
              </p>
              <p className="mt-auto pt-2 text-[11px] text-ink-soft">Respon cepat via WhatsApp & Telepon</p>
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5 rounded-xl bg-beige-soft/50 p-4 border border-line/60">
              <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
                <Mail className="size-4" /> Email Resmi
              </span>
              <p className="pt-1 text-sm font-semibold text-ink truncate" title={store?.email || 'info@vieguard.com'}>
                {store?.email || 'info@vieguard.com'}
              </p>
              <p className="mt-auto pt-2 text-[11px] text-ink-soft">Penawaran formal & surat menyurat</p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-xl bg-beige-soft p-4 border border-line">
            <div className="space-y-0.5">
              <p className="text-sm font-bold text-ink">Butuh penawaran resmi atau diskusi kostum khusus?</p>
              <p className="text-xs text-ink-soft">Tim Vieguard siap membantu kebutuhan desain dan spesifikasi marching band Anda.</p>
            </div>
            <ButtonLink
              href="/chat?topic=Konsultasi%20Profil%20Usaha"
              variant="primary"
              size="sm"
              className="inline-flex items-center gap-2"
            >
              <MessagesSquare className="size-4" /> Konsultasi Sekarang
            </ButtonLink>
          </div>
        </section>

        {/* ─── 2. Dokumentasi Foto Pelanggan ─── */}
        <section aria-labelledby="documentation-title" className="space-y-6">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end border-b border-line pb-4">
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary">
                <Camera className="size-4" /> Dokumentasi Pelanggan
              </span>
              <h2 id="documentation-title" className="pt-1 text-2xl font-extrabold text-ink sm:text-3xl">
                Foto Pemesan & Klien Kami
              </h2>
              <p className="text-sm text-ink-soft pt-1">
                Dokumentasi seragam dan atribut marching band hasil produksi yang telah dipercayakan kepada Vieguard.
              </p>
            </div>
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline self-start sm:self-auto"
            >
              Lihat Portofolio Lengkap <ArrowRight className="size-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {customerPhotos.map((item) => (
              <article
                key={item.id}
                className="group flex flex-col overflow-hidden rounded-2xl bg-surface shadow-card ring-1 ring-line transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="relative h-56 w-full overflow-hidden bg-beige-soft">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center text-xs text-ink-soft">
                      Foto Dokumentasi
                    </div>
                  )}
                  <span
                    className={`absolute left-3 top-3 rounded-full px-2.5 py-0.5 text-[11px] font-bold shadow-sm ${
                      item.category === 'mayoret' ? 'bg-gold-dark text-white' : 'bg-primary text-on-primary'
                    }`}
                  >
                    {categoryLabel(item.category)}
                  </span>
                  <span className="absolute right-3 top-3 rounded-full bg-surface/90 px-2.5 py-0.5 text-[11px] font-bold text-ink backdrop-blur-sm shadow-sm">
                    {item.year}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-4">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-primary">
                    <GraduationCap className="size-3.5" />
                    <span>{item.institution}</span>
                  </div>
                  <h3 className="mt-1 line-clamp-1 text-sm font-bold text-ink" title={item.title}>
                    {item.title}
                  </h3>
                  <div className="mt-3 flex items-center justify-between border-t border-line/60 pt-2.5 text-xs text-ink-soft">
                    <span className="inline-flex items-center gap-1">
                      <PackageCheck className="size-3.5 text-primary" />
                      <strong>{item.quantity} Stel</strong> Seragam
                    </span>
                    <span className="font-medium text-ink-soft">Selesai Dikerjakan</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ─── 3. Ulasan Pelanggan (Tanpa Filter Status) ─── */}
        <section aria-labelledby="testimonial-title" className="space-y-6">
          <div className="border-b border-line pb-4">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary">
              <HeartHandshake className="size-4" /> Ulasan
            </span>
            <h2 id="testimonial-title" className="pt-1 text-2xl font-extrabold text-ink sm:text-3xl">
              Ulasan Pelanggan
            </h2>
            <p className="text-sm text-ink-soft pt-1">
              Pengalaman nyata dari sekolah dan mitra yang telah mempercayakan seragam mereka kepada kami.
            </p>
          </div>

          {testimonials.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {testimonials.map((t) => (
                <article
                  key={t.id}
                  className="flex flex-col justify-between rounded-2xl bg-surface p-6 shadow-card ring-1 ring-line transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className="flex size-11 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
                          {t.user?.name ? t.user.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div>
                          <h3 className="font-bold text-ink">{t.user?.name || 'Pelanggan'}</h3>
                          <p className="text-xs text-ink-soft">
                            {new Date(t.createdAt).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </p>
                        </div>
                      </div>

                      {/* Stars */}
                      <div className="flex items-center gap-1 text-gold" aria-label={`Rating ${t.rating} dari 5 bintang`}>
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`size-4 ${i < t.rating ? 'fill-gold text-gold' : 'text-line'}`}
                            aria-hidden="true"
                          />
                        ))}
                        <span className="ml-1 text-xs font-bold text-ink">{t.rating}.0</span>
                      </div>
                    </div>

                    {/* Story / Comment */}
                    <p className="text-sm leading-relaxed text-ink-soft italic">
                      &ldquo;{t.comment}&rdquo;
                    </p>
                  </div>

                  {/* Order Details Preview if available */}
                  {t.order && (
                    <div className="mt-4 border-t border-line pt-3 text-xs text-ink-soft">
                      <span className="font-semibold text-ink">Pesanan: </span>
                      {t.order.items?.length
                        ? t.order.items
                            .map((it) => it.product?.name || it.accessory?.name || 'Item')
                            .filter(Boolean)
                            .join(', ')
                        : t.order.orderNumber}
                    </div>
                  )}
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-line bg-surface p-8 text-center text-ink-soft">
              <HeartHandshake className="mx-auto size-8 text-muted" />
              <p className="mt-2 font-semibold text-ink">Belum ada ulasan.</p>
              <p className="text-xs text-ink-soft">Ulasan dari pelanggan akan muncul di sini.</p>
            </div>
          )}
        </section>

        {/* ─── 4. Formulir Ulasan ─── */}
        <section aria-labelledby="form-title" className="rounded-2xl bg-surface p-6 shadow-card ring-1 ring-line sm:p-7">
          <div className="border-b border-line pb-3">
            <h2 id="form-title" className="text-lg font-bold text-ink">
              Tulis Ulasan
            </h2>
            <p className="text-xs text-ink-soft mt-0.5">
              Bagikan pengalaman pesanan Anda bersama Vieguard.
            </p>
          </div>

          {state.success ? (
            <div className="mt-6 rounded-2xl bg-[#EAF7EE] p-6 text-center text-[#1E7E34] ring-1 ring-[#C3E6CB]">
              <CheckCircle2 className="mx-auto size-8" />
              <h3 className="mt-2 text-base font-bold">Ulasan Terkirim!</h3>
              <p className="mt-1 text-sm">
                Terima kasih telah berbagi pengalaman Anda bersama Vieguard.
              </p>
            </div>
          ) : !user ? (
            <div className="mt-6 flex flex-col items-center justify-center rounded-2xl bg-beige-soft p-8 text-center">
              <Users className="size-10 text-primary/60" />
              <h3 className="mt-3 font-bold text-ink">Ingin Menulis Ulasan?</h3>
              <p className="mt-1 max-w-md text-xs text-ink-soft">
                Masuk ke akun Anda untuk memberikan ulasan pesanan yang telah selesai.
              </p>
              <ButtonLink href="/login?next=/about" className="mt-4" size="sm">
                Masuk Akun
              </ButtonLink>
            </div>
          ) : reviewableOrders.length === 0 ? (
            <div className="mt-6 rounded-2xl bg-beige-soft p-6 text-center text-ink-soft text-sm">
              <p>
                Halo <strong>{user.name}</strong>, belum ada pesanan selesai yang dapat diulas.
              </p>
              <div className="mt-3 flex justify-center gap-2">
                <ButtonLink href="/catalog" size="sm">
                  Lihat Katalog
                </ButtonLink>
                <ButtonLink href="/orders" variant="outline" size="sm">
                  Riwayat Pesanan
                </ButtonLink>
              </div>
            </div>
          ) : (
            <form action={formAction} className="mt-6 space-y-4">
              <ErrorMessage message={state.error} />

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label htmlFor="orderId" className="block text-xs font-semibold text-ink">
                    Pesanan <span className="text-danger">*</span>
                  </label>
                  <select
                    id="orderId"
                    name="orderId"
                    required
                    className="mt-1 h-10 w-full rounded-lg border border-line bg-canvas px-3 text-sm text-ink focus:border-primary focus:outline-none"
                  >
                    <option value="">Pilih pesanan</option>
                    {reviewableOrders.map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.orderNumber} ({o.orderType.toUpperCase()}) —{' '}
                        {new Date(o.createdAt).toLocaleDateString('id-ID')}
                      </option>
                    ))}
                  </select>
                  {state.fieldErrors?.orderId && (
                    <p className="mt-1 text-xs text-danger">{state.fieldErrors.orderId}</p>
                  )}
                </div>

                <div>
                  <span className="block text-xs font-semibold text-ink">
                    Rating <span className="text-danger">*</span>
                  </span>
                  <input type="hidden" name="rating" value={selectedRating} />
                  <div className="mt-1.5 flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setSelectedRating(star)}
                        className="rounded p-0.5 text-gold transition hover:scale-110"
                        aria-label={`Beri ${star} bintang`}
                      >
                        <Star
                          className={`size-5 ${star <= selectedRating ? 'fill-gold text-gold' : 'text-line'}`}
                        />
                      </button>
                    ))}
                    <span className="ml-1 text-xs font-bold text-ink">{selectedRating}.0 / 5</span>
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="comment" className="block text-xs font-semibold text-ink">
                  Ulasan <span className="text-danger">*</span>
                </label>
                <textarea
                  id="comment"
                  name="comment"
                  rows={3}
                  required
                  placeholder="Ceritakan pengalaman kepuasan pesanan Anda bersama kami..."
                  className="mt-1 w-full rounded-lg border border-line bg-canvas p-3 text-sm text-ink focus:border-primary focus:outline-none"
                />
                {state.fieldErrors?.comment && (
                  <p className="mt-1 text-xs text-danger">{state.fieldErrors.comment}</p>
                )}
              </div>

              <div className="flex justify-end">
                <SubmitButton
                  label="Kirim Ulasan"
                  loadingLabel="Mengirim..."
                  icon={<Send className="size-4" />}
                  fullWidth={false}
                />
              </div>
            </form>
          )}
        </section>
      </div>
    </PageContainer>
  );
}
