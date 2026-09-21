import { pageMeta } from '@/lib/metadata';
import { Prose } from '@/components/ui/Prose';
import { company, contact } from '@/content/site';

export const metadata = pageMeta({
  title: 'Terms & Conditions',
  description: `The terms that apply to your use of the ${company.name} website.`,
  path: '/terms/',
});

export default function TermsPage() {
  return (
    <Prose title="Terms & Conditions" updated="September 2026">
      <section>
        <h2>Agreement</h2>
        <p>
          These terms apply to your use of this website, operated by {company.legalName}. By using
          the site you accept them. If you do not, please stop using the site.
        </p>
      </section>

      <section>
        <h2>What this site is</h2>
        <p>
          This website describes our services and lets you request an appointment or apply for a
          role. Nothing here is an offer, a quote, or a contract. Any engagement between us is
          governed by a separate written agreement.
        </p>
      </section>

      <section>
        <h2>Using the forms</h2>
        <p>
          When you submit a form, give us accurate information and only submit details you are
          entitled to share. Do not use the forms to send unsolicited marketing, malicious content,
          or anything unlawful.
        </p>
      </section>

      <section>
        <h2>Intellectual property</h2>
        <p>
          The content, branding and design of this site belong to {company.legalName} or its
          licensors. You may not reproduce or republish them without permission.
        </p>
      </section>

      <section>
        <h2>Accuracy and availability</h2>
        <p>
          We work to keep this site accurate and available, but we do not guarantee that it will be
          error-free or uninterrupted. Service descriptions are general and may change.
        </p>
      </section>

      <section>
        <h2>External links</h2>
        <p>
          Where we link to other sites, we are not responsible for their content or their privacy
          practices.
        </p>
      </section>

      <section>
        <h2>Contact</h2>
        <p>
          Questions about these terms: <a href={`mailto:${contact.email}`}>{contact.email}</a>, or
          write to us at {contact.addressLine}.
        </p>
      </section>
    </Prose>
  );
}
