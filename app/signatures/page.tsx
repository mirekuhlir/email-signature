import { createClient } from '@/src/utils/supabase/server';
import { Header } from '@/src/components/header';
import { SignaturesList } from '@/src/components/signature-list/signatures-list';
import { Container } from '@/src/components/ui/container';

export default async function Signatures() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data } = await supabase
    .from('signatures')
    .select('*')
    .eq('user_id', user?.id);

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      <Header user={user} />
      <main>
        <div className="pt-16 ">
          <Container>
            <SignaturesList signatures={data} user={user} />
          </Container>
        </div>
      </main>
    </div>
  );
}
