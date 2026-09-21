import type { Metadata } from 'next';
import { company } from '@/content/site';

/**
 * Per-page metadata.
 *
 * Next merges `openGraph` shallowly, so a page that sets only `openGraph.url`
 * silently drops the image and type inherited from the root layout. This keeps
 * the shared fields attached to every page instead.
 */
export function pageMeta({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: 'website',
      siteName: company.name,
      title: `${title} - ${company.name}`,
      description,
      url: path,
      images: [{ url: '/og-image.png', width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} - ${company.name}`,
      description,
      images: ['/og-image.png'],
    },
  };
}
