import { createClient } from '@/src/utils/supabase/server';
import { Header } from '@/src/components/header';
import { Footer } from '@/src/components/footer/footer';
import { Container } from '@/src/components/ui/container';
import { Typography } from '@/src/components/ui/typography';

export default async function Home() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex flex-col">
      <Header user={user} />
      <main className="flex-1">
        <div className="pt-24">
          <Container>
            <div className="w-full">
              <Typography variant="h3" textColor="text-brand-blue-900">
                Terms of Service
              </Typography>
              <div className="mt-2 p-6 bg-white rounded-sm shadow-md">Text</div>
            </div>
          </Container>
        </div>
      </main>
      <Footer />
    </div>
  );
}
