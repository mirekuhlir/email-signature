import { createClient } from '@/src/utils/supabase/server';
import { Header } from '@/src/components/header';
import { Container } from '@/src/components/ui/container';
import PricingCard from '@/src/components/pricing/pricing-card';

export default async function Account() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Header user={user} />
      <main>
        <div className="pt-24 pb-16">
          <Container>
            <PricingCard />
          </Container>
        </div>
      </main>
    </div>
  );
}
