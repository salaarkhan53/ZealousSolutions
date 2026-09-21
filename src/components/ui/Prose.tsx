import type { ReactNode } from 'react';

/**
 * Shared wrapper for the legal pages. Styling lives here rather than in a
 * typography plugin, since these two pages are the only long-form prose.
 */
export function Prose({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto w-full max-w-3xl px-5 pb-24 pt-36 sm:px-8">
      <h1 className="text-4xl sm:text-5xl">{title}</h1>
      <p className="mt-4 text-sm text-muted">Last updated {updated}</p>

      <div className="mt-10 space-y-8 text-sm leading-relaxed text-muted [&_h2]:text-lg [&_h2]:text-ink [&_a]:text-gold [&_a:hover]:opacity-80 [&_p]:mt-3 [&_p]:text-justify [&_p]:hyphens-auto max-[30rem]:[&_p]:text-left [&_li]:mt-2 [&_ul]:list-disc [&_ul]:pl-5">
        {children}
      </div>
    </div>
  );
}
