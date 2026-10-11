"use client";

import React, { useCallback, useEffect, useRef, useState, useTransition } from 'react';
import Link from 'next/link';
import { CheckCheck, ClipboardList, Headset, Loader2, MessageSquare, Scissors, Search, Send, Shirt, Store, Sparkles, WifiOff } from 'lucide-react';
import { ChatMessage, Conversation } from '@/types/chat';
import { Breadcrumb } from '@/components/layout/breadcrumb';
import { ErrorMessage } from '@/components/ui/error-message';
import { formatDate, initials } from '@/lib/format';
import { refreshMessagesAction, sendMessageAction } from '../actions';

const POLL_MS = 5000;

const TOPICS = [
  { key: 'all', label: 'Semua Percakapan', icon: MessageSquare, template: '' },
  { key: 'jahit', label: 'Konsultasi Jahit', icon: Scissors, template: 'Halo Admin, saya ingin konsultasi pesanan jahit seragam: ' },
  { key: 'sewa', label: 'Konsultasi Sewa', icon: Shirt, template: 'Halo Admin, saya ingin menanyakan ketersediaan sewa untuk tanggal: ' },
  { key: 'desain', label: 'Desainer Daring', icon: Sparkles, template: 'Halo tim desainer, saya ingin mendiskusikan desain seragam: ' },
];

interface ChatViewProps {
  conversation: Conversation | null;
  initialMessages: ChatMessage[];
  userName: string;
  topic?: string;
  orderRefs: { id: string; orderNumber: string; label: string }[];
  operationalHours?: string | null;
  loadError?: string;
}

function timeOf(iso: string) {
  return new Date(iso).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
}

