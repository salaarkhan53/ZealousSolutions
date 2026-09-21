import { Icon } from '@/components/ui/Icon';
import { Reveal } from '@/components/ui/Reveal';
import { Section, SectionHeading } from '@/components/ui/Section';
import { industries } from '@/content/site';

export function Industries() {
  return (
    <Section id="industries" className="relative overflow-hidden">
      {/* Faint brand watermark - keeps the long scroll from flattening out. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 top-1/4 h-[420px] w-[420px] rounded-full bg-gold/5 blur-[120px]"
      />

      <SectionHeading
        number="03"
        eyebrow="Industries"
        heading="Specialists in the sectors where"
        accent="compliance is not optional."
        body="We already know the vocabulary, the regulations and the seasonal rhythms of these industries, so onboarding starts further along."
      />

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {industries.map((industry, i) => (
          <Reveal key={industry.title} index={i}>
            <article className="glass glass-hover h-full rounded-2xl p-6">
              {/* Icon beside the heading, matching the services and careers
                  card grids so all three read the same way. */}
              <div className="flex items-center gap-3">
                <Icon name={industry.icon} className="h-5 w-5 shrink-0 text-gold" />
                <h3 className="text-lg">{industry.title}</h3>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted">{industry.body}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
