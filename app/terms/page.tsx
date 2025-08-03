import { createClient } from '@/src/utils/supabase/server';
import { PageLayout } from '@/src/components/layout/page';

export default async function Home() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <PageLayout user={user} title="Terms of Service">
      <h1 className="mb-8">Terms of Service for myemailavatar.com</h1>

      <h2 className="mt-8">1. Introduction and Acceptance of Terms</h2>
      <p>
        By using the website <strong>myemailavatar.com</strong> (the "Service"),
        you agree to these Terms of Service. If you do not agree with these
        terms, please do not use the Service.
      </p>
      <h3 className="mt-4">Contract Formation</h3>
      <p>
        A contract between the user and the operator is concluded electronically
        by registration, order, or other acceptance of these terms on the
        website.
      </p>

      <h2 className="mt-8">2. Operator and Contact Information</h2>
      <ul className="space-y-2">
        <li>
          Operator: Miroslav Uhlíř, Blížkovice 31, 671 55 Blížkovice, Czech
          Republic
        </li>
        <li>Company ID: [to be completed]</li>
        <li>Contact email: [to be completed]</li>
        <li>
          Website:{' '}
          <a href="https://myemailavatar.com">https://myemailavatar.com</a>
        </li>
      </ul>

      <h2 className="mt-8">3. Definitions</h2>
      <ul className="space-y-2">
        <li>
          <strong>Service:</strong> Online editor and email signature templates
          available at myemailavatar.com.
        </li>
        <li>
          <strong>User:</strong> Any individual or legal entity using the
          Service.
        </li>
        <li>
          <strong>Trial:</strong> Free trial period with limitations (e.g.,
          watermark, informational text).
        </li>
        <li>
          <strong>Paid Access:</strong> A user who has paid a one-time fee and
          gained full access to editing and downloading templates.
        </li>
        <li>
          <strong>User Content:</strong> All information, images, logos, texts,
          and other data entered by the user into the Service.
        </li>
      </ul>
      <p>The Privacy Policy is provided in a separate document.</p>

      <h2 className="mt-8">4. Age and Territorial Restrictions</h2>
      <ul className="space-y-2">
        <li>The Service is intended for persons over 18 years of age only.</li>
        <li>
          The Service is available worldwide unless prohibited by local law.
        </li>
      </ul>

      <h2 className="mt-8">5. Registration and User Account</h2>
      <ul className="space-y-2">
        <li>
          Full access to the Service requires registration and creation of a
          user account.
        </li>
        <li>
          The user must provide truthful and up-to-date information and is
          responsible for the security of their account and password.
        </li>
      </ul>

      <h2 className="mt-8">6. Description of the Service</h2>
      <ul className="space-y-2">
        <li>
          The website allows a one-time purchase of access to professional email
          signature templates and their editing in an online editor.
        </li>
        <li>
          Templates are compatible with major email clients and can be exported
          in HTML format.
        </li>
        <li>
          The product allows adding images, logos, contact details, and further
          personalization.
        </li>
      </ul>

      <h2 className="mt-8">7. User Rights and Obligations</h2>
      <ul className="space-y-2">
        <li>
          The user must not misuse the Service, disrupt its operation, or
          violate the rights of third parties.
        </li>
        <li>
          The user is responsible for the content they upload (e.g., images,
          texts) and must have the necessary rights to use it.
        </li>
        <li>The user must not use trial templates for public communication.</li>
        <li>
          The user is entitled to use generated email signatures for both
          personal and commercial purposes.
        </li>
      </ul>

      <h2 className="mt-8">8. Operator Rights and Obligations</h2>
      <ul className="space-y-2">
        <li>
          The operator undertakes to provide the Service as described on the
          website.
        </li>
        <li>
          The operator may modify, update, or temporarily restrict the
          availability of the Service (e.g., for maintenance).
        </li>
        <li>
          The operator has the right to block a user account in case of
          violation of the terms.
        </li>
      </ul>

      <h2 className="mt-8">9. Payment Terms and Refunds</h2>
      <ul className="space-y-2">
        <li>
          Access to the Service is subject to a one-time payment, which ensures
          lifetime access to purchased templates and the editor.
        </li>
        <li>Payments are processed via the provider Paddle.</li>
        <li>
          After payment, the user receives an invoice and full access is
          activated.
        </li>
        <li>No recurring or hidden fees are charged.</li>
      </ul>
      <h3 className="mt-4">9.1 Right of Withdrawal and Refund</h3>
      <ul className="space-y-2">
        <li>
          The user has the right to withdraw from the contract without giving a
          reason within 14 days of purchase.
        </li>
        <li>
          Refund requests must be sent by email to [to be completed]. The
          request must include user identification and the reason for the
          request.
        </li>
        <li>
          After 14 days, no refund is possible, except where required by law.
        </li>
      </ul>

      <h2 className="mt-8">10. Intellectual Property and User Content</h2>
      <ul className="space-y-2">
        <li>
          All website content (code, templates, design) is protected by the
          operator&apos;s copyright.
        </li>
        <li>
          The user obtains a non-exclusive license to use purchased templates
          for their own needs, including commercial use.
        </li>
        <li>
          The user grants the operator a non-exclusive right to use uploaded
          content (e.g., signatures, images) for marketing and product
          development purposes. The operator will not publish this content
          without the user&apos;s consent if it contains personal data.
        </li>
        <li>
          All images and files uploaded by the user (logos, photos) are
          permanently deleted after account cancellation and are not further
          stored or backed up.
        </li>
      </ul>

      <h2 className="mt-8">
        11. Prohibited Activities and Technical Restrictions
      </h2>
      <ul className="space-y-2">
        <li>
          It is prohibited to upload illegal, offensive, misleading, or
          otherwise inappropriate content.
        </li>
        <li>
          It is prohibited to attempt to disrupt the security or functionality
          of the Service.
        </li>
        <li>It is prohibited to circumvent trial version restrictions.</li>
        <li>
          Scraping, automated downloading, reverse engineering, attempts to
          bypass technical measures, or other technical interventions in the
          Service are strictly prohibited.
        </li>
      </ul>

      <h2 className="mt-8">12. Limitation of Liability</h2>
      <ul className="space-y-2">
        <li>
          The operator is not liable for damages resulting from the use or
          inability to use the Service.
        </li>
        <li>
          The operator is not liable for data loss, lost profits, business
          interruption, or any indirect or consequential damages related to the
          use of the Service.
        </li>
        <li>
          The operator does not guarantee uninterrupted availability of the
          Service or compatibility with all email clients at all times.
        </li>
      </ul>

      <h2 className="mt-8">
        13. Account Cancellation, Service Termination, and Important Notices
      </h2>
      <ul className="space-y-2">
        <li>The user may request account cancellation at any time.</li>
        <li>
          The operator reserves the right to cancel an account in case of
          violation of the terms.
        </li>
        <li>
          The operator further reserves the right to terminate the product or
          cancel a user account at any time, even without giving a reason. In
          such a case, the user will be informed in advance if possible.
        </li>
        <li>
          If the user cancels or disputes a payment, their account and all
          account content may be deleted without compensation.
        </li>
        <li>
          After account cancellation, all user content, including generated
          templates, will be permanently deleted.
        </li>
        <li>
          Important: After account deletion, email signatures (templates)
          generated through the product and used in email communication may
          cease to function.
        </li>
        <li>
          The user acknowledges that by deleting the account, they lose access
          to all features and content, without the right to a refund.
        </li>
      </ul>

      <h2 className="mt-8">14. Product Availability and Maintenance</h2>
      <ul className="space-y-2">
        <li>The operator strives to ensure maximum product availability.</li>
        <li>Short-term outages due to maintenance or updates are possible.</li>
        <li>
          Users will be informed in advance of planned outages if possible.
        </li>
      </ul>

      <h2 className="mt-8">15. Support and Communication</h2>
      <ul className="space-y-2">
        <li>Technical support is provided only via email [to be completed].</li>
        <li>
          Users will be informed of changes to the terms by email and/or website
          notification.
        </li>
      </ul>

      <h2 className="mt-8">16. Changes to the Terms</h2>
      <ul className="space-y-2">
        <li>
          The operator reserves the right to change the terms at any time.
        </li>
        <li>
          Users will be informed of changes (by email or website notification).
        </li>
        <li>
          By continuing to use the Service after changes to the terms, the user
          agrees to the new version.
        </li>
      </ul>

      <h2 className="mt-8">17. Intellectual Property Protection and DMCA</h2>
      <ul className="space-y-2">
        <li>
          The operator respects the intellectual property rights of third
          parties. If you believe your copyright or other protected content has
          been infringed through the Service, contact us at [to be completed]
          with a description and evidence of the infringement.
        </li>
        <li>
          The operator reserves the right to remove content that infringes
          third-party rights and, in case of repeated infringement, to cancel
          the user&apos;s account.
        </li>
        <li>
          The user is obliged to upload only content for which they have the
          necessary rights and licenses.
        </li>
      </ul>

      <h2 className="mt-8">18. Governing Law and Jurisdiction</h2>
      <ul className="space-y-2">
        <li>
          These terms are governed exclusively by the laws of the Czech
          Republic.
        </li>
        <li>
          All disputes will be resolved by the competent courts in the Czech
          Republic according to the operator&apos;s registered office.
        </li>
        <li>Arbitration is not permitted.</li>
      </ul>

      <h2 className="mt-8">19. Archiving and Backups</h2>
      <ul className="space-y-2">
        <li>
          The operator does not back up user content. The user is responsible
          for backing up their data.
        </li>
      </ul>

      <h2 className="mt-8">20. Important Notice</h2>
      <ul className="space-y-2">
        <li>
          If the user cancels their account after paying the one-time fee, their
          account and all content will be permanently deleted. All generated
          templates may cease to function and the user loses access to the
          Service without the right to a refund.
        </li>
        <li>
          If the user cancels or disputes a payment, their account and all
          account content may be deleted without compensation.
        </li>
      </ul>

      <h2 className="mt-8">21. Effective Date</h2>
      <ul className="space-y-2">
        <li>
          These terms are effective as of the date of publication on the
          website.
        </li>
      </ul>
    </PageLayout>
  );
}
