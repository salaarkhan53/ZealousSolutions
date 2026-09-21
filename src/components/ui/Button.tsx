import Link from 'next/link';
import type { ComponentProps, ReactNode } from 'react';
import { cn } from '@/lib/cn';

type Variant = 'primary' | 'ghost';

const base =
  'inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold tracking-wide transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] disabled:pointer-events-none disabled:opacity-50';

const variants: Record<Variant, string> = {
  // Solid gold: the page's single loudest element, reserved for the primary action.
  primary: 'btn-gold',
  ghost:
    'border border-gold/30 text-ink hover:border-gold/70 hover:bg-gold/5',
};

type Props = {
  variant?: Variant;
  children: ReactNode;
  className?: string;
};

export function Button({
  variant = 'primary',
  className,
  children,
  ...props
}: Props & ComponentProps<'button'>) {
  return (
    <button className={cn(base, variants[variant], className)} {...props}>
      {children}
    </button>
  );
}

export function ButtonLink({
  variant = 'primary',
  className,
  children,
  href,
  ...props
}: Props & ComponentProps<typeof Link>) {
  return (
    <Link
      href={href}
      // Prefetch is off across the site: under `output: 'export'` Next requests
      // RSC payloads at a path the exporter doesn't write, so every prefetch
      // 404s on a static host. Navigation falls back to a normal fetch on
      // click, which is imperceptible for pages this small.
      prefetch={false}
      className={cn(base, variants[variant], className)}
      {...props}
    >
      {children}
    </Link>
  );
}
