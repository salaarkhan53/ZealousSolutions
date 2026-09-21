'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { contact } from '@/content/site';
import { cn } from '@/lib/cn';

/** Below this width the forms run edge to edge, under the button. */
const NARROW = '(max-width: 1023px)';

/** The strip the button occupies: its size plus the bottom/right offset. */
const ZONE = 96;

/**
 * Global WhatsApp entry point. Fixed bottom-right above everything except the
 * mobile menu, which covers the full viewport at a higher z-index.
 *
 * On phones and tablets the forms span the full width, so the button would sit
 * over their inputs and Submit button, and a tap meant for a field opened
 * WhatsApp instead. It steps aside while a form is actually underneath it.
 *
 * Measured on scroll rather than with an IntersectionObserver: forms come and
 * go (client-side navigation, a form swapped for its success panel), and a
 * fresh query each frame can't go stale.
 */
export function WhatsAppFloat() {
  const pathname = usePathname();
  const [overForm, setOverForm] = useState(false);

  useEffect(() => {
    const narrow = window.matchMedia(NARROW);
    let frame = 0;

    const measure = () => {
      frame = 0;
      if (!narrow.matches) return setOverForm(false);
      const top = window.innerHeight - ZONE;
      const left = window.innerWidth - ZONE;
      const covered = Array.from(document.querySelectorAll('form')).some((form) => {
        const r = form.getBoundingClientRect();
        return r.bottom > top && r.top < window.innerHeight && r.right > left;
      });
      setOverForm(covered);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    narrow.addEventListener('change', schedule);
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      narrow.removeEventListener('change', schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [pathname]);

  return (
    <a
      href={`https://wa.me/${contact.whatsapp}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Chat with us on WhatsApp at ${contact.whatsappDisplay}`}
      aria-hidden={overForm || undefined}
      tabIndex={overForm ? -1 : undefined}
      className={cn(
        'group fixed bottom-5 right-5 z-40 grid h-14 w-14 place-items-center rounded-full border border-gold/40 bg-surface/90 backdrop-blur-md transition-all duration-300 hover:border-gold hover:shadow-[0_0_30px_-4px] hover:shadow-gold/50 sm:bottom-7 sm:right-7',
        overForm && 'pointer-events-none translate-y-4 opacity-0',
      )}
    >
      {/* Pulse ring. Decorative, and stilled under reduced motion by the
          global media query in globals.css. */}
      <span
        aria-hidden="true"
        className="absolute inset-0 animate-[pulseRing_2.6s_ease-out_infinite] rounded-full border border-gold/50"
      />
      <svg
        viewBox="0 0 24 24"
        className="h-6 w-6 fill-gold transition-transform duration-300 group-hover:scale-110"
        aria-hidden="true"
      >
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.247-.694.247-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884a9.82 9.82 0 0 1 6.988 2.896 9.83 9.83 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.82 11.82 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.88 11.88 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.82 11.82 0 0 0 20.464 3.488" />
      </svg>
    </a>
  );
}
