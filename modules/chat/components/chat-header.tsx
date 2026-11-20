import { WifiOff, Bot, User } from 'lucide-react';

interface ChatHeaderProps {
  adminName: string;
  online: boolean;
  topic?: string;
  operationalHours: string;
  isBotActive?: boolean;
  togglingBot?: boolean;
  onToggleBot?: (active: boolean) => void;
}

export function ChatHeader({
  adminName,
  online,
  topic,
  operationalHours,
  isBotActive = true,
  togglingBot = false,
  onToggleBot,
}: ChatHeaderProps) {
  return (
    <div className="sticky top-14 sm:top-16 md:top-24 z-20 w-full shrink-0 border-b border-line bg-surface px-4 py-2.5 sm:px-6 shadow-xs">
      {/* Penutup solid area di atas header agar pesan yang di-scroll tidak tembus/terlihat di atas header */}
      <div className="pointer-events-none absolute bottom-full left-0 right-0 h-64 bg-surface" aria-hidden="true" />

      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
        {/* Sisi Kiri: Profil CS / Toko dan Status */}
        <div className="flex items-center gap-3 min-w-0">
          <span className="relative flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary font-display text-sm font-bold text-gold-light shadow-xs">
            VG
            <span
              className={`absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-surface ${
                online ? 'bg-success' : 'bg-muted'
              }`}
            />
          </span>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="truncate text-base font-bold text-ink">{adminName}</p>
              {isBotActive ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                  <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  AI Aktif
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700 ring-1 ring-inset ring-amber-600/20">
                  <span className="size-1.5 rounded-full bg-amber-500" />
                  Admin Langsung
                </span>
              )}
            </div>
            {online ? (
              <p className="truncate text-xs text-ink-soft">
                {isBotActive
                  ? 'Dibalas instan oleh asisten otomatis'
                  : `Membalas pada jam operasional: ${operationalHours}`}
              </p>
            ) : (
              <p className="flex items-center gap-1 text-xs font-semibold text-danger">
                <WifiOff className="size-3" aria-hidden="true" /> Server tidak terhubung
              </p>
            )}
            {topic && (
              <span className="mt-1 inline-flex items-center rounded-md bg-warning-bg px-2 py-0.5 text-xs font-semibold text-gold-dark">
                Terkait: {topic}
              </span>
            )}
          </div>
        </div>

        {/* Sisi Kanan: Toggle Sakelar AI / Admin VieGuard */}
        {onToggleBot && (
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="hidden sm:flex flex-col items-end text-right">
              <span className="text-xs font-bold leading-tight text-ink">
                {isBotActive ? 'Asisten AI' : 'Admin Manusia'}
              </span>
              <span className="text-[10px] leading-tight text-ink-soft">
                {isBotActive ? 'Balas instan' : 'Dijawab admin'}
              </span>
            </div>

            {/* Tombol Toggle: Jalur Emas VieGuard dan Bulatan Merah */}
            <button
              type="button"
              role="switch"
              aria-checked={isBotActive}
              aria-label={isBotActive ? 'Nonaktifkan Asisten AI (Alihkan ke Admin)' : 'Aktifkan Asisten AI'}
              onClick={() => onToggleBot(!isBotActive)}
              disabled={togglingBot}
              title={
                isBotActive
                  ? 'AI Aktif. Klik untuk alihkan ke Admin manusia'
                  : 'Admin Langsung Aktif. Klik untuk aktifkan balasan instan AI'
              }
              className={`relative inline-flex h-8 w-15 shrink-0 cursor-pointer items-center rounded-full p-1 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                isBotActive
                  ? 'bg-gold-gradient border border-gold-dark/60 shadow-xs'
                  : 'bg-stone-200 border border-line-strong hover:bg-stone-300'
              }`}
            >
              {/* Bulatan Merah Bergerak dengan Ikon di Tengah */}
              <span
                className={`relative flex size-6 items-center justify-center rounded-full bg-primary text-white shadow-md transition-transform duration-300 ease-in-out ${
                  isBotActive ? 'translate-x-7 bg-primary' : 'translate-x-0 bg-primary-dark'
                }`}
              >
                {isBotActive ? (
                  <Bot className="size-3.5 text-gold-light transition-transform duration-200" aria-hidden="true" />
                ) : (
                  <User className="size-3.5 text-white transition-transform duration-200" aria-hidden="true" />
                )}
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
