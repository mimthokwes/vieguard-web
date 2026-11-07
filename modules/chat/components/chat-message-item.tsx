import React from 'react';
import { CheckCheck } from 'lucide-react';
import { ChatMessage } from '@/types/chat';

export function timeOf(iso: string) {
  return new Date(iso).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
}

interface ChatMessageItemProps {
  message: ChatMessage;
  userName?: string;
  adminName: string;
}

// Regex to capture markdown inline tokens:
// 1. ***bold italic***
// 2. **bold**
// 3. *italic*
// 4. `code`
// 5. [text](url)
const INLINE_REGEX =
  /(\*\*\*(?!\s)[^*]+?(?<!\s)\*\*\*|\*\*(?!\s)[^*]+?(?<!\s)\*\*|\*(?!\s)[^*]+?(?<!\s)\*|`[^`]+?`|\[[^\]]+\]\(https?:\/\/[^\s)]+\))/g;

function renderInlineMarkdown(text: string, isMine: boolean): React.ReactNode[] {
  const parts = text.split(INLINE_REGEX);

  return parts.map((part, index) => {
    if (!part) return null;

    // Bold + Italic: ***text***
    if (part.startsWith('***') && part.endsWith('***') && part.length > 6) {
      return (
        <strong key={index} className="font-bold italic">
          {part.slice(3, -3)}
        </strong>
      );
    }

    // Bold: **text**
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      return (
        <strong key={index} className={`font-bold ${isMine ? 'text-white' : 'text-ink'}`}>
          {part.slice(2, -2)}
        </strong>
      );
    }

    // Italic: *text*
    if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
      return (
        <em key={index} className="italic">
          {part.slice(1, -1)}
        </em>
      );
    }

    // Inline Code: `code`
    if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
      return (
        <code
          key={index}
          className={`rounded px-1.5 py-0.5 font-mono text-xs ${
            isMine ? 'bg-white/20 text-white' : 'bg-black/5 text-ink'
          }`}
        >
          {part.slice(1, -1)}
        </code>
      );
    }

    // Link: [label](url)
    if (part.startsWith('[') && part.endsWith(')')) {
      const linkMatch = part.match(/^\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)$/);
      if (linkMatch) {
        const [, label, url] = linkMatch;
        return (
          <a
            key={index}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className={`underline underline-offset-2 ${
              isMine ? 'text-white hover:text-white/80' : 'text-primary hover:underline'
            }`}
          >
            {label}
          </a>
        );
      }
    }

    return <span key={index}>{part}</span>;
  });
}

export function FormattedChatMessage({
  content,
  isMine,
}: {
  content?: string | null;
  isMine: boolean;
}) {
  if (!content) return null;

  const lines = content.split(/\r?\n/);

  return (
    <div className="space-y-1.5 break-words">
      {lines.map((line, lineIdx) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={lineIdx} className="h-2" />;
        }

        // Heading: #, ##, ###
        const headingMatch = line.match(/^(#{1,3})\s+(.*)$/);
        if (headingMatch) {
          const [, hashes, headingText] = headingMatch;
          return (
            <p
              key={lineIdx}
              className={`pt-1 font-bold ${hashes.length === 1 ? 'text-base' : 'text-[15px]'} ${
                isMine ? 'text-white' : 'text-ink'
              }`}
            >
              {renderInlineMarkdown(headingText, isMine)}
            </p>
          );
        }

        // Bullet list item: "* " or "- "
        const bulletMatch = line.match(/^(\s*)([-*])\s+(.*)$/);
        if (bulletMatch) {
          const [, indent, , itemText] = bulletMatch;
          const indentLevel = Math.min(Math.floor(indent.length / 2), 4);
          return (
            <div
              key={lineIdx}
              className="flex items-start gap-2"
              style={{ paddingLeft: `${indentLevel * 12}px` }}
            >
              <span
                className={`mt-2 size-1.5 shrink-0 rounded-full ${
                  isMine ? 'bg-white' : 'bg-primary'
                }`}
                aria-hidden="true"
              />
              <span className="flex-1">{renderInlineMarkdown(itemText, isMine)}</span>
            </div>
          );
        }

        // Numbered list item: "1. ", "2. ", etc.
        const numberedMatch = line.match(/^(\s*)(\d+)\.\s+(.*)$/);
        if (numberedMatch) {
          const [, indent, num, itemText] = numberedMatch;
          const indentLevel = Math.min(Math.floor(indent.length / 2), 4);
          return (
            <div
              key={lineIdx}
              className="flex items-start gap-2"
              style={{ paddingLeft: `${indentLevel * 12}px` }}
            >
              <span
                className={`shrink-0 font-medium ${
                  isMine ? 'text-white/90' : 'text-primary'
                }`}
              >
                {num}.
              </span>
              <span className="flex-1">{renderInlineMarkdown(itemText, isMine)}</span>
            </div>
          );
        }

        // Standard line
        return (
          <p key={lineIdx} className="leading-relaxed">
            {renderInlineMarkdown(line, isMine)}
          </p>
        );
      })}
    </div>
  );
}

export function ChatMessageItem({ message: m, adminName }: ChatMessageItemProps) {
  const mine = m.senderType === 'user';

  return (
    <li className={`flex w-full ${mine ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-[85%] flex-col sm:max-w-[75%] ${mine ? 'items-end' : 'items-start'}`}>
        <p className="pb-1 text-xs text-ink-soft">
          <b className={mine ? 'text-primary' : 'text-ink'}>{mine ? 'Anda' : adminName}</b> · {timeOf(m.createdAt)} WIB
        </p>
        <div
          className={`rounded-2xl px-4 py-3 text-[15px] leading-6 shadow-soft ${
            mine ? 'rounded-tr-sm bg-primary text-on-primary' : 'rounded-tl-sm bg-surface text-ink ring-1 ring-line'
          }`}
        >
          <FormattedChatMessage content={m.messageText} isMine={mine} />
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
