import { Reveal } from '@/components/ui/Reveal';
import { Section } from '@/components/ui/Section';
import { whyUs } from '@/content/site';

export function WhyUs() {
  return (
    <Section className="border-y border-white/5 bg-surface/30">
      <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <Reveal>
          <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.25em] text-gold">
            <span aria-hidden="true" className="h-px w-8 gold-rule" />
            {whyUs.eyebrow}
          </p>
          <h2 className="mt-5 text-3xl leading-[1.15] sm:text-4xl">{whyUs.heading}</h2>
          <p className="body-copy mt-5 text-base leading-relaxed text-muted">{whyUs.body}</p>
        </Reveal>

        <div className="grid gap-x-8 gap-y-9 sm:grid-cols-2">
          {whyUs.points.map((point, i) => (
            <Reveal key={point.title} index={i}>
              <div className="border-l border-gold/25 pl-5">
                <h3 className="text-base">{point.title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-muted">{point.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}
