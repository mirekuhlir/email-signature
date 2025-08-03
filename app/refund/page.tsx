import { createClient } from '@/src/utils/supabase/server';
import { PageLayout } from '@/src/components/layout/page';

export default async function RefundPolicyPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <PageLayout user={user} title="Refund Policy">
      <h1 className="mb-8">Refund Policy for myemailavatar.com</h1>

      <h2 className="mt-8">1. When Are You Eligible for a Refund?</h2>
      <ul className="space-y-2">
        <li>
          You may request a refund if no more than 14 days have passed since
          your purchase.
        </li>
        <li>
          Refunds are not provided in cases of product misuse, violation of
          terms, or attempts to circumvent trial version limitations.
        </li>
        <li>
          Each refund request is assessed individually. If you encounter
          technical issues or have questions about payment, please contact our
          support.
        </li>
      </ul>

      <h2 className="mt-8">2. How to Request a Refund</h2>
      <ul className="space-y-2">
        <li>
          To request a refund, contact our support with your order details and
          the reason for your request.
        </li>
        <li>Processing a refund request may take up to 5 business days.</li>
      </ul>

      <h2 className="mt-8">3. Legal Notice</h2>
      <ul className="space-y-2">
        <li>
          All disputes will be resolved according to the law and jurisdiction
          specified in our Terms of Use.
        </li>
      </ul>

      <hr className="my-8" />
      <p>
        These refund principles are effective as of the date of publication on
        the website.
      </p>
    </PageLayout>
  );
}
