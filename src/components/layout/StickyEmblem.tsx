'use client';

import { useEffect, useRef } from 'react';
import { asset } from '@/lib/asset';

/** Gap kept between the logo's edge and the nearest sprinkle, in px. */
const CLEARANCE = 36;

/**
 * How far a sprinkle travels from its resting point over one float cycle, in
 * px. Mirrors the sprinkleFloat keyframes in globals.css: it rises 44px and
 * starts 12px low. Its sideways sway is read per sprinkle from data-sway.
 */
const RISE = 44;
const DROP = 12;

type Dust = { el: HTMLElement; x0: number; x1: number; y0: number; y1: number; near: boolean };

/**
 * A faint, glossy Zealous mark in the background of the home page, after the
 * hero.
 *
 * It sits in a layer spanning every section below the mascot stage and is
 * sticky inside it, so it is uncovered as the mascot stage scrolls away, then
 * holds at the centre of the screen on the right-hand side while the rest of
 * the page scrolls over it, and leaves before the footer. It is behind the
 * sections (negative z-index), so cards and the booking form pass over it.
 *
 * Sprinkles keep clear of it: every frame the logo moves, each sprinkle's full
 * drift path is tested against the logo's circle plus CLEARANCE, and any that
 * would cross it are faded out. Sprinkles are a site-wide fixed layer, so this
 * is done live rather than by leaving a permanent gap, which would show as a
 * hole on pages that have no logo.
 *
 * Desktop only (lg and up). Below that the copy runs the full width, so the
 * mark would sit behind the text.
 */
export function StickyEmblem() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const emblem = ref.current;
    if (!emblem) return;

    let dust: Dust[] = [];
    let frame = 0;

    /**
     * Each sprinkle's travel box, in viewport pixels. The field is a fixed,
     * full-screen layer, so offsetLeft/Top are already viewport coordinates,
     * and unlike getBoundingClientRect they ignore the running animation.
     */
    const measureDust = () => {
      dust = Array.from(document.querySelectorAll<HTMLElement>('[data-sprinkle]')).map((el) => {
        const sway = parseFloat(el.dataset.sway ?? '0');
        const size = el.offsetWidth;
        return {
          el,
          x0: el.offsetLeft + Math.min(0, sway),
          x1: el.offsetLeft + size + Math.max(0, sway),
          y0: el.offsetTop - RISE,
          y1: el.offsetTop + size + DROP,
          near: el.hasAttribute('data-near-emblem'),
        };
      });
    };

    const update = () => {
      frame = 0;
      const r = emblem.getBoundingClientRect();
      // Hidden below lg: nothing to keep clear of.
      const visible = r.width > 0 && r.bottom > 0 && r.top < window.innerHeight;
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const reach = r.width / 2 + CLEARANCE;

      for (const d of dust) {
        // Distance from the logo's centre to the nearest point of the travel box.
        const dx = Math.max(d.x0 - cx, 0, cx - d.x1);
        const dy = Math.max(d.y0 - cy, 0, cy - d.y1);
        const near = visible && dx * dx + dy * dy < reach * reach;
        if (near !== d.near) {
          d.near = near;
          d.el.toggleAttribute('data-near-emblem', near);
        }
      }
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const onResize = () => {
      measureDust();
      schedule();
    };

    measureDust();
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', onResize);
      if (frame) cancelAnimationFrame(frame);
      // Leaving the page: give every sprinkle back.
      for (const d of dust) d.el.removeAttribute('data-near-emblem');
    };
  }, []);

  const src = asset('/emblem.webp');

  return (
    // The layer starts one screen above the first section, underneath the
    // mascot stage (which is opaque and paints over it). So the logo is already
    // pinned in place when the stage scrolls away, and is uncovered sitting in
    // the empty space beside the Services heading rather than rising into it.
    // overflow-x: clip keeps the glow from widening the page on narrower
    // laptops; unlike overflow: hidden it does not stop the logo sticking.
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-[-100vh] bottom-0 -z-10 hidden overflow-x-clip lg:block"
    >
      <div className="sticky top-0 flex h-screen items-center">
        <div className="shell flex justify-end">
          <div
            ref={ref}
            className="relative aspect-square w-[clamp(17rem,24vw,30rem)] animate-[emblemFloat_12s_ease-in-out_infinite]"
          >
            {/* Warm glow behind the mark, breathing slowly. */}
            <div className="absolute -inset-[22%] animate-[emblemHalo_9s_ease-in-out_infinite] rounded-full bg-[radial-gradient(closest-side,rgba(212,175,55,0.07),rgba(212,175,55,0.02)_58%,transparent)]" />

            {/* The mark itself, kept faint. */}
            <img
              src={src}
              alt=""
              width={720}
              height={720}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full opacity-[0.05] drop-shadow-[0_0_24px_rgba(212,175,55,0.22)]"
            />

            {/* Gloss: highlight and travelling sheen, clipped to the logo. */}
            <div
              className="emblem-gloss absolute inset-0 opacity-[0.08]"
              style={{ maskImage: `url(${src})`, WebkitMaskImage: `url(${src})` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
