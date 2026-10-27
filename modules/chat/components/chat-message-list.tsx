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

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages.length]);

  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto bg-canvas/60 px-4 py-6 sm:px-6 " aria-live="polite" >
      {messages.length === 0 ? (
        <ChatEmptyState />
      ) : (
        <ol className="flex flex-col gap-4">
          {messages.map((m, i) => {
            const prev = messages[i - 1];
            const newDay = !prev || new Date(prev.createdAt).toDateString() !== new Date(m.createdAt).toDateString();
            return (
              <React.Fragment key={m.id}>
                {newDay && (
                  <li className="flex justify-center">
                    <span className="rounded-full bg-beige-soft px-3 py-1 text-xs text-ink-soft">
                      {formatDate(m.createdAt, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                  </li>
                )}
                <ChatMessageItem message={m} userName={userName} adminName={adminName} />
              </React.Fragment>
            );
          })}
        </ol>
      )}
    </div>
  );
}