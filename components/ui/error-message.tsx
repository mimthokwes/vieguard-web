import React from 'react';
import { CircleAlert } from 'lucide-react';

export function ErrorMessage({ message, className = '' }: { message?: string; className?: string }) {
  if (!message) return null;
  return (
    <div role="alert" className={`flex items-start gap-2 rounded-lg border border-danger/25 bg-danger-bg px-4 py-3 text-sm text-danger ${className}`}>
      <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      <span>{message}</span>
    </div>
  );
}
