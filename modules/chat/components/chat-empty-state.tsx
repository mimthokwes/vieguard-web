import { Headset } from 'lucide-react';

export function ChatEmptyState() {
  return (
    <div className="flex h-full flex-col items-center justify-center text-center">
      <span className="flex size-14 items-center justify-center rounded-full bg-beige-soft text-primary">
        <Headset className="size-6" aria-hidden="true" />
      </span>
      <p className="pt-3 font-semibold text-ink">Belum ada pesan</p>
      <p className="max-w-sm pt-1 text-sm text-ink-soft">
        Tulis pertanyaan Anda tentang ukuran, desain, sewa, atau status pesanan. Admin akan membalas di sini.
      </p>
    </div>
  );
}