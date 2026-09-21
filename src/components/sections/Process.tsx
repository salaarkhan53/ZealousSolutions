import { Reveal } from '@/components/ui/Reveal';
import { Section, SectionHeading } from '@/components/ui/Section';
import { process } from '@/content/site';

export function Process() {
  return (
    <Section id="process">
      <SectionHeading
        eyebrow={process.eyebrow}
        heading={process.heading}
        body="No long discovery phase billed by the hour. Four stages, each with something you can see at the end of it."
      />

      <ol className="relative mt-12 grid gap-10 md:grid-cols-4 md:gap-6">
        {/* Connector line, desktop only - it would read as clutter stacked. */}
        <span
          aria-hidden="true"
          className="absolute left-0 right-0 top-6 hidden h-px gold-rule md:block"
        />

        {process.steps.map((step, i) => (
          <Reveal key={step.title} index={i}>
            <li className="relative">
              <div className="grid h-12 w-12 place-items-center rounded-full border border-gold/30 bg-night font-display text-sm font-bold text-gold">
                {String(i + 1).padStart(2, '0')}
              </div>
              <h3 className="mt-5 text-lg">{step.title}</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-muted">{step.body}</p>
            </li>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}
