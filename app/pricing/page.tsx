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
              <Typography variant="h3">Pricing</Typography>
              <div className="mt-6 p-6 bg-white rounded-sm shadow-md">TODO</div>
            </div>
          </Container>
        </div>
      </main>
    </div>
  );
}
