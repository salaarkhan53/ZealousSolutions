'use client';

import type { ScrollProgress } from '@/lib/scrollProgress';
import { useEffect, useRef, type ReactNode } from 'react';

/**
 * Linear interpolation across a piecewise ramp, clamped at both ends.
 * `stops` must be ascending and the same length as `values`.
 */
function ramp(input: number, stops: number[], values: number[]): number {
  if (input <= stops[0]) return values[0];
  const last = stops.length - 1;
  if (input >= stops[last]) return values[last];

  for (let i = 0; i < last; i++) {
    const from = stops[i];
    const to = stops[i + 1];
    if (input <= to) {
      const t = (input - from) / (to - from);
      return values[i] + (values[i + 1] - values[i]) * t;
    }
  }
  return values[last];
}

type Props = {
  progress: ScrollProgress;
  /** Opacity ramp: scroll stops and the opacity at each. */
  fade: { stops: number[]; values: number[] };
  /** translateY ramp in pixels, over the same progress axis. */
  lift: { stops: number[]; values: number[] };
  className?: string;
  as?: 'div' | 'section';
  'aria-label'?: string;
  children: ReactNode;
};

/**
 * A copy panel cross-fading over the pinned mascot.
 *
 * Styles are written straight to the node on each progress change, which is
 * also how the canvas beside it paints. Nothing here goes through React state:
 * these values update on every scroll frame and a render per frame would be
 * wasted work.
 */
export function StagePanel({
  progress,
  fade,
  lift,
  className,
  as: Tag = 'div',
  children,
  ...rest
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  // The panel's state at the top of the page, written into the server HTML.
  // Without it every panel was fully visible until the scripts loaded and ran
  // the effect below, so on a cold load the three panels' copy sat stacked on
  // top of each other for a few seconds. Computed at progress 0 rather than
  // from progress.get() so server and client render the same markup; if the
  // page is reloaded mid-scroll, the effect corrects it on its first run.
  const initialOpacity = ramp(0, fade.stops, fade.values);
  const initialStyle = {
    opacity: initialOpacity,
    transform: `translate3d(0, ${ramp(0, lift.stops, lift.values)}px, 0)`,
    visibility: initialOpacity < 0.02 ? 'hidden' : 'visible',
  } as const;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const apply = (value: number) => {
      const opacity = ramp(value, fade.stops, fade.values);
      el.style.opacity = String(opacity);
      el.style.transform = `translate3d(0, ${ramp(value, lift.stops, lift.values)}px, 0)`;
      // Keeps faded-out panels out of the tab order and off the a11y tree,
      // so the hero's CTA isn't focusable while the About copy is showing.
      el.style.visibility = opacity < 0.02 ? 'hidden' : 'visible';
    };

    apply(progress.get());
    return progress.on('change', apply);
  }, [progress, fade, lift]);

  return (
    <Tag ref={ref as never} className={className} style={initialStyle} {...rest}>
      {children}
    </Tag>
  );
}
