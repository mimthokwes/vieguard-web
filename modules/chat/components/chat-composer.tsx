"use client";

import { useRef, useState } from 'react';
import { Loader2, Send } from 'lucide-react';
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
      className="w-full border-t border-line bg-surface px-4 py-3 sm:px-6 shrink-0"
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
    >
      <div className="mx-auto max-w-5xl">
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
            disabled={!text.trim() || sending || disabled}
            className="flex h-11 shrink-0 items-center justify-center gap-1.5 rounded-xl bg-primary px-4 text-sm font-semibold text-white shadow-soft transition-opacity hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {sending ? (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : (
              <Send className="size-4" aria-hidden="true" />
            )}
            <span className="hidden sm:inline">Kirim</span>
          </button>
        </div>
      </div>
    </form>
  );
}
