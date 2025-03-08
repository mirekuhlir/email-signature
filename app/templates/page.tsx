import { Container } from '@/src/components/ui/container';
import { TemplatesExamples } from '@/src/components/templates-examples';
import { createClient } from '@/src/utils/supabase/server';
import { redirect } from 'next/navigation';
export default async function Examples() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isSignedIn = !!user;

  if (isSignedIn) {
    return redirect('/signatures');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <main>
        <div className="pt-16 ">
          <Container>
            <TemplatesExamples isSignedIn={false} />
          </Container>
        </div>
      </main>
    </div>
  );
}
