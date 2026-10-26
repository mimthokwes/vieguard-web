import { CheckCheck } from 'lucide-react';
import { ChatMessage } from '@/types/chat';
import { initials } from '@/lib/format';

export function timeOf(iso: string) {
  return new Date(iso).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
}

interface ChatMessageItemProps {
  message: ChatMessage;
  userName: string;
  adminName: string;
}

export function ChatMessageItem({ message: m, userName, adminName }: ChatMessageItemProps) {
  const mine = m.senderType === 'user';

  return (
    <li className={`flex gap-2.5 ${mine ? 'flex-row-reverse' : ''}`}>
      <span
        className={`flex size-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
          mine ? 'bg-primary-dark text-on-primary' : 'bg-primary text-gold-light'
        }`}
      >
        {mine ? initials(userName) : 'VG'}
      </span>
      <div className={`flex max-w-[80%] flex-col sm:max-w-[70%] ${mine ? 'items-end' : 'items-start'}`}>
        <p className="pb-1 text-xs text-ink-soft">
          <b className={mine ? 'text-primary' : 'text-ink'}>{mine ? 'Anda' : adminName}</b> · {timeOf(m.createdAt)} WIB
        </p>
        <div
          className={`whitespace-pre-wrap break-words rounded-2xl px-4 py-3 text-[15px] leading-6 shadow-soft ${
            mine ? 'rounded-tr-sm bg-primary text-on-primary' : 'rounded-tl-sm bg-surface text-ink ring-1 ring-line'
          }`}
        >
          {m.messageText}
          {m.imageAttachment && <span className="block pt-1 text-xs opacity-80">[Lampiran gambar]</span>}
        </div>
        {mine && m.isRead && (
          <p className="flex items-center gap-1 pt-1 text-xs text-ink-soft">
            <CheckCheck className="size-3.5 text-primary" aria-hidden="true" /> Dibaca admin
          </p>
        )}
      </div>
    </li>
  );
}