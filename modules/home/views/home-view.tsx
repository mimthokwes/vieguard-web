import React from 'react';
import { ArrowRight, CalendarClock, ClipboardList, Images, Ruler, ShieldCheck, Store, Truck, Warehouse } from 'lucide-react';
import { Card, Eyebrow, SectionHeader } from '@/components/ui/card';
import { ButtonLink, ButtonVariant } from '@/components/ui/button';
import { PortfolioCardCompact } from '@/modules/portfolio/components/portfolio-card';
import { PORTFOLIO_PROJECTS } from '@/modules/portfolio/data';

const PREVIEW_PROJECTS = PORTFOLIO_PROJECTS.slice(0, 4);

const HERO_FEATURES = [
  { icon: Ruler, label: 'Panduan Ukuran Presisi' },
  { icon: Truck, label: 'Logistik Institusi Massal' },
  { icon: CalendarClock, label: 'Penjadwalan Armada Sewa' },
];

const QUICK_ACCESS: {
  eyebrow: string;
  icon: React.ElementType;
  title: string;
  description: string;
  cta: string;
  href: string;
  variant: ButtonVariant;
}[] = [
  {
    eyebrow: 'SEC 01 // Akses',
    icon: ClipboardList,
    title: 'Pesan Seragam / Masuk',
    description: 'Akses formulir penjahitan kustom, sistem pemesanan massal sekolah, atau masuk untuk melacak pesanan aktif.',
    cta: 'Masuk / Daftar Akun',
    href: '/login',
    variant: 'primary',
  },
  {
    eyebrow: 'SEC 02 // Arsip',
    icon: Images,
    title: 'Portofolio Kami',
    description: 'Jelajahi dokumentasi proyek seragam drumband yang telah selesai, jas wisuda, dan bordir lambang khusus.',
    cta: 'Lihat Galeri Portofolio',
    href: '/portfolio',
    variant: 'dark',
  },
  {
    eyebrow: 'SEC 03 // Stok',
    icon: Store,
    title: 'Katalog Publik & Sewa',
    description: 'Telusuri set seragam siap pakai, bendera color guard, topi shako, sepatu parade, dan tarif sewa alat.',
    cta: 'Telusuri Katalog & Sewa',
    href: '/catalog',
    variant: 'gold',
  },
];

const PROCESS_STEPS = [
  {
    title: '01. Pengukuran',
    body: 'Konsultasi pengukuran ukuran tubuh langsung di sekolah atau unggah lembar format ukuran digital.',
  },
  {
    title: '02. Pemilihan Bahan',
    body: 'Bahan drill standar, semi-wool, tropical fabric berkualitas, dan ornamen logam kuningan awet.',
  },
  {
    title: '03. Jadwal Produksi',
    body: 'Pengerjaan standar 14-21 hari kerja dengan pemantauan tahapan kendali mutu berkala.',
  },
  {
    title: '04. Sanitasi Armada Sewa',
    body: 'Pencucian uap industri dan inspeksi higienis menyeluruh pasca-acara bergaransi.',
  },
];

export function HomeView({ isLoggedIn = false }: { isLoggedIn?: boolean }) {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8 lg:gap-8 lg:px-8">
      {/* Hero */}
      <Card as="section" className="flex flex-col items-center gap-3 text-center !py-10 sm:!py-12">
        <span className="inline-flex items-center gap-2 rounded-full border border-beige bg-beige-soft px-4 py-1 text-xs font-bold text-primary">
          <Warehouse className="size-3.5" aria-hidden="true" />
          BENGKEL PENJAHITAN PUSAT & GUDANG LOGISTIK
        </span>
        <h1 className="pt-2 text-2xl font-extrabold tracking-tight text-ink sm:text-3xl lg:text-[32px] lg:leading-[1.3]">
          <span className="font-display text-primary">VIEGUARD</span> — Penjahitan Seragam Drum Band & Penyewaan Perlengkapan
        </h1>
        <p className="max-w-3xl text-base text-ink-soft sm:text-lg">
          Penjahitan seragam profesional untuk tingkat TK, SD, SMP, SMA, Marching Band, dan penyewaan alat acara
        </p>
        <p className="max-w-2xl text-sm text-muted">
          Konsultasi desain khusus, pesanan massal sekolah, dan perlengkapan drum band premium
        </p>
        <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 pt-2">
          {HERO_FEATURES.map(({ icon: Icon, label }) => (
            <li key={label} className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted">
              <Icon className="size-3.5 text-gold-dark" aria-hidden="true" />
              {label}
            </li>
          ))}
        </ul>
      </Card>

      {/* Quick access modules */}
      <section className="grid grid-cols-1 gap-5 md:grid-cols-3" aria-label="Modul akses cepat">
        {QUICK_ACCESS.map(({ eyebrow, icon: Icon, title, description, cta, href, variant }) => (
          <Card key={title} className="flex flex-col justify-between !p-6">
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <Eyebrow>{eyebrow}</Eyebrow>
                <Icon className="size-5 text-primary" aria-hidden="true" />
              </div>
              <div className="h-px bg-line-strong" />
              <h2 className="text-lg font-bold text-ink">{title}</h2>
              <p className="text-sm leading-[21px] text-ink-soft">{description}</p>
            </div>
            <ButtonLink
              href={href === '/login' && isLoggedIn ? '/order' : href}
              variant={variant}
              fullWidth
              className="mt-7 !justify-between"
            >
              {href === '/login' && isLoggedIn ? 'Mulai Pesan Seragam' : cta}
              <ArrowRight className="size-4" aria-hidden="true" />
            </ButtonLink>
          </Card>
        ))}
      </section>

      {/* Portfolio preview */}
      <Card as="section" className="flex flex-col gap-5">
        <SectionHeader
          title="Portofolio Kami — Galeri Hasil Pekerjaan"
          description="Dokumentasi hasil pekerjaan untuk klien institusi"
          aside={`Menampilkan: ${PREVIEW_PROJECTS.length} dari ${PORTFOLIO_PROJECTS.length} proyek`}
        />
        <div className="grid grid-cols-1 gap-5 pt-2 sm:grid-cols-2 lg:grid-cols-4">
          {PREVIEW_PROJECTS.map((project) => (
            <PortfolioCardCompact key={project.id} project={project} />
          ))}
        </div>
        <div className="flex flex-col gap-4 border-t border-line-strong pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-wide text-muted">
            <ShieldCheck className="size-4 text-gold-dark" aria-hidden="true" />
            Semua pesanan dibuat sesuai standar mutu institusi
          </p>
          <ButtonLink href="/portfolio">
            Lihat Semua Proyek di Portofolio Lengkap
            <ArrowRight className="size-4" aria-hidden="true" />
          </ButtonLink>
        </div>
      </Card>

      {/* Process strip */}
      <Card as="section" className="!p-7" aria-label="Alur pengerjaan">
        <ol className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PROCESS_STEPS.map((step) => (
            <li key={step.title} className="flex flex-col gap-1">
              <h3 className="text-xs font-bold uppercase tracking-wide text-primary">{step.title}</h3>
              <p className="text-xs leading-4 text-ink-soft">{step.body}</p>
            </li>
          ))}
        </ol>
      </Card>
    </main>
  );
}