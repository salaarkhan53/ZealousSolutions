'use client';

import { Check } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ApplicationForm } from '@/components/forms/ApplicationForm';
import { careers } from '@/content/site';

/**
 * The application page's two columns.
 *
 * The role arrives as `?role=<id>` from the "Apply now" links and decides which
 * vacancy is being applied for, so the form carries no position picker. It is
 * read from `window.location` in an effect rather than through
 * `useSearchParams`, which would force the page behind a Suspense boundary
 * under `output: export`.
 *
 * Anyone reaching this page without a role, by bookmark or a shared link, still
 * gets a working form: it falls back to a general application.
 */
export function ApplyPanel() {
  const [position, setPosition] = useState<string>(careers.generalApplication);
  const [isNamedRole, setIsNamedRole] = useState(false);

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get('role');
    const role = careers.openRoles.find((r) => r.id === id);
    if (role) {
      setPosition(role.title);
      setIsNamedRole(true);
    }
  }, []);

  return (
    <div className="mt-10 grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
      {/* Plain stretched grid cell; the sticky box lives inside it so it has
          the form's full height to travel down. */}
      <div>
        <div className="lg:sticky lg:top-28">
          <h1 className="text-3xl leading-[1.15] sm:text-4xl">
            {isNamedRole ? (
              <>
                Apply for <span className="gold-text">{position}</span>
              </>
            ) : (
              <>
                Join <span className="gold-text">Zealous Solutions</span>
              </>
            )}
          </h1>

          <p className="body-copy mt-5 text-base leading-relaxed text-muted">
            {isNamedRole
              ? 'One form, no account to create. Attach your CV and we will take it from there.'
              : 'One form, no account to create. Attach your CV and tell us what you are looking for.'}
          </p>

          <ul className="mt-8 space-y-3 border-t border-white/5 pt-8 text-sm text-muted">
            <li className="flex gap-3">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold" strokeWidth={2} />
              PDF or Word CV, up to 5 MB
            </li>
            <li className="flex gap-3">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold" strokeWidth={2} />
              Pakistani or US contact number
            </li>
            <li className="flex gap-3">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold" strokeWidth={2} />
              We reply to every application we can take further
            </li>
          </ul>
        </div>
      </div>

      <ApplicationForm position={position} />
    </div>
  );
}
