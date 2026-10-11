import React from 'react';
import { Inbox } from 'lucide-react';
import { ButtonLink } from './button';

interface EmptyStateProps {
  title: string;
  description: string;
  actionText?: string;
  actionHref?: string;
  icon?: React.ReactNode;
  className?: string;
}

export function EmptyState({ title, description, actionText, actionHref, icon, className = '' }: EmptyStateProps) {
  return (
    <div className={`my-6 flex flex-col items-center justify-center rounded-2xl border border-dashed border-line-strong bg-surface p-12 text-center ${className}`}>
      <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-beige-soft text-primary">
        {icon || <Inbox className="size-7" aria-hidden="true" />}
      </div>
      <h3 className="mb-2 text-lg font-bold text-ink">{title}</h3>
      <p className="mb-6 max-w-md text-sm text-ink-soft">{description}</p>
      {actionText && actionHref && <ButtonLink href={actionHref}>{actionText}</ButtonLink>}
    </div>
  );
}
