import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export const fieldClass =
  'w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-ink placeholder:text-muted/60 transition-colors focus:border-gold/60 focus:outline-none focus-visible:outline-none';

/**
 * Label + control + error, wired so the message is announced and the input is
 * programmatically linked to it.
 */
export function Field({
  id,
  label,
  error,
  required,
  hint,
  children,
  className,
}: {
  id: string;
  label: string;
  error?: string;
  required?: boolean;
  hint?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <label htmlFor={id} className="text-xs font-medium tracking-wide text-ink/80">
        {label}
        {required && (
          <span className="ml-1 text-gold" aria-hidden="true">
            *
          </span>
        )}
        {!required && <span className="ml-1.5 text-muted/70">(optional)</span>}
      </label>

      {children}

      {hint && !error && <p className="text-xs text-muted/80">{hint}</p>}

      {error && (
        <p id={`${id}-error`} role="alert" className="text-xs text-[#ff9b8a]">
          {error}
        </p>
      )}
    </div>
  );
}
