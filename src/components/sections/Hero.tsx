'use client';

import { ArrowRight } from 'lucide-react';
import type { ScrollProgress } from '@/lib/scrollProgress';
import { StagePanel } from '@/components/sequence/StagePanel';
import { Icon } from '@/components/ui/Icon';
import { about, hero, services } from '@/content/site';
import { cn } from '@/lib/cn';

/**
 * Choreography for the three copy panels, matched to the mascot's poses:
 * waving (hero), pointing (about), presenting with open hands (services).
 *
 * Defined at module scope so the panels' scroll subscriptions are set up once
 * rather than re-created on every render.
 */
// The hero holds noticeably longer than it used to: the capability strip sits
// at the foot of the panel, and the old timing faded it out before a visitor
// had scrolled far enough to read it.
const HERO = {
  fade: { stops: [0.22, 0.32], values: [1, 0] },
  lift: { stops: [0, 0.32], values: [0, -50] },
};

const ABOUT = {
  fade: { stops: [0.38, 0.46, 0.6, 0.68], values: [0, 1, 1, 0] },
  lift: { stops: [0.38, 0.68], values: [40, -40] },
};

const SERVICES = {
  fade: { stops: [0.74, 0.82, 0.96, 1], values: [0, 1, 1, 0.9] },
  lift: { stops: [0.74, 1], values: [40, -10] },
};

