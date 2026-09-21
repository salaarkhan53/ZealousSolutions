'use client';

import Lenis from 'lenis';
import { useEffect } from 'react';

/**
 * Weighted smooth scrolling, which is most of what makes the scrubbed mascot
 * feel deliberate rather than twitchy. Disabled entirely under reduced motion,
 * where native scrolling is the correct behaviour.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - 2 ** (-10 * t)),
      // Touch devices already have good native inertia; overriding it fights
      // the platform and breaks pull-to-refresh.
      smoothWheel: true,
      syncTouch: false,
    });

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    // Lenis owns scroll position, so in-page anchors must go through it.
    const onClick = (event: MouseEvent) => {
      const link = (event.target as HTMLElement)?.closest?.('a');
      if (!link) return;

      const href = link.getAttribute('href');
      if (!href?.includes('#')) return;

      const hash = href.slice(href.indexOf('#'));
      if (hash.length < 2) return;

      // Only intercept links that resolve on the current page. Resolved as a
      // URL so a base path (the GitHub Pages preview) compares correctly.
      if (new URL(href, window.location.href).pathname !== window.location.pathname) return;

      const target = document.querySelector(hash);
      if (!target) return;

      event.preventDefault();
      // No offset here: the target's own `scroll-margin-top` positions it,
      // which keeps JS and native anchor jumps landing in the same place.
      lenis.scrollTo(target as HTMLElement);
      history.pushState(null, '', hash);
    };

    document.addEventListener('click', onClick);

    return () => {
      document.removeEventListener('click', onClick);
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return null;
}
