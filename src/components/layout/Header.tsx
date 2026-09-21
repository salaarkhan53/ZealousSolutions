'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ButtonLink } from '@/components/ui/Button';
import { nav } from '@/content/site';
import { cn } from '@/lib/cn';
import { Logo } from './Logo';
import { MobileNav } from './MobileNav';

/** Section ids tracked by the scroll spy, in document order. */
const SPY_IDS = ['about', 'services', 'industries', 'process', 'book'];

export function Header() {
  const pathname = usePathname();
  const onHome = pathname === '/';
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Scroll spy. Only the one-pager has these sections.
  useEffect(() => {
    if (!onHome) {
      setActive(null);
      return;
    }

    const sections = SPY_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => Boolean(el),
    );
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Recompute from all tracked sections rather than just this batch:
        // observers only report what changed, and the active item has to clear
        // when the reader is between sections - otherwise the highlight sticks
        // on whichever section was last seen.
        const inBand = sections
          .filter((section) => {
            const { top, bottom } = section.getBoundingClientRect();
            const height = window.innerHeight;
            return bottom > height * 0.45 && top < height * 0.5;
          })
          .sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top);

        setActive(inBand[0]?.id ?? null);
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );

    for (const section of sections) observer.observe(section);
    return () => observer.disconnect();
  }, [onHome]);

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-40 transition-all duration-500',
        scrolled
          ? 'border-b border-gold/15 bg-night/55 backdrop-blur-xl'
          : 'border-b border-transparent',
      )}
    >
      <div className="shell flex h-20 items-center justify-between gap-6">
        <Link prefetch={false} href="/" className="shrink-0" aria-label="Zealous Solutions - home">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Main">
          {nav.map((item) => {
            const id = item.href.split('#')[1];
            const isActive = 'route' in item ? pathname.startsWith(item.href) : active === id;

            return (
              <Link prefetch={false}
                key={item.href}
                href={item.href}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'relative py-2 text-sm font-medium transition-colors',
                  isActive ? 'text-gold' : 'text-muted hover:text-ink',
                )}
              >
                {item.label}
                <span
                  aria-hidden="true"
                  className={cn(
                    'absolute inset-x-0 -bottom-0.5 h-px origin-left bg-gold transition-transform duration-300',
                    isActive ? 'scale-x-100' : 'scale-x-0',
                  )}
                />
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          {/* Wrapped rather than given `hidden` directly: the button base sets
              `inline-flex`, which has equal specificity and would win. */}
          <span className="hidden sm:block">
            <ButtonLink href="/#book" className="px-5 py-2.5 text-xs md:px-7 md:py-3 md:text-sm">
              Book Appointment
            </ButtonLink>
          </span>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
