"use client";

import React, { useEffect, useRef } from 'react';
import { ChatMessage } from '@/types/chat';
import { formatDate } from '@/lib/format';
import { ChatEmptyState } from './chat-empty-state';
import { ChatMessageItem } from './chat-message-item';

interface ChatMessageListProps {
  messages: ChatMessage[];
  userName: string;
  adminName: string;
}

export function ChatMessageList({ messages, userName, adminName }: ChatMessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const isInitialMount = useRef(true);

  const scrollToBottom = (instant = false) => {
    const el = scrollRef.current;
    if (!el) return;

    if (instant) {
      el.scrollTop = el.scrollHeight;
    } else {
      el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    }
    bottomRef.current?.scrollIntoView({
      behavior: instant ? 'auto' : 'smooth',
      block: 'end',
    });
  };

  // Scroll to bottom immediately on mount and after layout paints
  useEffect(() => {
    scrollToBottom(true);

    const raf = requestAnimationFrame(() => {
      scrollToBottom(true);
    });

    const t1 = setTimeout(() => {
      scrollToBottom(true);
    }, 100);

    const t2 = setTimeout(() => {
      scrollToBottom(true);
    }, 300);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  // When messages update (new message sent/received, or re-synced)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    scrollToBottom(false);
  }, [messages.length, messages]);

  // Keep scrolled to bottom if container content resizes (e.g. images or markdown render)
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;

    const observer = new ResizeObserver(() => {
      const isNearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 150;
      if (isInitialMount.current || isNearBottom) {
        scrollToBottom(isInitialMount.current);
      }
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={scrollRef}
      className="flex-1 overflow-y-auto bg-canvas/40 px-4 py-6 sm:px-6"
      aria-live="polite"
    >
      {messages.length === 0 ? (
        <ChatEmptyState />
      ) : (
        <ol className="mx-auto flex max-w-5xl flex-col gap-4">
          {messages.map((m, i) => {
            const prev = messages[i - 1];
            const newDay =
              !prev ||
              new Date(prev.createdAt).toDateString() !== new Date(m.createdAt).toDateString();
            return (
              <React.Fragment key={m.id}>
                {newDay && (
                  <li className="flex justify-center">
                    <span className="rounded-full bg-beige-soft px-3 py-1 text-xs text-ink-soft">
                      {formatDate(m.createdAt, {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                  </li>
                )}
                <ChatMessageItem message={m} userName={userName} adminName={adminName} />
              </React.Fragment>
            );
          })}
          <div ref={bottomRef} className="h-px w-full" aria-hidden="true" />
        </ol>
      )}
    </div>
  );
}
