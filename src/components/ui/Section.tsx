import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { Reveal } from './Reveal';

export function Section({
  id,
  className,
  children,
}: {
  id?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      // scroll-mt clears the fixed header when an anchor link lands here.
      className={cn('scroll-mt-20 py-14 md:py-[4.5rem]', className)}
    >
      {/* Padding sits inside the max-width, matching the header and footer, so
          every region on the page shares one left edge. */}
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">{children}</div>
    </section>
  );
}

/**
 * The repeated section opener, set as a running head.
 *
 * A rule carries the section label at one end and its index at the other, the
 * way a chapter head runs across a printed page. The heading then takes the
 * full measure beneath it and the standfirst sits under that.
 *
 * This replaces an earlier heading-left / body-right split. That split read as
 * the same gesture four times over, and it squeezed the standfirst into a
 * column too narrow to set justified without opening gaps between words.
 */
export function SectionHeading({
  number,
  eyebrow,
  heading,
  accent,
  body,
  align = 'left',
}: {
  number?: string;
  eyebrow: string;
  heading: string;
  accent?: string;
  body?: string;
  align?: 'left' | 'center';
}) {
  const centered = align === 'center';

  return (
    <Reveal className={cn(centered && 'mx-auto max-w-3xl text-center')}>
      {/* Running head. The rule fades as it travels, so the label anchors the
          left edge and the index sits quietly at the far end. */}
      <div className="flex items-center gap-4 sm:gap-6">
        {centered && (
          <span
            aria-hidden="true"
            className="h-px flex-1 bg-gradient-to-l from-gold/35 to-transparent"
          />
        )}

        <p className="shrink-0 text-[11px] font-semibold uppercase tracking-[0.32em] text-gold sm:text-xs">
          {eyebrow}
        </p>

        <span
          aria-hidden="true"
          className="h-px flex-1 bg-gradient-to-r from-gold/35 to-transparent"
        />

        {number && !centered && (
          <span
            aria-hidden="true"
            className="shrink-0 font-display text-[11px] font-bold tabular-nums tracking-[0.2em] text-gold/45"
          >
            {number}
          </span>
        )}
      </div>

      <h2
        className={cn(
          'mt-7 text-[2rem] leading-[1.08] sm:text-[2.6rem] md:text-[3rem]',
          centered ? 'mx-auto' : 'max-w-4xl',
        )}
      >
        {heading}
        {accent && <span className="gold-text"> {accent}</span>}
      </h2>

      {body && (
        <p
          // Set ragged-right. A standfirst is only two or three lines, so
          // justification has too few lines to even out and just leaves gaps
          // across the first one.
          className={cn(
            'mt-5 max-w-2xl text-base leading-relaxed text-muted',
            centered && 'mx-auto',
          )}
        >
          {body}
        </p>
      )}
    </Reveal>
  );
}
