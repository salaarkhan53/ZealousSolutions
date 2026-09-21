'use client';

import { useEffect, useRef, useState, type RefObject } from 'react';

/**
 * A scroll-linked value between 0 and 1.
 *
 * Deliberately mirrors the small slice of Motion's `MotionValue` that this
 * site actually used - `get()` and `on('change', …)` - so the stage and its
 * panels read identically. Motion was pulling roughly 100KB gzipped into the
 * bundle to provide this plus one fade component, which was the largest single
 * cost on a page whose mobile LCP sat above the 2.5s threshold.
 */
export type ScrollProgress = {
  get(): number;
  on(event: 'change', handler: (value: number) => void): () => void;
};

/**
 * Tracks how far `ref` has travelled through the viewport: 0 when its top
 * meets the top of the screen, 1 when its bottom meets the bottom.
 */
export function useScrollProgress(ref: RefObject<HTMLElement | null>): ScrollProgress {
  // A ref, not state: the value changes every frame while scrolling and must
  // never trigger a React render.
  const value = useRef(0);
  const handlers = useRef(new Set<(value: number) => void>());

  const [api] = useState<ScrollProgress>(() => ({
    get: () => value.current,
    on: (_event, handler) => {
      handlers.current.add(handler);
      return () => handlers.current.delete(handler);
    },
  }));

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let frame = 0;

    const measure = () => {
      frame = 0;
      const rect = el.getBoundingClientRect();
      const travel = rect.height - window.innerHeight;
      const next = travel <= 0 ? 0 : Math.min(1, Math.max(0, -rect.top / travel));
      if (next === value.current) return;
      value.current = next;
      for (const handler of handlers.current) handler(next);
    };

    /** Coalesce scroll events into one measurement per frame. */
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);

    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [ref]);

  return api;
}
