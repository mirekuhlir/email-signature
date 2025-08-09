import { createClient } from '@/src/utils/supabase/server';
import { PageLayout } from '@/src/components/layout/page';
import { Typography } from '@/src/components/ui/typography';

export default async function RefundPolicyPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <PageLayout user={user} title="Refund Policy for myemailavatar.com">
      <Typography variant="lead" className="mt-8">
        1. When Are You Eligible for a Refund?
      </Typography>
      <Typography variant="body">
        You may request a refund if no more than 14 days have passed since your
        purchase.
      </Typography>
      <Typography variant="body">
        Refunds are not provided in cases of product misuse, violation of terms,
        or attempts to circumvent trial version limitations.
      </Typography>
      <Typography variant="body">
        Each refund request is assessed individually. If you encounter technical
        issues or have questions about payment, please contact our support.
      </Typography>

      <Typography variant="lead" className="mt-8">
        2. How to Request a Refund
      </Typography>
      <Typography variant="body">
        To request a refund, contact our support with your order details and the
        reason for your request.
      </Typography>
      <Typography variant="body">
        Processing a refund request may take up to 5 business days.
      </Typography>

      <Typography variant="lead" className="mt-8">
        3. Legal Notice
      </Typography>
      <Typography variant="body">
        All disputes will be resolved according to the law and jurisdiction
        specified in our Terms of Use.
      </Typography>

      <Typography variant="lead" className="mt-8">
        4. Effective Date
      </Typography>
      <Typography variant="body">
        These terms are effective as of the date of publication on the website.
      </Typography>
    </PageLayout>
  );
}
