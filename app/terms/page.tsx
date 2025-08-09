import { createClient } from '@/src/utils/supabase/server';
import { PageLayout } from '@/src/components/layout/page';
import { Typography } from '@/src/components/ui/typography';

export default async function Terms() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <PageLayout user={user} title="Terms of Service for myemailavatar.com">
      <Typography variant="lead" className="mt-8">
        1. Introduction and Acceptance of Terms
      </Typography>
      <Typography variant="body">
        By using the website <strong>myemailavatar.com</strong> (the
        &quot;Service&quot;), you agree to these Terms of Service. If you do not
        agree with these terms, please do not use the Service.
      </Typography>
      <Typography variant="body">
        A contract between the user and the operator is concluded electronically
        by registration, order, or other acceptance of these terms on the
        website.
      </Typography>

      <Typography variant="lead" className="mt-8">
        2. Operator and Contact Information
      </Typography>
      <Typography variant="body">
        Operator: Miroslav Uhlíř, Blížkovice 31, 671 55 Blížkovice, Czech
        Republic
      </Typography>
      <Typography variant="body">Company ID: [to be completed]</Typography>
      <Typography variant="body">Contact email: [to be completed]</Typography>
      <Typography variant="body">
        Website:{' '}
        <a href="https://myemailavatar.com">https://myemailavatar.com</a>
      </Typography>

      <Typography variant="lead" className="mt-8">
        3. Definitions
      </Typography>
      <Typography variant="body">
        <strong>Service:</strong> Online editor and email signature templates
        available at myemailavatar.com.
      </Typography>
      <Typography variant="body">
        <strong>User:</strong> Any individual or legal entity using the Service.
      </Typography>
      <Typography variant="body">
        <strong>Trial:</strong> Free trial period with limitations (e.g.,
        watermark, informational text).
      </Typography>
      <Typography variant="body">
        <strong>Paid Access:</strong> A user who has paid a one-time fee and
        gained full access to editing and using templates.
      </Typography>
      <Typography variant="body">
        <strong>User Content:</strong> All information, images, logos, texts,
        and other data entered by the user into the Service.
      </Typography>
      <Typography variant="body">
        The Privacy Policy is provided in a separate document.
      </Typography>

      <Typography variant="lead" className="mt-8">
        4. Age and Territorial Restrictions
      </Typography>
      <Typography variant="body">
        The Service is intended for persons over 18 years of age only.
      </Typography>
      <Typography variant="body">
        The Service is available worldwide unless prohibited by local law.
      </Typography>

      <Typography variant="lead" className="mt-8">
        5. Registration and User Account
      </Typography>
      <Typography variant="body">
        Full access to the Service requires registration and creation of a user
        account.
      </Typography>
      <Typography variant="body">
        The user must provide truthful and up-to-date information and is
        responsible for the security of their account.
      </Typography>

      <Typography variant="lead" className="mt-8">
        6. Description of the Service
      </Typography>
      <Typography variant="body">
        The website allows a one-time purchase of access to professional email
        signature templates and their editing in an online editor.
      </Typography>
      <Typography variant="body">
        Templates are compatible with major email clients and can be exported in
        HTML format.
      </Typography>
      <Typography variant="body">
        The product allows adding images, logos, contact details, and further
        personalization.
      </Typography>

      <Typography variant="lead" className="mt-8">
        7. User Rights and Obligations
      </Typography>
      <Typography variant="body">
        The user must not misuse the Service, disrupt its operation, or violate
        the rights of third parties.
      </Typography>
      <Typography variant="body">
        The user is responsible for the content they upload (e.g., images,
        texts) and must have the necessary rights to use it.
      </Typography>
      <Typography variant="body">
        The user must not use trial templates for public communication.
      </Typography>
      <Typography variant="body">
        The user is entitled to use generated email signatures for both personal
        and commercial purposes.
      </Typography>

      <Typography variant="lead" className="mt-8">
        8. Operator Rights and Obligations
      </Typography>
      <Typography variant="body">
        The operator undertakes to provide the Service as described on the
        website.
      </Typography>
      <Typography variant="body">
        The operator may modify, update, or temporarily restrict the
        availability of the Service (e.g., for maintenance).
      </Typography>
      <Typography variant="body">
        The operator has the right to block a user account in case of violation
        of the terms.
      </Typography>

      <Typography variant="lead" className="mt-8">
        9. Payment Terms and Refunds
      </Typography>
      <Typography variant="body">
        Access to the Service is subject to a one-time payment, which ensures
        lifetime access to purchased templates and the editor.
      </Typography>
      <Typography variant="body">
        Payments are processed via payment service provider.
      </Typography>
      <Typography variant="body">
        After payment, the user receives an invoice and full access is
        activated.
      </Typography>
      <Typography variant="body">
        No recurring or hidden fees are charged.
      </Typography>
      <Typography variant="body">
        The user has the right to withdraw from the contract without giving a
        reason within 14 days of purchase.
      </Typography>
      <Typography variant="body">
        Refund requests must be sent by email to [to be completed]. The request
        must include user identification and the reason for the request.
      </Typography>
      <Typography variant="body">
        After 14 days, no refund is possible, except where required by law.
      </Typography>

      <Typography variant="lead" className="mt-8">
        10. Intellectual Property and User Content
      </Typography>
      <Typography variant="body">
        All website content (code, templates, design) is protected by the
        operator&apos;s copyright.
      </Typography>
      <Typography variant="body">
        The user obtains a non-exclusive license to use purchased templates for
        their own needs, including commercial use.
      </Typography>
      <Typography variant="body">
        The user grants the operator a non-exclusive right to use uploaded
        content (e.g., signatures, images) for marketing and product development
        purposes. The operator will not publish this content without the
        user&apos;s consent if it contains personal data.
      </Typography>
      <Typography variant="body">
        All images and files uploaded by the user (logos, photos) are
        permanently deleted after account cancellation and are not further
        stored or backed up.
      </Typography>

      <Typography variant="lead" className="mt-8">
        11. Prohibited Activities and Technical Restrictions
      </Typography>
      <Typography variant="body">
        It is prohibited to upload illegal, offensive, misleading, or otherwise
        inappropriate content.
      </Typography>
      <Typography variant="body">
        It is prohibited to attempt to disrupt the security or functionality of
        the Service.
      </Typography>
      <Typography variant="body">
        It is prohibited to circumvent trial version restrictions.
      </Typography>
      <Typography variant="body">
        Scraping, automated downloading, reverse engineering, attempts to bypass
        technical measures, or other technical interventions in the Service are
        strictly prohibited.
      </Typography>

      <Typography variant="lead" className="mt-8">
        12. Limitation of Liability
      </Typography>
      <Typography variant="body">
        The operator is not liable for damages resulting from the use or
        inability to use the Service.
      </Typography>
      <Typography variant="body">
        The operator is not liable for data loss, lost profits, business
        interruption, or any indirect or consequential damages related to the
        use of the Service.
      </Typography>
      <Typography variant="body">
        The operator does not guarantee uninterrupted availability of the
        Service or compatibility with all email clients at all times.
      </Typography>

      <Typography variant="lead" className="mt-8">
        13. Account Cancellation, Service Termination, and Important Notices
      </Typography>
      <Typography variant="body">
        The user may request account cancellation at any time.
      </Typography>
      <Typography variant="body">
        The operator reserves the right to cancel an account in case of
        violation of the terms.
      </Typography>
      <Typography variant="body">
        The operator further reserves the right to terminate the product or
        cancel a user account at any time, even without giving a reason. In such
        a case, the user will be informed in advance if possible.
      </Typography>
      <Typography variant="body">
        If the user cancels or disputes a payment, their account and all account
        content may be deleted without compensation. Email signatures in emails
        may stop working.
      </Typography>
      <Typography variant="body">
        By deleting the account, the user acknowledges they lose access to all
        features and content, without the right to a refund. Email signatures in
        emails may stop working.
      </Typography>

      <Typography variant="lead" className="mt-8">
        14. Product Availability and Maintenance
      </Typography>
      <Typography variant="body">
        The operator strives to ensure maximum product availability.
      </Typography>
      <Typography variant="body">
        Short-term outages due to maintenance or updates are possible.
      </Typography>
      <Typography variant="body">
        Users will be informed in advance of planned outages if possible.
      </Typography>

      <Typography variant="lead" className="mt-8">
        15. Limitation of Liability for Data Loss
      </Typography>
      <Typography variant="body">
        The operator is not liable for any loss, damage, or unavailability of
        user data resulting from technical failure, system outage, third-party
        intervention, or any other unforeseeable event. The user is responsible
        for backing up their own data.
      </Typography>

      <Typography variant="lead" className="mt-8">
        16. Support and Communication
      </Typography>
      <Typography variant="body">
        Technical support is provided only via email [to be completed].
      </Typography>
      <Typography variant="body">
        Users will be informed of changes to the terms by email and/or website
        notification.
      </Typography>

      <Typography variant="lead" className="mt-8">
        17. Changes to the Terms
      </Typography>
      <Typography variant="body">
        The operator reserves the right to change the terms at any time.
      </Typography>
      <Typography variant="body">
        Users will be informed of changes (by email or website notification).
      </Typography>
      <Typography variant="body">
        By continuing to use the Service after changes to the terms, the user
        agrees to the new version.
      </Typography>

      <Typography variant="lead" className="mt-8">
        18. Intellectual Property Protection and DMCA
      </Typography>
      <Typography variant="body">
        The operator respects the intellectual property rights of third parties.
        If you believe your copyright or other protected content has been
        infringed through the Service, contact us at [to be completed] with a
        description and evidence of the infringement.
      </Typography>
      <Typography variant="body">
        The operator reserves the right to remove content that infringes
        third-party rights and, in case of repeated infringement, to cancel the
        user&apos;s account.
      </Typography>
      <Typography variant="body">
        The user is obliged to upload only content for which they have the
        necessary rights and licenses.
      </Typography>

      <Typography variant="lead" className="mt-8">
        19. Governing Law and Jurisdiction
      </Typography>
      <Typography variant="body">
        These terms are governed exclusively by the laws of the Czech Republic.
      </Typography>
      <Typography variant="body">
        All disputes will be resolved by the competent courts in the Czech
        Republic according to the operator&apos;s registered office.
      </Typography>
      <Typography variant="body">Arbitration is not permitted.</Typography>

      <Typography variant="lead" className="mt-8">
        20. Effective Date
      </Typography>
      <Typography variant="body">
        These terms are effective as of the date of publication on the website.
      </Typography>
    </PageLayout>
  );
}
