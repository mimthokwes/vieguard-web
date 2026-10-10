import React, { forwardRef } from 'react';

const fieldBase =
  'w-full bg-surface border rounded-lg text-sm text-ink placeholder:text-muted/80 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-colors focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary disabled:bg-beige-soft disabled:text-muted';

function fieldBorder(error?: string) {
  return error ? 'border-danger focus:border-danger focus:ring-danger' : 'border-line';
}

interface FieldShellProps {
  label?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  htmlFor?: string;
  children: React.ReactNode;
}

/** Label + control + hint/error, matching the Figma form rhythm (label 13px, 6px gap). */
export function Field({ label, hint, error, required, htmlFor, children }: FieldShellProps) {
  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label htmlFor={htmlFor} className="text-[13px] font-medium text-ink">
          {label}
          {required && <span className="text-primary"> *</span>}
        </label>
      )}
      {children}
      {error ? (
        <p className="text-xs text-danger">{error}</p>
      ) : (
        hint && <p className="text-xs text-muted">{hint}</p>
      )}
    </div>
  );
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightSlot?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, hint, error, leftIcon, rightSlot, required, className = '', id, name, ...props }, ref) => {
    const inputId = id ?? name;
    return (
      <Field label={label} hint={hint} error={error} required={required} htmlFor={inputId}>
        <div className="relative flex items-center">
          {leftIcon && (
            <span className="absolute left-3.5 text-muted pointer-events-none flex items-center">{leftIcon}</span>
          )}
          <input
            ref={ref}
            id={inputId}
            name={name}
            required={required}
            className={`${fieldBase} ${fieldBorder(error)} h-11 ${leftIcon ? 'pl-10' : 'pl-4'} ${rightSlot ? 'pr-28' : 'pr-4'} ${className}`}
            {...props}
          />
          {rightSlot && <span className="absolute right-2 flex items-center">{rightSlot}</span>}
        </div>
      </Field>
    );
  }
);
Input.displayName = 'Input';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, hint, error, required, className = '', id, name, rows = 4, ...props }, ref) => {
    const inputId = id ?? name;
    return (
      <Field label={label} hint={hint} error={error} required={required} htmlFor={inputId}>
        <textarea
          ref={ref}
          id={inputId}
          name={name}
          rows={rows}
          required={required}
          className={`${fieldBase} ${fieldBorder(error)} px-4 py-3 resize-y ${className}`}
          {...props}
        />
      </Field>
    );
  }
);
Textarea.displayName = 'Textarea';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  hint?: string;
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, hint, error, required, className = '', id, name, children, ...props }, ref) => {
    const inputId = id ?? name;
    return (
      <Field label={label} hint={hint} error={error} required={required} htmlFor={inputId}>
        <select
          ref={ref}
          id={inputId}
          name={name}
          required={required}
          className={`${fieldBase} ${fieldBorder(error)} h-11 px-4 appearance-none bg-[url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%238C7468' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")] bg-no-repeat bg-[right_14px_center] pr-10 ${className}`}
          {...props}
        >
          {children}
        </select>
      </Field>
    );
  }
);
Select.displayName = 'Select';

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: React.ReactNode;
}

export function Checkbox({ label, className = '', ...props }: CheckboxProps) {
  return (
    <label className={`inline-flex items-start gap-2 text-xs text-ink-soft cursor-pointer ${className}`}>
      <input type="checkbox" className="mt-0.5 size-4 shrink-0 rounded-sm border-line-strong accent-primary" {...props} />
      <span className="leading-[19px]">{label}</span>
    </label>
  );
}
