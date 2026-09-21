import type { Metadata } from 'next';
import { ButtonLink } from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Page not found',
  description: 'That page does not exist. Everything Zealous Solutions offers is on the home page.',
  // No robots entry: Next already emits noindex for this page, and a second
  // tag here produced two conflicting robots metas. The canonical is cleared so
  // the 404 does not inherit the home page's.
  alternates: { canonical: null },
};

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-xl flex-col items-center justify-center px-5 py-32 text-center">
      <p className="font-display text-7xl font-bold gold-text">404</p>
      <h1 className="mt-6 text-3xl">This page does not exist</h1>
      <p className="mt-4 text-sm leading-relaxed text-muted">
        The link may be out of date, or the page may have moved. Everything we offer is on the home
        page.
      </p>
      <div className="mt-9 flex flex-wrap justify-center gap-3">
        <ButtonLink href="/">Back to home</ButtonLink>
        <ButtonLink href="/#book" variant="ghost">
          Book an appointment
        </ButtonLink>
      </div>
    </div>
  );
}
