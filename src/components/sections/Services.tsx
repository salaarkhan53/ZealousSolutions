import { Check } from 'lucide-react';
import { Icon } from '@/components/ui/Icon';
import { Reveal } from '@/components/ui/Reveal';
import { Section, SectionHeading } from '@/components/ui/Section';
import { services } from '@/content/site';

export function Services() {
  return (
    <Section id="services">
      <SectionHeading
        number="02"
        eyebrow="Our Services"
        heading="Everything your customers touch,"
        accent="handled properly."
        body="Four disciplines that work as one operation, so nothing falls between the team that generates the lead and the team that answers the phone."
      />

      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {services.map((service, i) => (
          <Reveal key={service.id} index={i}>
            <article
              id={service.id}
              className="glass glass-hover h-full scroll-mt-28 rounded-2xl p-7 sm:p-8"
            >
              {/* Icon and title share a line: the mark labels the heading
                  rather than floating above it as a separate element. */}
              <div className="flex items-center gap-4">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-gold/25 bg-gold/5">
                  <Icon name={service.icon} className="h-[1.35rem] w-[1.35rem] text-gold" />
                </div>
                <h3 className="text-xl sm:text-2xl">{service.title}</h3>
              </div>

              <p className="body-copy mt-4 text-sm leading-relaxed text-muted">{service.summary}</p>

              <ul className="mt-4 space-y-3 border-t border-white/5 pt-4">
                {service.points.map((point) => (
                  <li key={point} className="flex gap-3 text-sm text-ink/80">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold" strokeWidth={2} />
                    {point}
                  </li>
                ))}
              </ul>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
