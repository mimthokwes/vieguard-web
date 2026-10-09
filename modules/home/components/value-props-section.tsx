import React from 'react';
import { Zap, RefreshCw, Sparkles, MessageCircle } from 'lucide-react';

export function ValuePropsSection() {
  const props = [
    {
      icon: <Zap className="w-5 h-5 text-[#C48B54]" />,
      title: 'Pengiriman Kilat',
      desc: 'Tiba H-1 sebelum acara',
    },
    {
      icon: <RefreshCw className="w-5 h-5 text-[#C48B54]" />,
      title: 'Jaminan Pas Ukuran',
      desc: 'Tukar ukuran gratis',
    },
    {
      icon: <Sparkles className="w-5 h-5 text-[#C48B54]" />,
      title: 'Steril & Siap Pakai',
      desc: 'Standard eco-laundry',
    },
    {
      icon: <MessageCircle className="w-5 h-5 text-[#C48B54]" />,
      title: 'Konsultasi Gaya 24/7',
      desc: 'Stylist siap membantu',
    },
  ];

  return (
    <section className="w-full py-8 bg-[#FAF7F2] border-b border-[#E6E1DA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {props.map((item) => (
            <div
              key={item.title}
              className="bg-white border border-[#E6E1DA] rounded-2xl p-4 flex items-center gap-3.5 shadow-sm hover:border-[#C48B54] transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-[#FAF2EA] flex items-center justify-center flex-shrink-0">
                {item.icon}
              </div>
              <div className="flex flex-col">
                <h4 className="text-xs font-bold text-[#1C1C1C]">{item.title}</h4>
                <p className="text-[11px] text-[#6B655C]">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
