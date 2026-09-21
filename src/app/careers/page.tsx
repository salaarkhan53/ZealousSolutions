import { ArrowRight } from 'lucide-react';
import { pageMeta } from '@/lib/metadata';
import { OpenRoles } from '@/components/sections/OpenRoles';
import { SectionDivider } from '@/components/ui/SectionDivider';
import { Icon } from '@/components/ui/Icon';
import { Reveal } from '@/components/ui/Reveal';
import { Section } from '@/components/ui/Section';
import { careers, company, contact } from '@/content/site';
import { asset } from '@/lib/asset';

export const metadata = pageMeta({
  title: 'Careers',
  description:
    'Join Zealous Solutions. Paid training, real progression and international client exposure for customer support, sales and marketing professionals.',
  path: '/careers/',
});

/**
 * One JobPosting per vacancy. This is what puts the roles into Google Jobs,
 * which is free, high-intent traffic for exactly what this page is for.
 * `datePosted` is required; update it when a role is re-opened.
 */
const jobPostings = careers.openRoles.map((role) => ({
  '@context': 'https://schema.org',
  '@type': 'JobPosting',
  title: role.title,
  description: `<p>${role.summary}</p><ul>${role.requirements
    .map((r) => `<li>${r}</li>`)
    .join('')}</ul>`,
  datePosted: '2026-09-21',
  employmentType: 'FULL_TIME',
  hiringOrganization: {
    '@type': 'Organization',
    name: company.legalName,
    sameAs: company.url,
    logo: `${company.url}/logo@2x.png`,
  },
  jobLocation: {
    '@type': 'Place',
    address: {
      '@type': 'PostalAddress',
      streetAddress: contact.address.street,
      addressLocality: contact.address.city,
      addressRegion: contact.address.region,
      postalCode: contact.address.postalCode,
      addressCountry: contact.address.country,
    },
  },
  directApply: true,
  url: `${company.url}/careers/apply/?role=${role.id}`,
}));

export default function CareersPage() {
  return (
    <>
      <script
        type="application/ld+json"
        // Static, author-controlled JSON - no user input reaches this.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jobPostings) }}
      />
      <section className="relative flex min-h-[62vh] items-center overflow-hidden pt-20 landscape:min-h-[78vh]">
        {/* Purpose-shot mascot for this page: the same composition as the
            homepage frames, with copy sitting in the left-hand negative space. */}
        <img
          src={asset('/careers-hero.webp')}
          srcSet={`${asset('/careers-hero-sm.webp')} 800w, ${asset('/careers-hero.webp')} 1600w`}
          sizes="100vw"
          alt=""
          aria-hidden="true"
          width={1600}
          height={900}
          // Anchored high so the crop takes from the foot rather than slicing
          // the mascot's head off against the top edge.
          className="absolute inset-0 h-full w-full object-cover object-[72%_22%] portrait:h-[46%] portrait:object-top"
          fetchPriority="high"
        />

        {/* The header is transparent until you scroll, and the mascot reaches
            the top edge here. This keeps the nav legible over it. */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-night/85 to-transparent"
        />

        {/* Landscape: scrim from the left, behind the copy column. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 hidden landscape:block"
          style={{
            backgroundImage:
              'linear-gradient(to right, #08090C 0%, #08090C 32%, rgba(8,9,12,0.82) 50%, rgba(8,9,12,0.3) 70%, transparent 86%)',
          }}
        />
        {/* Portrait: the mascot sits up top, so the scrim rises from the foot. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 portrait:block landscape:hidden"
          style={{
            backgroundImage:
              'linear-gradient(to bottom, rgba(8,9,12,0.3) 0%, rgba(8,9,12,0.55) 30%, rgba(8,9,12,0.92) 46%, #08090C 58%)',
          }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-night to-transparent"
        />

        <div className="relative mx-auto flex w-full max-w-6xl flex-col justify-end px-5 pb-6 pt-16 sm:px-8 landscape:justify-center landscape:py-16">
          <div className="max-w-xl">
            <p className="flex items-center gap-4 text-xs font-semibold uppercase tracking-[0.28em] text-gold">
              <span aria-hidden="true" className="h-px w-10 bg-gold/60" />
              {careers.eyebrow}
            </p>
            <h1 className="mt-5 text-[2.2rem] leading-[1.05] sm:text-5xl lg:text-6xl">
              <span className="block">{careers.heading.lead}</span>
              <span className="mt-1 block gold-text">{careers.heading.accent}</span>
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-muted sm:text-lg">
              {careers.subline}
            </p>

            {/* Scrolls to the vacancies rather than jumping straight into the
                form: a visitor should see the roles before applying to one. */}
            <a
              href="#roles"
              className="group mt-8 inline-flex items-center justify-center gap-2 rounded-full btn-gold px-8 py-4 text-sm font-semibold tracking-wide"
            >
              Apply now
              <ArrowRight
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                strokeWidth={2}
              />
            </a>
          </div>
        </div>
      </section>

      <Section>
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <div className="lg:sticky lg:top-28">
              <Reveal>
                <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.25em] text-gold">
                  <span aria-hidden="true" className="h-px w-8 gold-rule" />
                  Why Zealous
                </p>
                <h2 className="mt-5 text-3xl leading-[1.15] sm:text-4xl">
                  {careers.intro.heading}
                </h2>
                <p className="body-copy mt-5 text-base leading-relaxed text-muted">
                  {careers.intro.body}
                </p>
              </Reveal>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {careers.benefits.map((benefit, i) => (
              <Reveal key={benefit.title} index={i}>
                <article className="glass glass-hover h-full rounded-2xl p-6">
                  <div className="flex items-center gap-3">
                    <Icon name={benefit.icon} className="h-5 w-5 shrink-0 text-gold" />
                    <h3 className="text-base">{benefit.title}</h3>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{benefit.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      <SectionDivider />
      <OpenRoles />
    </>
  );
}
