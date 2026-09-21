import { Mail, MapPin, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { company, contact, nav, socials } from '@/content/site';
import { LocalTime } from './LocalTime';
import { SocialIcon } from './SocialIcon';
import { asset } from '@/lib/asset';

/**
 * The footer is built as an operations readout rather than a sitemap: a
 * transmission line across the top, a live clock at the office, and contact
 * details set as terminal-style rows. For a contact centre, "the lines are
 * open and someone is there" is the thing worth saying at the end of the page.
 *
 * Deliberately shallow - one band plus a legal strip, no tall link columns.
 */
export function Footer() {
  const year = new Date().getFullYear();

  const contactRows = [
    {
      icon: Mail,
      label: 'Email',
      value: contact.email,
      href: `mailto:${contact.email}`,
      external: false,
    },
    {
      icon: MessageCircle,
      label: 'WhatsApp',
      value: contact.whatsappDisplay,
      href: `https://wa.me/${contact.whatsapp}`,
      external: true,
    },
  ];

  return (
    <footer className="relative z-10 overflow-hidden border-t border-gold/20 bg-[#0b0d11]">
      {/* Transmission line: a pulse travelling the width of the page. The
          company's business is keeping lines open, so the one animated element
          down here is a signal moving along a wire. */}
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px overflow-hidden">
        <div className="h-full w-1/4 animate-[signalSweep_7s_linear_infinite] bg-gradient-to-r from-transparent via-gold to-transparent" />
      </div>

      {/* Faint scanlines, for the sense of a lit panel rather than flat paint. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.55]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(to bottom, rgba(212,175,55,0.035) 0px, rgba(212,175,55,0.035) 1px, transparent 1px, transparent 4px)',
        }}
      />

      <div className="relative mx-auto w-full max-w-6xl px-5 sm:px-8">
        <div className="grid gap-6 py-8 lg:grid-cols-[auto_1fr] lg:gap-14 lg:py-9">
          {/* Identity and status */}
          <div className="flex flex-col gap-4">
            <span className="flex items-center gap-3">
              <img src={asset('/symbol.png')} alt="" aria-hidden="true" width={36} height={36} loading="lazy" decoding="async" className="h-9 w-9" />
              <span className="flex flex-col leading-none">
                <span className="gold-text font-display text-[14px] font-extrabold tracking-[0.16em]">
                  ZEALOUS
                </span>
                <span className="mt-1 text-[10px] font-semibold tracking-[0.34em] text-muted">
                  SOLUTIONS
                </span>
              </span>
            </span>

            {/* A real readout, not an ornament: the reader's own local time,
                so the page ends on something live rather than decorative. */}
            <p className="inline-flex w-fit items-center gap-2.5 rounded-full border border-gold/20 bg-gold/[0.05] py-1.5 pl-3 pr-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 shrink-0 rounded-full bg-gold shadow-[0_0_6px] shadow-gold/70"
              />
              <LocalTime />
            </p>
          </div>

          {/* Navigation and contact, stacked tight rather than in tall columns */}
          <div className="flex flex-col gap-4 lg:items-end">
            <nav aria-label="Footer">
              <ul className="flex flex-wrap items-center gap-x-5 gap-y-0.5 lg:gap-x-4 lg:justify-end">
                {nav.map((item, i) => (
                  <li key={item.href} className="flex items-center">
                    {i > 0 && (
                      <span
                        aria-hidden="true"
                        className="mr-4 hidden h-3 w-px bg-gold/20 lg:block"
                      />
                    )}
                    <Link
                      prefetch={false}
                      href={item.href}
                      className="block py-1.5 text-sm text-muted transition-colors hover:text-gold"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
                <li className="flex items-center">
                  <span
                    aria-hidden="true"
                    className="mr-4 hidden h-3 w-px bg-gold/20 lg:block"
                  />
                  <Link
                    prefetch={false}
                    href="/#book"
                    className="block py-1.5 text-sm text-gold transition-opacity hover:opacity-75"
                  >
                    Book Appointment
                  </Link>
                </li>
              </ul>
            </nav>

            <ul className="flex flex-col gap-0.5 text-sm sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6 lg:justify-end">
              {contactRows.map(({ icon: Icon, label, value, href, external }) => (
                <li key={label}>
                  <a
                    href={href}
                    {...(external
                      ? { target: '_blank', rel: 'noopener noreferrer' }
                      : {})}
                    className="group inline-flex items-center gap-2.5 py-1.5 text-muted transition-colors hover:text-ink"
                  >
                    <Icon
                      className="h-3.5 w-3.5 shrink-0 text-gold"
                      strokeWidth={1.5}
                      aria-hidden="true"
                    />
                    <span className="sr-only">{label}: </span>
                    {value}
                  </a>
                </li>
              ))}
              <li className="flex items-start gap-2.5 text-muted sm:items-center">
                <MapPin
                  className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold sm:mt-0"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
                <address className="not-italic">{contact.addressLine}</address>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal strip */}
        <div className="flex flex-col gap-3 border-t border-white/[0.06] pb-10 pt-3 sm:pb-4 text-xs text-muted sm:flex-row sm:items-center sm:justify-between sm:pb-4">
          <p>
            © {year} {company.legalName}. All rights reserved.
          </p>

          <div className="flex items-center gap-4">
            {/* Renders only for profiles listed in content/site.ts. */}
            {socials.map((social) => (
              <a
                key={social.href}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Zealous Solutions on ${social.label}`}
                className="grid h-9 w-9 place-items-center rounded-full border border-gold/20 text-muted transition-colors hover:border-gold/60 hover:text-gold"
              >
                <SocialIcon name={social.icon} />
              </a>
            ))}
            {socials.length > 0 && (
              <span aria-hidden="true" className="h-4 w-px bg-white/10" />
            )}
            <Link
              prefetch={false}
              href="/privacy"
              className="-mx-2 px-2 py-1.5 transition-colors hover:text-gold sm:mx-0 sm:px-0"
            >
              Privacy
            </Link>
            <Link
              prefetch={false}
              href="/terms"
              className="-mx-2 px-2 py-1.5 transition-colors hover:text-gold sm:mx-0 sm:px-0"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
