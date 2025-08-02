import { createClient } from '@/src/utils/supabase/server';
import { PageLayout } from '@/src/components/layout/page';

export default async function Home() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <PageLayout user={user} title="Terms of Service">
      <div>Text</div>
    </PageLayout>
  );
}
