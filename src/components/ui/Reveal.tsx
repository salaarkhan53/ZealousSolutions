'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { cn } from '@/lib/cn';

type Props = {
  children: ReactNode;
  /** Stagger position when several Reveals share a row. */
  index?: number;
  className?: string;
};

/**
 * The site's one scroll-reveal: a short fade and rise, fired once.
 *
 * An IntersectionObserver toggling two CSS classes, rather than an animation
 * library. Reduced motion is honoured by the global rule in globals.css, which
 * collapses the transition duration.
 */
export function Reveal({ children, index = 0, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Anything already on screen at mount is revealed without waiting, so the
    // first viewport never sits blank.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setShown(true);
        observer.disconnect();
      },
      { rootMargin: '0px 0px -80px 0px' },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        'transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-[opacity,transform]',
        shown ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0',
        className,
      )}
      style={{ transitionDelay: shown ? `${Math.min(index * 80, 400)}ms` : '0ms' }}
    >
      {children}
    </div>
  );
}
