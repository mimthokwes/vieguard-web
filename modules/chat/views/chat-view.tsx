"use client";

import React, { useState } from 'react';
import { Send, User as UserIcon, Sparkles, Scissors, Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface Message {
  id: string;
  sender: 'user' | 'stylist';
  text: string;
  timestamp: string;
}

export function ChatView({ initialProductName }: { initialProductName?: string }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm1',
      sender: 'stylist',
      text: 'Halo! Selamat datang di layanan Personal Stylist VIEGUARD. Ada yang bisa kami bantu mengenai fitting, kustomisasi ukuran, atau reservasi gaun Anda?',
      timestamp: '10:00',
    },
    ...(initialProductName
      ? [
          {
            id: 'm2',
            sender: 'user' as const,
            text: `Halo stylist, saya tertarik untuk bertanya tentang busana "${initialProductName}". Apakah saya bisa melakukan fitting di butik?`,
            timestamp: '10:01',
          },
          {
            id: 'm3',
            sender: 'stylist' as const,
            text: `Tentu! Untuk busana ${initialProductName}, kami menyediakan layanan Private Fitting Room di Butik Atelier kami atau layanan antar sampel ke rumah Anda.`,
            timestamp: '10:02',
          },
        ]
      : []),
  ]);

  const [input, setInput] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: input.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    // Simulated Stylist response
    setTimeout(() => {
      const replyMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'stylist',
        text: 'Terima kasih telah menghubungi kami. Master Tailor dan Stylist kami sedang meninjau permintaan Anda. Kami akan membalas pesan Anda sebentar lagi.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, replyMsg]);
    }, 1000);
  };

  const handleQuickTopic = (topicText: string) => {
    setInput(topicText);
  };

  return (
    <div className="w-full min-h-[85vh] bg-[#FAF7F2] py-8 sm:py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Chat Container Card */}
        <div className="bg-white rounded-3xl border border-[#E6E1DA] shadow-xl overflow-hidden flex flex-col h-[70vh]">
          
          {/* Header */}
          <div className="bg-[#1C1C1C] text-white px-6 py-4 flex items-center justify-between border-b border-[#2C2C2C]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#C48B54] text-white flex items-center justify-center font-bold shadow-sm">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <h2 className="font-serif font-bold text-sm text-white">
                  VIEGUARD Personal Stylist
                </h2>
                <span className="text-[10px] text-[#A0988D] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Stylist & Master Tailor Online
                </span>
              </div>
            </div>
            <div className="text-right text-[10px] text-[#A0988D]">
              Buka Setiap Hari 09.00 - 21.00 WIB
            </div>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-6 overflow-y-auto bg-[#FAF7F2] flex flex-col gap-4">
            
            {/* Quick Topic Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              <button
                onClick={() => handleQuickTopic('Saya ingin konsultasi Jahit Kustom busana impian.')}
                className="bg-white border border-[#E6E1DA] hover:border-[#C48B54] text-[#1C1C1C] text-[11px] font-semibold px-3 py-1.5 rounded-full whitespace-nowrap shadow-sm transition-colors flex items-center gap-1.5"
              >
                <Scissors className="w-3.5 h-3.5 text-[#C48B54]" />
                Jahit Kustom
              </button>
              <button
                onClick={() => handleQuickTopic('Bagaimana prosedur tukar ukuran jika kurang pas?')}
                className="bg-white border border-[#E6E1DA] hover:border-[#C48B54] text-[#1C1C1C] text-[11px] font-semibold px-3 py-1.5 rounded-full whitespace-nowrap shadow-sm transition-colors flex items-center gap-1.5"
              >
                <Clock className="w-3.5 h-3.5 text-[#C48B54]" />
                Tukar Ukuran H-2
              </button>
              <button
                onClick={() => handleQuickTopic('Saya ingin booking jadwal Private Fitting Room di Butik.')}
                className="bg-white border border-[#E6E1DA] hover:border-[#C48B54] text-[#1C1C1C] text-[11px] font-semibold px-3 py-1.5 rounded-full whitespace-nowrap shadow-sm transition-colors flex items-center gap-1.5"
              >
                <UserIcon className="w-3.5 h-3.5 text-[#C48B54]" />
                Booking Fitting Room
              </button>
            </div>

            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 max-w-[80%] ${
                    isUser ? 'self-end flex-row-reverse' : 'self-start'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                      isUser
                        ? 'bg-[#1C1C1C] text-white'
                        : 'bg-[#FAF2EA] border border-[#DDB892] text-[#C48B54]'
                    }`}
                  >
                    {isUser ? 'U' : 'VS'}
                  </div>
                  <div className="flex flex-col gap-1">
                    <div
                      className={`p-4 rounded-2xl text-xs leading-relaxed shadow-sm ${
                        isUser
                          ? 'bg-[#1C1C1C] text-white rounded-tr-none'
                          : 'bg-white border border-[#E6E1DA] text-[#1C1C1C] rounded-tl-none'
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span
                      className={`text-[9px] text-[#8C857B] px-1 ${
                        isUser ? 'text-right' : 'text-left'
                      }`}
                    >
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer Input Bar */}
          <form
            onSubmit={handleSend}
            className="p-4 bg-white border-t border-[#E6E1DA] flex items-center gap-3"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tulis pesan atau pertanyaan Anda di sini..."
              className="py-3"
            />
            <button
              type="submit"
              aria-label="Kirim Pesan"
              className="bg-[#1C1C1C] hover:bg-[#C48B54] text-white p-3 rounded-xl transition-colors flex items-center justify-center flex-shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>

      </div>
    </div>
  );
}
