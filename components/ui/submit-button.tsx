"use client";

import React from 'react';
import { useFormStatus } from 'react-dom';
import { Loader2 } from 'lucide-react';
import { Button, ButtonSize, ButtonVariant } from './button';

interface SubmitButtonProps {
  label: string;
  loadingLabel?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export function SubmitButton({
  label,
  loadingLabel = 'Memproses...',
  variant = 'primary',
  size = 'lg',
  className = '',
  fullWidth = true,
  icon,
  disabled,
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending || disabled} variant={variant} size={size} fullWidth={fullWidth} className={className}>
      {pending ? (
        <>
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          {loadingLabel}
        </>
      ) : (
        <>
          {label}
          {icon}
        </>
      )}
    </Button>
  );
}
