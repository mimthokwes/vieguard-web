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
  const bottomRef = useRef<HTMLDivElement>(null);
  const isInitialMount = useRef(true);

  const scrollToBottom = (instant = false) => {
    bottomRef.current?.scrollIntoView({
      behavior: instant ? 'auto' : 'smooth',
      block: 'end',
    });
  };

  // Scroll otomatis ke bawah saat halaman chat pertama kali dibuka
  useEffect(() => {
    scrollToBottom(true);
    const raf = requestAnimationFrame(() => scrollToBottom(true));
    const t = setTimeout(() => scrollToBottom(true), 150);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t);
    };
  }, []);

  // Scroll otomatis saat ada pesan baru
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    scrollToBottom(false);
  }, [messages.length]);

  return (
    <div className="flex-1 bg-canvas/40 px-4 py-6 sm:px-6">
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
