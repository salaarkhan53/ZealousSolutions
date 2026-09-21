'use client';

import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { ButtonLink } from '@/components/ui/Button';
import { contact, nav } from '@/content/site';
import { Logo } from './Logo';

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Any navigation closes the panel - including in-page anchors, which don't
  // change the pathname, so the click handler below covers those.
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;

    const { body } = document;
    const previousOverflow = body.style.overflow;
    body.style.overflow = 'hidden';

    const focusables = () =>
      Array.from(
        panelRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled])',
        ) ?? [],
      );

    focusables()[0]?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        triggerRef.current?.focus();
        return;
      }

      if (event.key !== 'Tab') return;

      // Trap focus inside the panel while it covers the page.
      const items = focusables();
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        aria-expanded={open}
        className="grid h-11 w-11 place-items-center rounded-full border border-gold/25 text-ink transition-colors hover:border-gold/60 lg:hidden"
      >
        <Menu className="h-5 w-5" strokeWidth={1.5} />
      </button>

      {open && (
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          className="fixed inset-0 z-50 flex flex-col bg-night/98 backdrop-blur-xl lg:hidden"
          onClick={(event) => {
            // Anchor links keep the same pathname, so close on any link click.
            if ((event.target as HTMLElement).closest('a')) setOpen(false);
          }}
        >
          <div className="flex h-20 items-center justify-between px-5 sm:px-8">
            <Logo />
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                triggerRef.current?.focus();
              }}
              aria-label="Close menu"
              className="grid h-11 w-11 place-items-center rounded-full border border-gold/25 text-ink"
            >
              <X className="h-5 w-5" strokeWidth={1.5} />
            </button>
          </div>

          <nav className="flex flex-1 flex-col justify-center gap-1 px-5 sm:px-8" aria-label="Mobile">
            {nav.map((item, i) => (
              <Link prefetch={false}
                key={item.href}
                href={item.href}
                style={{ animationDelay: `${i * 60}ms` }}
                className="animate-[fadeUp_0.5s_cubic-bezier(0.16,1,0.3,1)_both] border-b border-white/5 py-5 font-display text-2xl text-ink transition-colors hover:text-gold"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="px-5 pb-10 sm:px-8">
            <ButtonLink href="/#book" className="w-full">
              Book Appointment
            </ButtonLink>
            <a
              href={`mailto:${contact.email}`}
              className="mt-5 block text-center text-sm text-muted transition-colors hover:text-gold"
            >
              {contact.email}
            </a>
          </div>
        </div>
      )}
    </>
  );
}
