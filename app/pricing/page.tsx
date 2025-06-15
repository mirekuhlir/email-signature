import { createClient } from '@/src/utils/supabase/server';
import { Header } from '@/src/components/header';
import { Container } from '@/src/components/ui/container';
import { Typography } from '@/src/components/ui/typography';

export default async function Account() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      <Header user={user} />
      <main>
        <div className="pt-24">
          <Container>
            <div className="w-full">
              <Typography variant="h3" textColor="text-brand-blue-900">
                Pricing
              </Typography>
              <div className="mt-2 p-6 bg-white rounded-sm shadow-md">
                <div className="flex flex-col gap-2">
                  <Typography className="font-semibold">
                    Pay once and use forever
                  </Typography>
                  <Typography>
                    Pay once and use forever. No recurring fees. No hidden
                    charges.
                  </Typography>
                  <Typography>$30 USD</Typography>
                  <Typography>TODO: Stripe</Typography>
                </div>
              </div>
            </div>
          </Container>
        </div>
      </main>
    </div>
  );
}
