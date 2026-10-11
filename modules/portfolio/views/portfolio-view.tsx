"use client";

import React, { useMemo, useState } from 'react';
import { BadgeCheck, ChevronLeft, ChevronRight, ClipboardList, MessageSquare, PencilRuler, Search } from 'lucide-react';
import { PageContainer, PageHeader } from '@/components/layout/page-header';
import { ButtonLink } from '@/components/ui/button';
import { CtaBanner } from '@/components/ui/cta-banner';
import { EmptyState } from '@/components/ui/empty-state';
import { PortfolioCard } from '../components/portfolio-card';
import { PORTFOLIO_CATEGORIES, PORTFOLIO_PROJECTS, PORTFOLIO_STATS, PortfolioCategory } from '../data';

const PAGE_SIZE = 6;

type SortKey = 'newest' | 'oldest' | 'quantity';

export function PortfolioView() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<PortfolioCategory | 'all'>('all');
  const [sort, setSort] = useState<SortKey>('newest');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = PORTFOLIO_PROJECTS.filter(
      (p) =>
        (category === 'all' || p.category === category) &&
        (!q || [p.title, p.institution, ...p.materials].some((t) => t.toLowerCase().includes(q)))
    );
    return [...list].sort((a, b) =>
      sort === 'quantity' ? b.quantity - a.quantity : sort === 'oldest' ? a.year - b.year : b.year - a.year
    );
  }, [query, category, sort]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const visible = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const from = filtered.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const to = Math.min(currentPage * PAGE_SIZE, filtered.length);

  const countFor = (value: PortfolioCategory | 'all') =>
    value === 'all' ? PORTFOLIO_PROJECTS.length : PORTFOLIO_PROJECTS.filter((p) => p.category === value).length;

  const selectCategory = (value: PortfolioCategory | 'all') => {
    setCategory(value);
    setPage(1);
  };

  return (
    <PageContainer>
      <PageHeader
        crumbs={[{ label: 'Portofolio Galeri' }]}
        eyebrow="Karya & Rekam Jejak Produksi"
        title="Galeri Portofolio & Hasil Produksi Seragam Drum Band"
        description="Dokumentasi karya jahit nyata seragam korps drumband, marching band sekolah, dan almamater di seluruh Indonesia dengan jaminan presisi jahitan garmen kelas profesional."
        aside={
          <div className="flex items-center gap-4 rounded-2xl bg-surface px-4 py-3.5 shadow-card ring-1 ring-line">
            <span className="flex size-11 items-center justify-center rounded-lg bg-beige-soft text-primary">
              <BadgeCheck className="size-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-lg font-extrabold text-primary">{PORTFOLIO_STATS.projects}</p>
              <p className="text-xs font-medium text-ink-soft">{PORTFOLIO_STATS.since}</p>
            </div>
          </div>
        }
      />

      {/* Filters */}
      <section className="rounded-2xl bg-surface p-6 shadow-card ring-1 ring-line" aria-label="Filter portofolio">
        <div className="flex flex-col gap-2 md:flex-row">
          <label className="relative flex-1">
            <span className="sr-only">Cari proyek</span>
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Cari proyek, nama institusi, atau tipe seragam..."
              className="h-11 w-full rounded-lg bg-beige-soft pl-11 pr-4 text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </label>
          <label className="md:w-56">
            <span className="sr-only">Urutkan</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="h-11 w-full cursor-pointer rounded-lg bg-beige-soft px-4 text-sm font-semibold text-ink focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="newest">Urutkan: Terbaru</option>
              <option value="oldest">Urutkan: Terlama</option>
              <option value="quantity">Urutkan: Jumlah Terbanyak</option>
            </select>
          </label>
        </div>
        <div className="flex flex-wrap gap-2 pt-4" role="group" aria-label="Kategori">
          {[{ value: 'all' as const, label: 'Semua Kategori' }, ...PORTFOLIO_CATEGORIES].map((c) => {
            const active = c.value === category;
            return (
              <button
                key={c.value}
                type="button"
                aria-pressed={active}
                onClick={() => selectCategory(c.value)}
                className={`rounded-full px-4 py-2 text-[13px] font-semibold transition-colors ${
                  active ? 'bg-primary text-on-primary shadow-button' : 'bg-beige-soft text-ink-soft hover:bg-beige hover:text-primary'
                }`}
              >
                {c.label}
                {c.value === 'all' && ` (${countFor('all')})`}
              </button>
            );
          })}
        </div>
      </section>

      {/* Grid */}
      {visible.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 pt-12 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((project) => (
            <PortfolioCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="Proyek tidak ditemukan"
          description="Coba kata kunci lain atau pilih kategori berbeda."
          icon={<Search className="size-7" aria-hidden="true" />}
        />
      )}

      {/* Pagination */}
      <div className="flex flex-col items-center justify-between gap-4 py-12 sm:flex-row">
        <p className="text-sm text-ink-soft">
          Menampilkan <b className="text-ink">{from}</b> - <b className="text-ink">{to}</b> dari <b className="text-ink">{filtered.length}</b> hasil proyek portofolio
        </p>
        <nav className="flex items-center gap-2" aria-label="Halaman">
          <PageButton label="Halaman sebelumnya" disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}>
            <ChevronLeft className="size-4" />
          </PageButton>
          {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
            <PageButton key={n} label={`Halaman ${n}`} active={n === currentPage} onClick={() => setPage(n)}>
              {n}
            </PageButton>
          ))}
          <PageButton label="Halaman berikutnya" disabled={currentPage === pageCount} onClick={() => setPage(currentPage + 1)}>
            <ChevronRight className="size-4" />
          </PageButton>
        </nav>
      </div>

      <CtaBanner
        eyebrow="Layanan Desain Kustom Spesialis"
        eyebrowIcon={<PencilRuler className="size-4" aria-hidden="true" />}
        title="Ingin Mewujudkan Desain Seragam Impian Sekolah Anda?"
        description="Konsultasikan rancangan bersama tim desainer dan penjahit ahli kami. Dapatkan gratis draf visual 3D & rincian estimasi biaya produksi transparan tanpa komitmen awal."
        actions={
          <>
            <ButtonLink href="/chat?topic=Konsultasi%20desain%20seragam" variant="gold" size="lg" className="!h-[52px] px-8">
              <MessageSquare className="size-4" aria-hidden="true" /> Konsultasi Gratis via Chat
            </ButtonLink>
            <ButtonLink href="/order" variant="outline" size="lg" className="!h-[52px] border-0 px-8">
              <ClipboardList className="size-4" aria-hidden="true" /> Pesan Paket Seragam
            </ButtonLink>
          </>
        }
      />
    </PageContainer>
  );
}

function PageButton({
  children,
  label,
  active = false,
  disabled = false,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-current={active ? 'page' : undefined}
      disabled={disabled}
      onClick={onClick}
      className={`flex size-10 items-center justify-center rounded-lg text-sm font-semibold transition-colors disabled:opacity-40 ${
        active ? 'bg-primary text-on-primary shadow-button' : 'bg-surface text-ink-soft shadow-soft hover:text-primary'
      }`}
    >
      {children}
    </button>
  );
}
