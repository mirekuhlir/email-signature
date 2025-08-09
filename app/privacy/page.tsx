import { createClient } from '@/src/utils/supabase/server';
import { PageLayout } from '@/src/components/layout/page';
import { Typography } from '@/src/components/ui/typography';

export default async function Privacy() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <PageLayout user={user} title="Privacy Policy for myemailavatar.com">
      <Typography variant="lead" className="mt-8">
        1. Data Controller and Contact Information
      </Typography>
      <Typography variant="body">
        Controller: Miroslav Uhlíř, Blížkovice 31, 671 55 Blížkovice, Czech
        Republic
      </Typography>
      <Typography variant="body">Company ID: [to be completed]</Typography>
      <Typography variant="body">Contact email: [to be completed]</Typography>
      <Typography variant="body">
        Website:{' '}
        <a href="https://myemailavatar.com">https://myemailavatar.com</a>
      </Typography>

      <Typography variant="lead" className="mt-8">
        2. What Data We Collect
      </Typography>
      <Typography variant="body">
        Identification and contact data: email address and billing information.
      </Typography>
      <Typography variant="body">
        Service usage data: information about the use of the editor, templates,
        and website features.
      </Typography>
      <Typography variant="body">
        Technical data: IP address, device type, browser.
      </Typography>

      <Typography variant="lead" className="mt-8">
        3. Purposes of Data Processing
      </Typography>
      <Typography variant="body">
        Providing access to the service and its features.
      </Typography>
      <Typography variant="body">
        Processing payments and issuing invoices.
      </Typography>
      <Typography variant="body">
        Communication regarding orders, support, and important service
        information.
      </Typography>
      <Typography variant="body">
        Improving and developing the service based on anonymized usage data.
      </Typography>
      <Typography variant="body">
        Fulfilling legal obligations (e.g., accounting, tax obligations).
      </Typography>

      <Typography variant="lead" className="mt-8">
        4. Legal Basis for Processing
      </Typography>
      <Typography variant="body">
        Performance of a contract (providing the service).
      </Typography>
      <Typography variant="body">Compliance with legal obligations.</Typography>
      <Typography variant="body">
        Legitimate interest (service improvement, protection against misuse).
      </Typography>
      <Typography variant="body">
        Consent (e.g., for marketing purposes, if required).
      </Typography>

      <Typography variant="lead" className="mt-8">
        5. Data Sharing with Third Parties
      </Typography>
      <Typography variant="body">
        Payment service providers for payment processing.
      </Typography>
      <Typography variant="body">
        Technical infrastructure providers (hosting, email).
      </Typography>
      <Typography variant="body">
        Public authorities if required by law.
      </Typography>
      <Typography variant="body">
        For marketing communications only with your consent.
      </Typography>
      <Typography variant="body">
        All partners are contractually obliged to protect your data and use it
        only for specified purposes.
      </Typography>

      <Typography variant="lead" className="mt-8">
        6. Data Retention Period
      </Typography>
      <Typography variant="body">
        Your personal data is retained only for as long as necessary to fulfill
        the above purposes, but no longer than until account deletion or
        withdrawal of consent. After account deletion, all personal data and
        files are irreversibly deleted unless the law requires further
        retention.
      </Typography>

      <Typography variant="lead" className="mt-8">
        7. Data Subject Rights
      </Typography>
      <Typography variant="body">
        Right to access your personal data.
      </Typography>
      <Typography variant="body">
        Right to rectify inaccurate or incomplete data.
      </Typography>
      <Typography variant="body">
        Right to erasure (right to be forgotten).
      </Typography>
      <Typography variant="body">Right to restrict processing.</Typography>
      <Typography variant="body">Right to data portability.</Typography>
      <Typography variant="body">
        Right to object to processing (especially for marketing).
      </Typography>
      <Typography variant="body">
        Right to withdraw consent (if processing is based on consent).
      </Typography>
      <Typography variant="body">
        To exercise these rights, contact us at [to be completed email].
      </Typography>

      <Typography variant="lead" className="mt-8">
        8. Data Security
      </Typography>
      <Typography variant="body">Encrypted data transmission (TLS).</Typography>
      <Typography variant="body">
        Regular system backups and updates.
      </Typography>
      <Typography variant="body">Server and database protection.</Typography>

      <Typography variant="lead" className="mt-8">
        9. Cookies
      </Typography>
      <Typography variant="body">
        No cookies or similar tracking technologies are used on
        myemailavatar.com.
      </Typography>

      <Typography variant="lead" className="mt-8">
        10. Changes to the Privacy Policy
      </Typography>
      <Typography variant="body">
        We reserve the right to change this policy at any time. You will be
        informed of changes on the website or by email. The new version is
        effective on the date of publication.
      </Typography>

      <Typography variant="lead" className="mt-8">
        11. Contact
      </Typography>
      <Typography variant="body">
        If you have any questions, requests, or wish to exercise your data
        protection rights, contact us at [to be completed email].
      </Typography>

      <Typography variant="lead" className="mt-8">
        12. Effective Date
      </Typography>
      <Typography variant="body">
        These terms are effective as of the date of publication on the website.
      </Typography>
    </PageLayout>
  );
}