export function ChatView({ conversation, initialMessages, userName, topic, orderRefs, operationalHours, loadError }: ChatViewProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [text, setText] = useState(topic ? `[${topic}] ` : '');
  const [error, setError] = useState(loadError ?? '');
  const [online, setOnline] = useState(!loadError);
  const [query, setQuery] = useState('');
  const [sending, startSend] = useTransition();
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const adminName = conversation?.admin?.name ?? 'Tim Admin VIEGUARD';
  const lastMessage = messages.at(-1);

  const refresh = useCallback(async () => {
    const r = await refreshMessagesAction();
    if (r.messages) {
      setMessages(r.messages);
      setOnline(true);
    } else setOnline(false);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      if (document.visibilityState === 'visible') refresh();
    }, POLL_MS);
    return () => clearInterval(id);
  }, [refresh]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages.length]);

  const send = () => {
    const value = text.trim();
    if (!value || sending) return;
    setError('');
    startSend(async () => {
      const r = await sendMessageAction(value);
      if (r.error) {
        setError(r.error);
        return;
      }
      setText('');
      if (r.message) setMessages((m) => (m.some((x) => x.id === r.message!.id) ? m : [...m, r.message!]));
    });
  };

  const applyTopic = (template: string) => {
    if (!template) return;
    setText(template);
    inputRef.current?.focus();
  };

  const visibleMessages = query.trim()
    ? messages.filter((m) => (m.messageText ?? '').toLowerCase().includes(query.trim().toLowerCase()))
    : messages;

  return (
    <main className="mx-auto grid w-full max-w-7xl grid-cols-1 lg:grid-cols-[260px_1fr]">
      <aside className="hidden flex-col justify-between border-r border-line bg-surface px-4 py-8 lg:flex">
        <div>
          <p className="px-4 pb-4 text-xs font-semibold uppercase tracking-wider text-ink-soft">Pusat Konsultasi & Pesan</p>
          <ul className="flex flex-col gap-1">
            {TOPICS.map(({ key, label, icon: Icon, template }, i) => (
              <li key={key}>
                <button
                  type="button"
                  onClick={() => applyTopic(template)}
                  className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold transition-colors ${
                    i === 0 ? 'bg-primary text-on-primary' : 'text-ink-soft hover:bg-beige-soft hover:text-primary'
                  }`}
                >
                  <Icon className="size-4" aria-hidden="true" /> {label}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl bg-beige-soft p-4">
          <p className="text-sm font-semibold text-ink">Bantuan Langsung</p>
          <p className="pt-1 text-sm text-ink-soft">Jam operasional admin & staf fitting: {operationalHours || 'Senin - Sabtu, 08.00 - 17.00 WIB'}.</p>
        </div>
      </aside>

      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: 'Obrolan & Konsultasi' }]} />
        <header className="flex flex-col gap-4 py-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-ink-soft">
              Ruang Kerja Daring Penjahit
              {online ? (
                <span className="rounded-full bg-warning-bg px-2 py-0.5 normal-case text-gold-dark">Terkoneksi Workshop</span>
              ) : (
                <span className="flex items-center gap-1 rounded-full bg-danger-bg px-2 py-0.5 normal-case text-danger">
                  <WifiOff className="size-3" aria-hidden="true" /> Server tidak terhubung
                </span>
              )}
            </p>
            <h1 className="pt-1 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">Ruang Obrolan & Konsultasi</h1>
          </div>
          <span className="flex w-fit items-center gap-2 rounded-full bg-beige-soft px-4 py-2 text-[13px] font-semibold text-ink-soft">
            <span className={`size-2 rounded-full ${online ? 'bg-success' : 'bg-muted'}`} aria-hidden="true" /> Admin membalas pada jam operasional
          </span>
        </header>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[290px_1fr]">
          <section className="flex flex-col rounded-2xl bg-surface p-4 shadow-card ring-1 ring-line">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-ink">Daftar Percakapan</h2>
              <span className="flex size-7 items-center justify-center rounded-full bg-canvas text-xs font-bold text-ink-soft">1</span>
            </div>
            <label className="relative mt-4">
              <span className="sr-only">Cari di percakapan</span>
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden="true" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari isi percakapan..."
                className="h-11 w-full rounded-lg bg-beige-soft pl-10 pr-3 text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </label>
            <div className="mt-4 rounded-xl border-l-4 border-primary bg-beige-soft/70 p-3">
              <div className="flex gap-3">
                <span className="relative flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary font-display text-sm font-bold text-gold-light">
                  VG
                  <span className={`absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-surface ${online ? 'bg-success' : 'bg-muted'}`} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="truncate font-semibold text-ink">{adminName}</p>
                    {lastMessage && <span className="shrink-0 text-xs font-semibold text-primary">{timeOf(lastMessage.createdAt)}</span>}
                  </div>
                  <span className="mt-0.5 inline-block rounded bg-surface px-1.5 py-0.5 text-xs text-ink-soft">Admin & Penjahit Bengkel</span>
                  <p className="line-clamp-2 pt-1 text-[13px] text-ink-soft">{lastMessage?.messageText ?? 'Mulai percakapan dengan tim kami.'}</p>
                </div>
              </div>
            </div>
            {orderRefs.length > 0 && (
              <div className="mt-5">
                <p className="pb-2 text-xs font-semibold uppercase tracking-wide text-ink-soft">Tanyakan tentang pesanan</p>
                <ul className="flex flex-col gap-2">
                  {orderRefs.slice(0, 5).map((o) => (
                    <li key={o.id}>
                      <button
                        type="button"
                        onClick={() => applyTopic(`[Pesanan ${o.orderNumber}] `)}
                        className="flex w-full items-center gap-2 rounded-lg bg-canvas px-3 py-2 text-left text-xs hover:bg-beige-soft"
                      >
                        <ClipboardList className="size-3.5 shrink-0 text-primary" aria-hidden="true" />
                        <span className="min-w-0 flex-1 truncate">
                          <b className="text-primary">{o.orderNumber}</b> · {o.label}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>

          <section className="flex h-[720px] flex-col overflow-hidden rounded-2xl bg-surface shadow-card ring-1 ring-line">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-6 py-4">
              <div className="flex items-center gap-3">
                <span className="relative flex size-12 items-center justify-center rounded-xl bg-primary font-display text-sm font-bold text-gold-light">
                  VG
                  <span className={`absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-surface ${online ? 'bg-success' : 'bg-muted'}`} />
                </span>
                <div>
                  <p className="text-lg font-bold text-ink">{adminName}</p>
                  <p className="text-xs text-ink-soft">Admin & Kepala Penjahit Bengkel</p>
                  {topic && (
                    <span className="mt-1 inline-flex items-center gap-1 rounded-md bg-warning-bg px-2 py-0.5 text-xs font-semibold text-gold-dark">
                      Terkait: {topic}
                    </span>
                  )}
                </div>
              </div>
              <Link href="/orders" className="flex items-center gap-2 rounded-lg bg-canvas px-3 py-2 text-[13px] font-semibold text-primary hover:bg-beige-soft">
                <ClipboardList className="size-4" aria-hidden="true" /> Lihat Pesanan
              </Link>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto bg-canvas/60 px-6 py-6" aria-live="polite">
              {visibleMessages.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <span className="flex size-14 items-center justify-center rounded-full bg-beige-soft text-primary">
                    <Headset className="size-6" aria-hidden="true" />
                  </span>
                  <p className="pt-3 font-semibold text-ink">{query ? 'Tidak ada pesan yang cocok' : 'Belum ada pesan'}</p>
                  <p className="max-w-sm pt-1 text-sm text-ink-soft">
                    {query ? 'Coba kata kunci lain.' : 'Tulis pertanyaan Anda tentang ukuran, desain, sewa, atau status pesanan. Admin akan membalas di sini.'}
                  </p>
                </div>
              ) : (
                <ol className="flex flex-col gap-4">
                  {visibleMessages.map((m, i) => {
                    const prev = visibleMessages[i - 1];
                    const newDay = !prev || new Date(prev.createdAt).toDateString() !== new Date(m.createdAt).toDateString();
                    const mine = m.senderType === 'user';
                    return (
                      <React.Fragment key={m.id}>
                        {newDay && (
                          <li className="flex justify-center">
                            <span className="rounded-full bg-beige-soft px-3 py-1 text-xs text-ink-soft">
                              {formatDate(m.createdAt, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                            </span>
                          </li>
                        )}
                        <li className={`flex gap-2.5 ${mine ? 'flex-row-reverse' : ''}`}>
                          <span
                            className={`flex size-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                              mine ? 'bg-primary-dark text-on-primary' : 'bg-primary text-gold-light'
                            }`}
                          >
                            {mine ? initials(userName) : 'VG'}
                          </span>
                          <div className={`flex max-w-[75%] flex-col ${mine ? 'items-end' : 'items-start'}`}>
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
                      </React.Fragment>
                    );
                  })}
                </ol>
              )}
            </div>

            <form
              className="border-t border-line bg-surface px-4 py-3"
              onSubmit={(e) => {
                e.preventDefault();
                send();
              }}
            >
              <ErrorMessage message={error} className="mb-2" />
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
                        send();
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
                  disabled={sending || !text.trim() || !conversation}
                  className="flex h-11 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-bold text-on-primary shadow-button transition-colors hover:bg-primary-light disabled:opacity-50"
                >
                  {sending ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <Send className="size-4" aria-hidden="true" />} Kirim
                </button>
              </div>
              <p className="flex flex-wrap justify-between gap-2 pt-2 text-xs text-ink-soft">
                <span>Enter untuk kirim · Shift+Enter untuk baris baru</span>
                <span className="flex items-center gap-1">
                  <Store className="size-3" aria-hidden="true" /> Untuk berkas desain, sertakan tautan Google Drive
                </span>
              </p>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}
