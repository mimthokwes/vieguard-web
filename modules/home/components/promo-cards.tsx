import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { StaggerContainer, StaggerItem } from '@/components/ui/motion';

type Props = { isLoggedIn?: boolean };

export function PromoCards({ isLoggedIn = false }: Props) {
  return (
    <section aria-label="Alur Pemesanan Seragam">
      <StaggerContainer className="grid grid-cols-1 gap-4 md:grid-cols-3" staggerDelay={0.1}>
        {/* KOTAK 1: PILIHAN MODEL & DESAIN */}
        <StaggerItem>
          <article className="group relative flex flex-col justify-between rounded-2xl border border-line bg-surface p-5 shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:border-primary hover:shadow-card h-full">
            <div>
              <div className="flex items-baseline justify-between mb-2">
                <span className="font-mono text-2xl font-black tracking-tight text-primary">
                  01
                </span>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-gold-dark">
                  Pilihan Model
                </span>
              </div>

              <h3 className="text-base font-bold text-ink group-hover:text-primary transition-colors mb-1.5">
                Pilih atau Ajukan Desain
              </h3>
              <p className="text-xs text-ink-soft leading-relaxed">
                Pilih model seragam favorit Anda di katalog atau wujudkan desain impian sekolah bersama kami!
              </p>
            </div>

            <Link
              href="/catalog"
              className="mt-4 flex items-center justify-between text-xs font-bold text-primary group-hover:underline"
            >
              <span>Eksplorasi Desain</span>
              <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          </article>
        </StaggerItem>

        {/* KOTAK 2: PENDATAAN UKURAN & BAHAN */}
        <StaggerItem>
          <article className="group relative flex flex-col justify-between rounded-2xl border border-line bg-surface p-5 shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:border-primary hover:shadow-card h-full">
            <div>
              <div className="flex items-baseline justify-between mb-2">
                <span className="font-mono text-2xl font-black tracking-tight text-primary">
                  02
                </span>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-gold-dark">
                  Data & Bahan
                </span>
              </div>

              <h3 className="text-base font-bold text-ink group-hover:text-primary transition-colors mb-1.5">
                Pendataan Ukuran & Bahan
              </h3>
              <p className="text-xs text-ink-soft leading-relaxed">
                Kirimkan ukuran tim Anda dengan praktis, kami bantu siapkan bahan terbaik yang nyaman dipakai!
              </p>
            </div>

            <Link
              href={isLoggedIn ? '/order' : '/login'}
              className="mt-4 flex items-center justify-between text-xs font-bold text-primary group-hover:underline"
            >
              <span>Mulai Isi Ukuran</span>
              <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          </article>
        </StaggerItem>

        {/* KOTAK 3: PRODUKSI PRESISI & HASIL PARADE */}
        <StaggerItem>
          <article className="group relative flex flex-col justify-between rounded-2xl border border-ink bg-ink text-white p-5 shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:border-primary hover:shadow-card h-full">
            <div>
              <div className="flex items-baseline justify-between mb-2">
                <span className="font-mono text-2xl font-black tracking-tight text-gold">
                  03
                </span>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-gold-light">
                  Siap Parade
                </span>
              </div>

              <h3 className="text-base font-bold text-white group-hover:text-gold-light transition-colors mb-1.5">
                Produksi Presisi & Kirim
              </h3>
              <p className="text-xs text-white/80 leading-relaxed">
                Serahkan pada kami! Seragam diproduksi rapi presisi dan siap dikirim langsung ke sekolah Anda.
              </p>
            </div>

            <Link
              href="/custom"
              className="mt-4 flex items-center justify-between text-xs font-bold text-gold-light group-hover:underline"
            >
              <span>Mulai Sekarang</span>
              <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          </article>
        </StaggerItem>
      </StaggerContainer>
    </section>
  );
}
