"use client";

import { useRef, useState } from 'react';
import { Loader2, Send, Store } from 'lucide-react';
import { ErrorMessage } from '@/components/ui/error-message';
import { ChatQuickActions } from './chat-quick-actions';

interface ChatComposerProps {
  initialText?: string;
  error: string;
  sending: boolean;
  disabled?: boolean;
  orderRefs: { id: string; orderNumber: string; label: string }[];
  onSend: (value: string) => Promise<boolean>;
}

export function ChatComposer({ initialText = '', error, sending, disabled, orderRefs, onSend }: ChatComposerProps) {
  const [text, setText] = useState(initialText);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const submit = async () => {
    if (!text.trim() || sending) return;
    const ok = await onSend(text);
    if (ok) setText('');
  };

  const applyTemplate = (template: string) => {
    setText(template);
    inputRef.current?.focus();
  };

  return (
    <form
      className="border-t border-line bg-surface px-4 py-3"
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
    >
      <ErrorMessage message={error} className="mb-2" />
      <ChatQuickActions orderRefs={orderRefs} onPick={applyTemplate} />

      <div className="flex items-end gap-2">
        <label className="flex-1">
          <span className="sr-only">Tulis pesan</span>
          <textarea
            ref={inputRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                submit();
              }
            }}
            rows={1}
            maxLength={2000}
            placeholder="Ketik pesan konsultasi Anda di sini..."
            className="max-h-32 min-h-11 w-full resize-none rounded-xl bg-beige-soft px-4 py-3 text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </label>
        <button
          type="submit"
          disabled={sending || !text.trim() || disabled}
          className="flex h-11 items-center gap-2 rounded-xl bg-primary px-5 mb-2 text-sm font-bold text-on-primary shadow-button transition-colors hover:bg-primary-light disabled:opacity-50"
        >
          {sending ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <Send className="size-4" aria-hidden="true" />} Kirim
        </button>
      </div>
    </form>
  );
}