export function StageOverlays({ progress }: { progress: ScrollProgress }) {
  return (
    <div className="pointer-events-none absolute inset-0">
      {/* Panel 1 - Hero */}
      <StagePanel
        progress={progress}
        fade={HERO.fade}
        lift={HERO.lift}
        // Portrait keeps the copy in the lower half, clear of the mascot band.
        className="absolute inset-0 flex items-end pb-10 landscape:items-center landscape:pb-0 short:items-start"
      >
        <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
          {/* Wide enough to keep "Stronger Business" on one line from sm up,
              matching the approved hero composition. */}
          {/* The eyebrow rail that used to sit above this was removed: on
              shorter viewports it collided with the fixed header, and dropping
              it lets the whole panel fit on screen without scrolling. */}
          <div className="max-w-[40rem] landscape:pb-10 landscape:pt-24 short:pb-0 short:pt-[5.5rem]">
            {/* The label used to be caps text behind a leading rule, which put
                its optical left edge a few pixels outside the headline's. As a
                self-contained badge it starts exactly on the same margin. */}
            <p className="inline-flex items-center gap-2.5 rounded-full border border-gold/25 bg-gold/[0.06] py-1.5 pl-3 pr-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold backdrop-blur-sm">
              {/* A plain mark, not a pulsing one: this is a label, not a live
                  status, and the page already has the scroll cue in motion. */}
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 rounded-full bg-gold shadow-[0_0_6px] shadow-gold/70"
              />
              {hero.label}
            </p>

            {/* Sized against viewport height as well as width: on a short,
                wide window the height term takes over and keeps the whole
                panel, capability strip included, above the fold. */}
            <h1 className="mt-6 text-[clamp(2rem,min(4.6vw,8.2vh),4.1rem)] leading-[1.05]">
              <span className="block text-balance">{hero.headline.lead}</span>
              {/* nowrap only from sm up - at 390px it would run off-screen. */}
              <span className="mt-1 block gold-text sm:whitespace-nowrap">
                {hero.headline.accent}
              </span>
            </h1>

            <p className="mt-5 max-w-md text-[clamp(0.95rem,min(1.2vw,2.1vh),1.125rem)] leading-relaxed text-muted">
              {hero.subline}
            </p>

            <div className="pointer-events-auto mt-8">
              <a
                href={hero.cta.href}
                className="group inline-flex items-center justify-center gap-2 rounded-full btn-gold px-8 py-4 text-sm font-semibold tracking-wide"
              >
                {hero.cta.label}
                <ArrowRight
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                  strokeWidth={2}
                />
              </a>
            </div>

            {/* Four-item capability strip from the mockup, now sitting under a
                hairline so it reads as a footer to the panel rather than
                another stack of content. Bottom padding keeps the fixed
                WhatsApp button off the last item. */}
            <div className="mt-8 max-w-lg border-t border-gold/15 pt-6 landscape:mt-9 short:hidden">
              <ul className="grid grid-cols-2 gap-x-6 gap-y-6 pb-12 sm:grid-cols-4 sm:gap-x-0 landscape:pb-0">
                {hero.strip.map((item, i) => (
                  <li
                    key={item.label}
                    className={cn(
                      'flex flex-col items-center gap-2 text-center sm:items-start sm:text-left',
                      i > 0 && 'sm:border-l sm:border-gold/12 sm:pl-5',
                    )}
                  >
                    <Icon name={item.icon} className="h-[1.15rem] w-[1.15rem] text-gold" />
                    <p className="whitespace-pre-line text-[11px] leading-snug tracking-wide text-muted">
                      {item.label}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </StagePanel>

      {/* Panel 2 - Who we are. The #about id lives on a sentinel in
          MascotStage, not here; see the note there. */}
      <StagePanel
        as="section"
        aria-label={about.eyebrow}
        progress={progress}
        fade={ABOUT.fade}
        lift={ABOUT.lift}
        className="absolute inset-0 flex items-end pb-20 landscape:items-center landscape:pb-0 short:items-start short:pb-0"
      >
        <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
          <div className="max-w-xl landscape:pt-20 short:pt-[5.5rem]">
            <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.25em] text-gold">
              <span aria-hidden="true" className="tabular-nums opacity-60">
                01
              </span>
              <span aria-hidden="true" className="h-px w-8 bg-gold/50" />
              {about.eyebrow}
            </p>
            <h2 className="mt-5 text-[1.75rem] leading-[1.15] sm:text-[2.1rem] lg:text-[2.6rem]">
              {about.heading}
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-muted sm:text-base">
              {about.lead}
            </p>

            {/* Three pillars instead of two paragraphs. This panel is read
                while scrolling past, so it has to be scannable rather than
                complete. */}
            <ul className="mt-6 space-y-4 border-t border-gold/15 pt-6 short:mt-3 short:space-y-2 short:pt-3">
              {about.pillars.map((pillar) => (
                <li key={pillar.title} className="flex gap-4">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-gold/25 bg-gold/[0.06]">
                    <Icon name={pillar.icon} className="h-[1.05rem] w-[1.05rem] text-gold" />
                  </span>
                  <span className="pt-0.5">
                    <span className="block text-sm font-semibold text-ink">{pillar.title}</span>
                    <span className="mt-0.5 block text-sm leading-relaxed text-muted">
                      {pillar.body}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </StagePanel>

      {/* Panel 3 - Services intro */}
      <StagePanel
        progress={progress}
        fade={SERVICES.fade}
        lift={SERVICES.lift}
        className="absolute inset-0 flex items-end pb-20 landscape:items-center landscape:pb-0 short:items-start short:pb-0"
      >
        <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
          <div className="max-w-lg landscape:pt-20 short:pt-[5.5rem]">
            <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.25em] text-gold">
              <span aria-hidden="true" className="tabular-nums opacity-60">
                02
              </span>
              <span aria-hidden="true" className="h-px w-8 bg-gold/50" />
              What We Do
            </p>
            <h2 className="mt-5 text-[1.9rem] leading-[1.15] sm:text-4xl lg:text-5xl">
              Four services, <span className="gold-text">one accountable team.</span>
            </h2>
            <p className="body-copy mt-5 text-sm leading-relaxed text-muted sm:text-base">
              Take one or take all four. They are run by the same people, to the same standard,
              reporting into the same numbers.
            </p>
            {/* Two per row rather than wrapping 3-then-1, so the four services
                read as two even pairs.

                pointer-events-auto because the panel above sets
                pointer-events-none, and each chip jumps to its own card in the
                Services section below - which is what earns the hover state. */}
            {/* One per row on phones: at 14px the icon and label together
                  overflow a half-width chip and wrap to two ragged lines. */}
            <ul className="pointer-events-auto mt-8 grid max-w-md grid-cols-1 gap-2.5 sm:grid-cols-2">
              {services.map((service) => (
                <li key={service.id}>
                  <a
                    href={`#${service.id}`}
                    className="group flex items-center gap-2.5 rounded-full border border-gold/25 px-4 py-2.5 text-sm text-ink/90 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:border-gold/70 hover:bg-gold/10 hover:text-ink hover:shadow-[0_8px_24px_-12px] hover:shadow-gold/50"
                  >
                    <Icon
                      name={service.icon}
                      className="h-4 w-4 shrink-0 text-gold transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
                    />
                    {service.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </StagePanel>
    </div>
  );
}
