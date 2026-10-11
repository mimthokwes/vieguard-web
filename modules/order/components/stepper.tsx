import React from 'react';
import { Check } from 'lucide-react';

export interface StepDef {
  title: string;
  subtitle: string;
}

export function Stepper({ steps, current }: { steps: StepDef[]; current: number }) {
  return (
    <ol className="grid grid-cols-1 gap-3 rounded-2xl bg-surface p-4 shadow-card ring-1 ring-line sm:grid-cols-3 sm:p-6" aria-label="Langkah pemesanan">
      {steps.map((step, i) => {
        const n = i + 1;
        const done = n < current;
        const active = n === current;
        return (
          <li
            key={step.title}
            aria-current={active ? 'step' : undefined}
            className={`flex items-center gap-3.5 rounded-xl px-3 py-2.5 ${active ? 'bg-beige-soft' : ''}`}
          >
            <span
              className={`flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                done ? 'bg-beige text-primary' : active ? 'bg-primary text-on-primary shadow-button' : 'bg-canvas text-muted'
              }`}
            >
              {done ? <Check className="size-4" strokeWidth={3} aria-hidden="true" /> : n}
            </span>
            <span className="leading-tight">
              <span className={`block text-xs font-bold uppercase tracking-wider ${active ? 'text-primary' : done ? 'text-ink-soft' : 'text-muted'}`}>
                Langkah {n}
                {active && ' · Aktif'}
              </span>
              <span className={`block text-sm ${active ? 'font-bold text-primary' : done ? 'text-ink' : 'text-muted'}`}>{step.title}</span>
              <span className="block text-xs text-muted">{step.subtitle}</span>
            </span>
          </li>
        );
      })}
    </ol>
  );
}

export function SummaryRow({ label, value, accent = false }: { label: string; value: React.ReactNode; accent?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-4 py-1.5 text-sm">
      <span className="text-ink-soft">{label}</span>
      <span className={`text-right font-semibold ${accent ? 'text-primary' : 'text-ink'}`}>{value}</span>
    </div>
  );
}

export function FormSection({
  icon,
  title,
  action,
  children,
  className = '',
}: {
  icon?: React.ReactNode;
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`rounded-2xl bg-surface p-6 shadow-card ring-1 ring-line sm:p-8 ${className}`}>
      <div className="flex items-center justify-between gap-3 pb-6">
        <h2 className="flex items-center gap-3 text-base font-semibold text-ink">
          {icon && <span className="flex size-10 items-center justify-center rounded-lg bg-beige-soft text-primary">{icon}</span>}
          {title}
        </h2>
        {action}
      </div>
      {children}
    </section>
  );
}
