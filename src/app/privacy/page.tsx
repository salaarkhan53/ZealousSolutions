import { pageMeta } from '@/lib/metadata';
import { Prose } from '@/components/ui/Prose';
import { company, contact } from '@/content/site';

export const metadata = pageMeta({
  title: 'Privacy Policy',
  description: `How ${company.name} collects, uses and protects personal information submitted through this website.`,
  path: '/privacy/',
});

export default function PrivacyPage() {
  return (
    <Prose title="Privacy Policy" updated="September 2026">
      <section>
        <h2>Who we are</h2>
        <p>
          {company.legalName} operates this website. Our registered address is{' '}
          {contact.addressLine}, United States. You can reach us at{' '}
          <a href={`mailto:${contact.email}`}>{contact.email}</a>.
        </p>
      </section>

      <section>
        <h2>What we collect</h2>
        <p>We collect the information you choose to give us through the forms on this site:</p>
        <ul>
          <li>Appointment requests: name, email, phone, company, service interest, preferred date, time and timezone, and any message you add.</li>
          <li>Job applications: name, email, phone, street address, city, state or province, the position you apply for, years of experience, and the CV file you upload.</li>
        </ul>
        <p>
          We do not run advertising trackers on this site, and we do not sell personal information.
        </p>
      </section>

      <section>
        <h2>How we use it</h2>
        <p>
          Appointment details are used to contact you about your enquiry and to prepare for the
          conversation. Job applications are used to assess your suitability for current and future
          roles. We do not use either for unrelated marketing without asking you first.
        </p>
      </section>

      <section>
        <h2>Who processes it</h2>
        <p>
          Submissions are sent by our web host&apos;s mail server as an email, with any CV attached,
          to the Zealous Solutions team inboxes. Those inboxes are provided by our email service
          providers, including Google. We do not use a separate form service, and we do not store
          submissions in a database on this website.
        </p>
        <p>
          To stop automated abuse, the form handler keeps a one-way hash of your IP address and the
          times you submitted, used only to count recent submissions. It holds no other details and
          is cleared automatically, normally within a few hours.
        </p>
      </section>

      <section>
        <h2>How long we keep it</h2>
        <p>
          Appointment requests are kept for as long as needed to respond to you and, if we go on to
          work together, for the length of that relationship. Job applications and CVs are kept for
          up to 12 months so we can consider you for future openings, then deleted. You can ask us
          to delete your information sooner at any time.
        </p>
      </section>

      <section>
        <h2>Your rights</h2>
        <p>
          Depending on where you live, you may have the right to access, correct, export or delete
          the personal information we hold about you, and to object to certain processing. Email{' '}
          <a href={`mailto:${contact.email}`}>{contact.email}</a> and we will respond.
        </p>
      </section>

      <section>
        <h2>Changes</h2>
        <p>
          If this policy changes, the revised version will be posted here with an updated date.
        </p>
      </section>
    </Prose>
  );
}
