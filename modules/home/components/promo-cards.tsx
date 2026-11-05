import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

type Props = { isLoggedIn?: boolean };

export function PromoCards({ isLoggedIn = false }: Props) {
  return (
    <section aria-label="Alur Pemesanan Seragam" className="grid grid-cols-1 gap-4 md:grid-cols-3">
      
      {/* KOTAK 1: PILIHAN MODEL & DESAIN */}
      <article className="group relative flex flex-col justify-between rounded-2xl border border-line bg-surface p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-gold hover:shadow-card">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex size-11 items-center justify-center rounded-xl bg-beige-soft border border-line text-primary font-extrabold text-base font-mono group-hover:bg-primary group-hover:text-white transition-colors duration-200">
              01
            </div>
            <span className="text-xs font-bold text-gold-dark bg-beige-soft px-2.5 py-1 rounded-full border border-line-strong/60">
              Pilihan Model
            </span>
          </div>

          <h3 className="text-lg font-bold text-ink group-hover:text-primary transition-colors mb-2">
            Pilih atau Ajukan Desain
          </h3>
          <p className="text-xs text-ink-soft leading-relaxed mb-4">
            Pilih model seragam favorit Anda di katalog atau wujudkan desain impian sekolah bersama kami!
          </p>
        </div>

        <Link
          href="/catalog"
          className="pt-4 border-t border-line flex items-center justify-between group-hover:underline"
        >
          <span className="text-xs font-bold text-primary">
            Eksplorasi Desain
          </span>
          <ArrowRight className="size-4 text-primary transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
        </Link>
      </article>

      {/* KOTAK 2: PENDATAAN UKURAN & BAHAN */}
      <article className="group relative flex flex-col justify-between rounded-2xl border border-line bg-surface p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-gold hover:shadow-card">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex size-11 items-center justify-center rounded-xl bg-beige-soft border border-line text-primary font-extrabold text-base font-mono group-hover:bg-primary group-hover:text-white transition-colors duration-200">
              02
            </div>
            <span className="text-xs font-bold text-gold-dark bg-beige-soft px-2.5 py-1 rounded-full border border-line-strong/60">
              Data & Bahan
            </span>
          </div>

          <h3 className="text-lg font-bold text-ink group-hover:text-primary transition-colors mb-2">
            Pendataan Ukuran & Bahan
          </h3>
          <p className="text-xs text-ink-soft leading-relaxed mb-4">
            Kirimkan ukuran tim Anda dengan praktis, kami bantu siapkan bahan terbaik yang nyaman dipakai!
          </p>
        </div>

        <Link
          href={isLoggedIn ? '/order' : '/login'}
          className="pt-4 border-t border-line flex items-center justify-between group-hover:underline"
        >
          <span className="text-xs font-bold text-primary">
            Mulai Isi Ukuran
          </span>
          <ArrowRight className="size-4 text-primary transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
        </Link>
      </article>

      {/* KOTAK 3: PRODUKSI PRESISI & HASIL PARADE */}
      <article className="group relative flex flex-col justify-between rounded-2xl border border-ink bg-ink text-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-gold hover:shadow-card">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex size-11 items-center justify-center rounded-xl bg-gold text-on-gold font-extrabold text-base font-mono">
              03
            </div>
            <span className="text-xs font-black text-on-gold bg-gold px-3 py-1 rounded-full shadow-xs">
              Siap Parade
            </span>
          </div>

          <h3 className="text-lg font-bold text-white group-hover:text-gold-light transition-colors mb-2">
            Produksi Presisi & Kirim
          </h3>
          <p className="text-xs text-white/80 leading-relaxed mb-4">
            Serahkan pada kami! Seragam diproduksi rapi presisi dan siap dikirim langsung ke sekolah Anda.
          </p>
        </div>

        <Link
          href="/custom"
          className="pt-4 border-t border-white/15 flex items-center justify-between group-hover:underline"
        >
          <span className="text-xs font-bold text-gold-light">
            Mulai Sekarang
          </span>
          <ArrowRight className="size-4 text-gold-light transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
        </Link>
      </article>

    </section>
  );
}