import { ClipboardList } from 'lucide-react';
import { CHAT_TOPICS } from '../constants/chat-topics';

interface OrderRef {
  id: string;
  orderNumber: string;
  label: string;
}

interface ChatQuickActionsProps {
  orderRefs: OrderRef[];
  onPick: (template: string) => void;
}

/** Baris tombol kecil di atas kolom input: template topik + referensi pesanan. */
export function ChatQuickActions({ orderRefs, onPick }: ChatQuickActionsProps) {
  const chip =
    'flex shrink-0 items-center gap-1.5 rounded-full bg-beige-soft px-3 py-1.5 text-xs font-semibold text-ink-soft transition-colors hover:bg-canvas hover:text-primary';

  return (
    <div className="mb-2 flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Template pesan cepat">
      {CHAT_TOPICS.map(({ key, label, icon: Icon, template }) => (
        <button key={key} type="button" onClick={() => onPick(template)} className={chip}>
          <Icon className="size-3.5" aria-hidden="true" /> {label}
        </button>
      ))}
      {orderRefs.slice(0, 5).map((o) => (
        <button key={o.id} type="button" onClick={() => onPick(`[Pesanan ${o.orderNumber}] `)} className={chip} title={o.label}>
          <ClipboardList className="size-3.5 text-primary" aria-hidden="true" />
          <b className="text-primary">{o.orderNumber}</b>
        </button>
      ))}
    </div>
  );
}