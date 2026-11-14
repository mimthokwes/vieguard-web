import { WifiOff, Headphones, Bot } from 'lucide-react';

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
        <div className="flex items-center gap-3 min-w-0">
          <span className="relative flex size-8 shrink-0 items-center justify-center rounded-xl bg-primary font-display text-sm font-bold text-gold-light">
            VG
            <span
              className={`absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-surface ${online ? 'bg-success' : 'bg-muted'}`}
            />
          </span>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="truncate text-base font-bold text-ink">{adminName}</p>
              {isBotActive ? (
                <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                  AI Aktif
                </span>
              ) : (
                <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700 ring-1 ring-inset ring-amber-600/20">
                  Admin Langsung
                </span>
              )}
            </div>
            {online ? (
              <p className="truncate text-xs text-ink-soft">
                {isBotActive ? 'Dibalas instan oleh asisten otomatis' : `Membalas pada jam operasional: ${operationalHours}`}
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

        {onToggleBot && (
          <div className="shrink-0">
            {isBotActive ? (
              <button
                type="button"
                onClick={() => onToggleBot(false)}
                disabled={togglingBot}
                title="Alihkan percakapan langsung ke Admin manusia"
                className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-surface px-3 py-1.5 text-xs font-medium text-ink shadow-2xs transition-colors hover:border-primary hover:bg-beige-soft hover:text-primary disabled:opacity-50"
              >
                <Headphones className="size-3.5 text-primary" aria-hidden="true" />
                <span className="hidden sm:inline">Bicara dengan</span>
                <span>Admin</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onToggleBot(true)}
                disabled={togglingBot}
                title="Aktifkan kembali balasan instan AI"
                className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-surface px-3 py-1.5 text-xs font-medium text-ink-soft shadow-2xs transition-colors hover:border-primary hover:bg-beige-soft hover:text-primary disabled:opacity-50"
              >
                <Bot className="size-3.5 text-primary" aria-hidden="true" />
                <span className="hidden sm:inline">Aktifkan</span>
                <span>AI</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
