import { createClient } from '@/src/utils/supabase/server';
import { PageLayout } from '@/src/components/layout/page';

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <PageLayout user={user} title="Privacy Policy">
      <h1 className="mb-8">Privacy Policy for myemailavatar.com</h1>

      <h2 className="mt-8">1. Data Controller and Contact Information</h2>
      <ul className="space-y-2">
        <li>
          Controller: Miroslav Uhlíř, Blížkovice 31, 671 55 Blížkovice, Czech
          Republic
        </li>
        <li>Company ID: [to be completed]</li>
        <li>Contact email: [to be completed]</li>
        <li>
          Website:{' '}
          <a href="https://myemailavatar.com">https://myemailavatar.com</a>
        </li>
      </ul>

      <h2 className="mt-8">2. What Data We Collect</h2>
      <ul className="space-y-2">
        <li>
          Identification and contact data: name, email address, billing
          information.
        </li>
        <li>
          Service usage data: information about the use of the editor,
          templates, and website features.
        </li>
        <li>Technical data: IP address, device type, browser.</li>
      </ul>

      <h2 className="mt-8">3. Purposes of Data Processing</h2>
      <ul className="space-y-2">
        <li>Providing access to the service and its features.</li>
        <li>Processing payments and issuing invoices.</li>
        <li>
          Communication regarding orders, support, and important service
          information.
        </li>
        <li>
          Improving and developing the service based on anonymized usage data.
        </li>
        <li>
          Fulfilling legal obligations (e.g., accounting, tax obligations).
        </li>
      </ul>

      <h2 className="mt-8">4. Legal Basis for Processing</h2>
      <ul className="space-y-2">
        <li>Performance of a contract (providing the service).</li>
        <li>Compliance with legal obligations.</li>
        <li>
          Legitimate interest (service improvement, protection against misuse).
        </li>
        <li>Consent (e.g., for marketing purposes, if required).</li>
      </ul>

      <h2 className="mt-8">5. Data Sharing with Third Parties</h2>
      <ul className="space-y-2">
        <li>
          Payment service providers (e.g., Paddle) for payment processing.
        </li>
        <li>Technical infrastructure providers (hosting, email).</li>
        <li>Public authorities if required by law.</li>
        <li>For marketing communications only with your consent.</li>
      </ul>
      <p>
        All partners are contractually obliged to protect your data and use it
        only for specified purposes.
      </p>

      <h2 className="mt-8">6. Data Retention Period</h2>
      <p>
        Your personal data is retained only for as long as necessary to fulfill
        the above purposes, but no longer than until account deletion or
        withdrawal of consent. After account deletion, all personal data and
        files are irreversibly deleted unless the law requires further
        retention.
      </p>

      <h2 className="mt-8">7. Data Subject Rights</h2>
      <ul className="space-y-2">
        <li>Right to access your personal data.</li>
        <li>Right to rectify inaccurate or incomplete data.</li>
        <li>Right to erasure (right to be forgotten).</li>
        <li>Right to restrict processing.</li>
        <li>Right to data portability.</li>
        <li>Right to object to processing (especially for marketing).</li>
        <li>Right to withdraw consent (if processing is based on consent).</li>
      </ul>
      <p>To exercise these rights, contact us at [to be completed email].</p>

      <h2 className="mt-8">8. Data Security</h2>
      <ul className="space-y-2">
        <li>Encrypted data transmission (TLS).</li>
        <li>Regular system backups and updates.</li>
        <li>Server and database protection.</li>
      </ul>

      <h2 className="mt-8">9. Cookies</h2>
      <p>
        No cookies or similar tracking technologies are used on
        myemailavatar.com.
      </p>

      <h2 className="mt-8">10. Changes to the Privacy Policy</h2>
      <p>
        We reserve the right to change this policy at any time. You will be
        informed of changes on the website or by email. The new version is
        effective on the date of publication.
      </p>

      <h2 className="mt-8">11. Contact</h2>
      <p>
        If you have any questions, requests, or wish to exercise your data
        protection rights, contact us at [to be completed email].
      </p>

      <hr className="my-8" />
      <p>
        These privacy principles are effective as of the date of publication on
        the website.
      </p>
    </PageLayout>
  );
}
