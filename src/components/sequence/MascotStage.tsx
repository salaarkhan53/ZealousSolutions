'use client';

import { useScrollProgress, type ScrollProgress } from '@/lib/scrollProgress';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { FRAME_COUNT, useFrameSequence } from './useFrameSequence';
import { asset } from '@/lib/asset';

type Props = {
  /**
   * Overlay panels. Receives the stage's own scroll progress so copy can be
   * choreographed against the exact frames being drawn, rather than measuring
   * the same element twice.
   */
  children: (progress: ScrollProgress) => ReactNode;
};

/**
 * The scroll-scrubbed mascot.
 *
 * A tall wrapper provides the scroll distance; a `position: sticky` layer inside
 * it pins the canvas for the duration. Sticky does the pinning natively, which
 * avoids the layout bugs that come with JS-driven pin spacers and keeps the
 * whole thing working under static export.
 */
export function MascotStage({ children }: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { frames, ready, progress, reducedMotion } = useFrameSequence();
  const [cueVisible, setCueVisible] = useState(true);

  const scrollYProgress = useScrollProgress(wrapperRef);

  // The cue has done its job the moment the reader scrolls at all.
  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (value) =>
      setCueVisible(value < 0.02),
    );
    return unsubscribe;
  }, [scrollYProgress]);

  useEffect(() => {
    if (reducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d', { alpha: false });
    if (!context) return;

    let rafId = 0;
    let lastDrawn = -1;
    // Frames are sparse while loading; hold the last real one so a gap reads as
    // a pause rather than a flash of empty canvas.
    let lastGood: ImageBitmap | HTMLImageElement | null = null;

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(canvas.clientWidth * ratio);
      canvas.height = Math.floor(canvas.clientHeight * ratio);
      lastDrawn = -1; // force a repaint at the new size
    };

    /**
     * Manual `object-fit: cover` with a focal point.
     *
     * Landscape: anchor right, so the headline keeps the negative space the
     * source frames were composed to leave on the left.
     *
     * Portrait: right-anchoring would crop to a blown-up shoulder, so instead
     * the frame is scaled to roughly the top half and centred on the mascot
     * (~74% across the source), leaving the lower screen for the copy.
     */
    const MASCOT_FOCUS_X = 0.74;

    const draw = (frame: ImageBitmap | HTMLImageElement) => {
      const { width: cw, height: ch } = canvas;
      const fw = frame.width;
      const fh = frame.height;
      const portrait = ch > cw;

      let dw: number;
      let dh: number;
      let dx: number;
      let dy: number;

      if (portrait) {
        const scale = Math.max(cw / fw, (ch * 0.52) / fh);
        dw = fw * scale;
        dh = fh * scale;
        // Centre the mascot horizontally, then clamp so no edge pulls inside.
        dx = Math.min(0, Math.max(cw - dw, cw / 2 - dw * MASCOT_FOCUS_X));
        dy = 0;
      } else {
        const scale = Math.max(cw / fw, ch / fh);
        dw = fw * scale;
        dh = fh * scale;
        dx = cw - dw;
        dy = (ch - dh) / 2;
      }

      context.fillStyle = '#08090C';
      context.fillRect(0, 0, cw, ch);
      context.drawImage(frame, dx, dy, dw, dh);
    };

    const render = () => {
      rafId = 0;
      const index = Math.min(
        FRAME_COUNT - 1,
        Math.max(0, Math.round(scrollYProgress.get() * (FRAME_COUNT - 1))),
      );
      if (index === lastDrawn) return;

      const frame = frames[index] ?? lastGood;
      if (!frame) return;
      if (frames[index]) lastGood = frames[index];

      draw(frame);
      lastDrawn = index;
    };

    /** Coalesce scroll events into one paint per frame. */
    const schedule = () => {
      if (!rafId) rafId = requestAnimationFrame(render);
    };

    resize();
    schedule();

    const unsubscribe = scrollYProgress.on('change', schedule);
    const observer = new ResizeObserver(() => {
      resize();
      schedule();
    });
    observer.observe(canvas);

    return () => {
      unsubscribe();
      observer.disconnect();
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [frames, ready, reducedMotion, scrollYProgress]);

  return (
    <div ref={wrapperRef} className="relative h-[280vh]">
      {/* Scroll-spy sentinel, and the #about anchor target.
          The About copy lives in the pinned layer, which is on screen for the
          whole stage, so the observer would otherwise mark the nav item active
          the moment the page loads.

          These bounds are derived, not eyeballed. The observer band sits at
          45-50% of the viewport, and progress runs over (280vh - 100vh), so for
          the nav to light up exactly while the About panel is visible
          (progress 0.38 to 0.68) the sentinel has to span 42% to 60% of the
          wrapper. Retiming the panels in Hero.tsx means recomputing this. */}
      <div
        id="about"
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-[42%] h-[18%] scroll-mt-20"
      />

      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Poster: paints instantly, covers the canvas until frames arrive, and
            is the only visual under reduced motion. */}
        {/* object-position mirrors the canvas focal logic so the poster and the
            first drawn frame line up rather than jumping. */}
        <img
          src={asset('/seq/poster.webp')}
          alt=""
          aria-hidden="true"
          width={1152}
          height={648}
          className="absolute inset-0 h-full w-full object-cover object-[74%_top] portrait:h-[52%] landscape:object-right"
          fetchPriority="high"
        />

        {!reducedMotion && (
          <canvas
            ref={canvasRef}
            aria-hidden="true"
            className="absolute inset-0 h-full w-full transition-opacity duration-700"
            style={{ opacity: ready ? 1 : 0 }}
          />
        )}

        {/* Darkens the left side so headline copy always clears contrast,
            whatever the mascot is doing behind it. Explicit stops rather than a
            midpoint, so the scrim stays solid past the text column and the
            mascot's raised hand doesn't read through the headline. */}
        {/* Landscape: scrim from the left, behind the headline column. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 hidden landscape:block"
          style={{
            backgroundImage:
              'linear-gradient(to right, #08090C 0%, #08090C 34%, rgba(8,9,12,0.82) 52%, rgba(8,9,12,0.35) 70%, transparent 84%)',
          }}
        />
        {/* Portrait: the mascot sits in the top band, so the scrim runs upward
            from the bottom where the copy lives. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 portrait:block landscape:hidden"
          style={{
            backgroundImage:
              'linear-gradient(to bottom, rgba(8,9,12,0.35) 0%, rgba(8,9,12,0.55) 28%, rgba(8,9,12,0.92) 44%, #08090C 56%)',
          }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-night to-transparent"
        />

        {/* A pool of warm light sitting over the scrim on the mascot's side.
            The render carries its own rim light; this deepens it and stops the
            right half reading as flat black behind the figure. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-1/2 hidden h-[62vh] w-[52vw] -translate-y-1/2 animate-[emberDrift_14s_ease-in-out_infinite] rounded-full bg-[radial-gradient(closest-side,rgba(212,175,55,0.16),rgba(212,175,55,0.05)_55%,transparent)] blur-[70px] landscape:block"
        />

        {children(scrollYProgress)}

        {/* Scroll cue. This page reveals itself by scrolling, so the invitation
            is worth making explicit. It fades out as soon as the reader starts.
            Centred on the page, and stacked so it reads as a vertical cue. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 transition-opacity duration-500 landscape:flex short:hidden"
          style={{ opacity: cueVisible ? 1 : 0 }}
        >
          <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-muted/70">
            Scroll
          </span>
          <span className="relative h-8 w-px overflow-hidden bg-white/10">
            <span className="absolute inset-x-0 top-0 h-3 animate-[scrollCue_2.2s_ease-in-out_infinite] bg-gold" />
          </span>
        </div>

        {/* Loading hairline - only while the sequence is still streaming. */}
        {!reducedMotion && progress < 1 && (
          <div
            aria-hidden="true"
            className="absolute bottom-0 left-0 h-px bg-gold/70 transition-[width] duration-300"
            style={{ width: `${progress * 100}%` }}
          />
        )}
      </div>
    </div>
  );
}
