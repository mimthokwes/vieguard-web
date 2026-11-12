import { WifiOff } from 'lucide-react';

interface ChatHeaderProps {
  adminName: string;
  online: boolean;
  topic?: string;
  operationalHours: string;
}

export function ChatHeader({ adminName, online, topic, operationalHours }: ChatHeaderProps) {
  return (
    <div className="sticky top-14 sm:top-16 md:top-24 z-20 w-full shrink-0 border-b border-line bg-surface px-4 py-2.5 sm:px-6 shadow-xs">
      {/* Penutup solid area di atas header agar pesan yang di-scroll tidak tembus/terlihat di atas header */}
      <div className="pointer-events-none absolute bottom-full left-0 right-0 h-64 bg-surface" aria-hidden="true" />

      <div className="mx-auto flex max-w-5xl items-center gap-3">
        <span className="relative flex size-8 shrink-0 items-center justify-center rounded-xl bg-primary font-display text-sm font-bold text-gold-light">
          VG
          <span
            className={`absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-surface ${online ? 'bg-success' : 'bg-muted'}`}
          />
        </span>
        <div className="min-w-0">
          <p className="truncate text-base font-bold text-ink">{adminName}</p>
          {online ? (
            <p className="truncate text-xs text-ink-soft">Membalas pada jam operasional: {operationalHours}</p>
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
    </div>
  );
}
