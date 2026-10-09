import React from 'react';
import Link from 'next/link';
import { Button } from './button';

interface EmptyStateProps {
  title: string;
  description: string;
  actionText?: string;
  actionHref?: string;
  icon?: React.ReactNode;
}

export function EmptyState({
  title,
  description,
  actionText,
  actionHref,
  icon,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-12 bg-white rounded-2xl border border-[#E6E1DA] my-6">
      <div className="w-16 h-16 rounded-full bg-[#FAF2EA] text-[#C48B54] flex items-center justify-center mb-4">
        {icon || (
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        )}
      </div>
      <h3 className="text-xl font-semibold font-serif text-[#1C1C1C] mb-2">{title}</h3>
      <p className="text-sm text-[#6B655C] max-w-md mb-6">{description}</p>
      {actionText && actionHref && (
        <Link href={actionHref}>
          <Button variant="primary">{actionText}</Button>
        </Link>
      )}
    </div>
  );
}
