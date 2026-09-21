import { Clock, Mail, MapPin, MessageCircle } from 'lucide-react';
import { BookingForm } from '@/components/forms/BookingForm';
import { Reveal } from '@/components/ui/Reveal';
import { Section } from '@/components/ui/Section';
import { booking, contact } from '@/content/site';

// The section deliberately has no `overflow-hidden`: that would make it the
// sticky column's scroll container and stop it pinning. The decorative blur is
// clipped by its own wrapper instead.
export function BookSection() {
  return (
    <Section id="book" className="relative border-t border-white/5">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 top-1/3 h-[420px] w-[420px] rounded-full bg-gold/5 blur-[130px]" />
      </div>

      <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
        <div>
          {/* Pinned while the form scrolls past it. top-28 clears the header. */}
          <div className="lg:sticky lg:top-28">
        <Reveal>
          <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.25em] text-gold">
            <span aria-hidden="true" className="tabular-nums opacity-60">
              04
            </span>
            <span aria-hidden="true" className="h-px w-8 gold-rule" />
            {booking.eyebrow}
          </p>

          {/* One sentence per line: left to wrap freely, the second sentence's
              first word ("We") was stranded at the end of line one. */}
          <h2 className="mt-5 text-3xl leading-[1.15] sm:text-4xl">
            {booking.heading.split(/(?<=\.)\s+/).map((sentence) => (
              <span key={sentence} className="block">
                {sentence}
              </span>
            ))}
          </h2>
          <p className="body-copy mt-5 text-base leading-relaxed text-muted">{booking.body}</p>

          <ul className="mt-9 space-y-5 border-t border-white/5 pt-8 text-sm">
            <li className="flex gap-3.5">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-gold" strokeWidth={1.5} />
              <a href={`mailto:${contact.email}`} className="inline-block py-1 text-muted transition-colors hover:text-ink">
                {contact.email}
              </a>
            </li>
            <li className="flex gap-3.5">
              <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-gold" strokeWidth={1.5} />
              <a
                href={`https://wa.me/${contact.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block py-1 text-muted transition-colors hover:text-ink"
              >
                {contact.whatsappDisplay} on WhatsApp
              </a>
            </li>
            <li className="flex gap-3.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" strokeWidth={1.5} />
              <address className="not-italic leading-relaxed text-muted">
                {contact.addressLine}
              </address>
            </li>
            <li className="flex gap-3.5">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-gold" strokeWidth={1.5} />
              <span className="text-muted">No obligation, and no sales pitch</span>
            </li>
          </ul>
        </Reveal>
          </div>
        </div>

        <Reveal index={1}>
          <BookingForm />
        </Reveal>
      </div>
    </Section>
  );
}
