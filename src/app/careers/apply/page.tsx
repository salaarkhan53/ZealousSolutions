import { ArrowLeft } from 'lucide-react';
import { pageMeta } from '@/lib/metadata';
import Link from 'next/link';
import { ApplyPanel } from '@/components/forms/ApplyPanel';
import { Section } from '@/components/ui/Section';

export const metadata = pageMeta({
  title: 'Apply',
  description:
    'Apply to join Zealous Solutions. Attach your CV and tell us which role you are interested in.',
  path: '/careers/apply/',
});

export default function ApplyPage() {
  return (
    <Section className="pt-32">
      <Link
        href="/careers/"
        prefetch={false}
        className="-my-1.5 inline-flex items-center gap-2 py-1.5 text-sm text-muted transition-colors hover:text-gold"
      >
        <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
        Back to careers
      </Link>

      <ApplyPanel />
    </Section>
  );
}
