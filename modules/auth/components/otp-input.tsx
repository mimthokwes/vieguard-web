"use client";

import React, { useRef, useEffect } from 'react';

interface OtpInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  autoFocus?: boolean;
  onComplete?: (code: string) => void;
}

export function OtpInput({
  length = 6,
  value,
  onChange,
  disabled = false,
  autoFocus = true,
  onComplete,
}: OtpInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Split string into array of single characters
  const digits = Array.from({ length }, (_, i) => value[i] || '');

  // Auto-focus the first input (or first empty input) on mount
  useEffect(() => {
    if (autoFocus && !disabled) {
      const firstEmptyIndex = digits.findIndex((d) => !d);
      const targetIndex = firstEmptyIndex === -1 ? 0 : firstEmptyIndex;
      inputRefs.current[targetIndex]?.focus();
    }
  }, []);

  const updateDigits = (newDigits: string[]) => {
    const combined = newDigits.join('').slice(0, length);
    onChange(combined);
    if (combined.length === length) {
      onComplete?.(combined);
    }
  };

  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/\D/g, '');
    if (!rawVal) {
      const newDigits = [...digits];
      newDigits[index] = '';
      updateDigits(newDigits);
      return;
    }

    // If multiple digits typed/autofilled in one box
    if (rawVal.length > 1) {
      const charArray = rawVal.split('').slice(0, length - index);
      const newDigits = [...digits];
      charArray.forEach((char, i) => {
        newDigits[index + i] = char;
      });
      updateDigits(newDigits);
      const nextFocus = Math.min(index + charArray.length, length - 1);
      inputRefs.current[nextFocus]?.focus();
      return;
    }

    // Single digit input
    const newDigits = [...digits];
    newDigits[index] = rawVal;
    updateDigits(newDigits);

    // Auto-advance to next input box
    if (index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (digits[index]) {
        // Clear current box
        const newDigits = [...digits];
        newDigits[index] = '';
        updateDigits(newDigits);
      } else if (index > 0) {
        // Move to previous box and clear it
        const newDigits = [...digits];
        newDigits[index - 1] = '';
        updateDigits(newDigits);
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault();
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      e.preventDefault();
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    if (!pastedText) return;

    const newDigits = Array.from({ length }, (_, i) => pastedText[i] || '');
    updateDigits(newDigits);

    const focusIdx = Math.min(pastedText.length, length - 1);
    inputRefs.current[focusIdx]?.focus();
  };

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-2.5">
      {Array.from({ length }).map((_, index) => {
        const digit = digits[index] || '';
        const isFilled = Boolean(digit);

        return (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            disabled={disabled}
            value={digit}
            onChange={(e) => handleChange(index, e)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            onFocus={(e) => e.target.select()}
            className={`size-11 sm:size-12 rounded-xl border text-center font-mono text-xl sm:text-2xl font-bold transition-all duration-150 outline-none select-none ${
              isFilled
                ? 'border-primary/60 bg-surface text-ink shadow-sm ring-1 ring-primary/20'
                : 'border-line bg-surface text-ink placeholder:text-muted/30'
            } focus:border-primary focus:bg-surface focus:ring-2 focus:ring-primary/25 disabled:bg-beige-soft disabled:text-muted disabled:cursor-not-allowed`}
            aria-label={`Digit OTP ke-${index + 1}`}
          />
        );
      })}
    </div>
  );
}
