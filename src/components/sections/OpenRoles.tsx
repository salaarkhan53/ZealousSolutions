import { ArrowRight, MapPin } from 'lucide-react';
import Link from 'next/link';
import { Reveal } from '@/components/ui/Reveal';
import { Section, SectionHeading } from '@/components/ui/Section';
import { careers } from '@/content/site';

/**
 * The vacancy list. "Apply now" carries the role through to the application
 * page as a query parameter, which pre-selects the position there.
 */
export function OpenRoles() {
  return (
    <Section id="roles" className="border-t border-white/5 bg-surface/30">
      <SectionHeading
        eyebrow="Open roles"
        heading="We are hiring for"
        accent="two positions."
      />

      <div className="mt-10 grid gap-5 lg:grid-cols-2">
        {careers.openRoles.map((role, i) => (
          <Reveal key={role.id} index={i}>
            <article
              id={role.id}
              className="glass glass-hover flex h-full flex-col rounded-2xl p-7 sm:p-8"
            >
              <div className="flex flex-wrap items-center gap-2.5 text-xs text-muted">
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-gold" strokeWidth={1.5} />
                  {role.location}
                </span>
                <span className="rounded-full border border-gold/25 px-3 py-1">{role.type}</span>
              </div>

              <h3 className="mt-4 text-xl sm:text-2xl">{role.title}</h3>
              <p className="body-copy mt-3 text-sm leading-relaxed text-muted">{role.summary}</p>

              {/* mt-auto keeps both cards' buttons aligned when the role
                  descriptions differ in length. */}
              <Link
                href={`/careers/apply/?role=${role.id}`}
                prefetch={false}
                className="group mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full btn-gold px-7 py-3.5 text-sm font-semibold tracking-wide"
              >
                Apply now
                <ArrowRight
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                  strokeWidth={2}
                />
              </Link>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
