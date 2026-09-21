'use client';

import { useEffect, useRef, useState } from 'react';
import { asset } from '@/lib/asset';

/** Must match TARGET_FRAMES in scripts/build-sequence.mjs. */
export const FRAME_COUNT = 160;

/** Frames decoded before scrubbing engages; the poster covers the gap. */
const EAGER_FRAMES = 24;

/** Parallel decodes. Enough to saturate a connection, few enough to stay responsive. */
const CONCURRENCY = 6;

type Ladder = 'd' | 'm';

export type FrameSequence = {
  /** Decoded frames, sparse while loading. */
  frames: (ImageBitmap | HTMLImageElement | null)[];
  /** True once enough frames exist to scrub without visible gaps. */
  ready: boolean;
  /** 0-1, drives the loading hairline. */
  progress: number;
  /** True when reduced motion is requested - nothing is fetched. */
  reducedMotion: boolean;
};

const frameSrc = (ladder: Ladder, index: number) =>
  asset(`/seq/${ladder}/${String(index + 1).padStart(4, '0')}.webp`);

/**
 * `createImageBitmap` gives the compositor a ready-to-draw surface, which keeps
 * scrubbing smooth. Safari only gained it recently, so fall back to an <img>,
 * which canvas can draw from just as well.
 */
async function decode(src: string): Promise<ImageBitmap | HTMLImageElement> {
  if (typeof createImageBitmap === 'function') {
    const response = await fetch(src);
    if (!response.ok) throw new Error(`Failed to load ${src}`);
    return createImageBitmap(await response.blob());
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load ${src}`));
    img.src = src;
  });
}

/**
 * Loads the mascot frame sequence for the current viewport.
 *
 * Only one ladder is ever fetched: phones take the 640w set (~1.2 MB) and never
 * touch the 1152w set. The poster paints immediately, scrubbing engages after
 * the first frames land, and the remainder streams in behind it - so a slow
 * connection degrades to a still rather than a blank hero.
 */
export function useFrameSequence(): FrameSequence {
  const [ready, setReady] = useState(false);
  const [progress, setProgress] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const framesRef = useRef<(ImageBitmap | HTMLImageElement | null)[]>(
    new Array(FRAME_COUNT).fill(null),
  );

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (motionQuery.matches) {
      setReducedMotion(true);
      return;
    }

    // Decided once at mount. Rotating a phone shouldn't trigger a second download.
    const ladder: Ladder = window.matchMedia('(min-width: 768px)').matches ? 'd' : 'm';

    let cancelled = false;
    let loaded = 0;
    let cursor = 0;

    /** Pulls from the shared cursor until it passes `until`. */
    const pull = async (until: number): Promise<void> => {
      while (!cancelled) {
        const index = cursor++;
        if (index >= until) return;

        try {
          const bitmap = await decode(frameSrc(ladder, index));
          if (cancelled) {
            if ('close' in bitmap) bitmap.close();
            return;
          }
          framesRef.current[index] = bitmap;
        } catch {
          // A dropped frame is survivable: the canvas holds the previous one,
          // so a failed fetch reads as a brief pause rather than a blank screen.
        }

        loaded += 1;
        setProgress(loaded / FRAME_COUNT);
      }
    };

    // Two passes: get the opening frames down fast so the hero can start
    // scrubbing, then open up to full concurrency for the remainder.
    (async () => {
      await Promise.all(Array.from({ length: 3 }, () => pull(EAGER_FRAMES)));
      if (cancelled) return;
      setReady(true);
      await Promise.all(Array.from({ length: CONCURRENCY }, () => pull(FRAME_COUNT)));
    })();

    return () => {
      cancelled = true;
      for (const frame of framesRef.current) {
        if (frame && 'close' in frame) frame.close();
      }
      framesRef.current = new Array(FRAME_COUNT).fill(null);
    };
  }, []);

  return { frames: framesRef.current, ready, progress, reducedMotion };
}
