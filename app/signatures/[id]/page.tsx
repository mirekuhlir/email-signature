import { SignatureDetail } from '@/components/signature-detail/signature-detail';
import { Header } from '@/components/header';
import { Container } from '@/components/ui/container';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { getTemplateBySlug } from '@/templates';

type Props = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    'template-example'?: string;
    template?: string | string[];
    [key: string]: string | string[] | undefined;
  }>;
};

export default async function Signature(props: Props) {
  const { params, searchParams } = props;
  const { id } = await params;
  const awaitedSearchParams = await searchParams;
  const templateSlug = awaitedSearchParams['template'];

  // User is not signed in
  if (id === 'example' && templateSlug) {
    const template = getTemplateBySlug(
      Array.isArray(templateSlug) ? templateSlug[0] : templateSlug,
    );

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/*       <Header user={user} /> */}
        <main>
          <div className="pt-24">
            <Container>
              <SignatureDetail
                signatureDetail={{
                  rows: template?.rows,
                }}
                isExample={true}
              />
            </Container>
          </div>
        </main>
      </div>
    );
  } else {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return redirect('/sign-in');
    }

    const { data } = await supabase
      .from('signatures')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Header user={user} />
        <main>
          <div className="pt-24">
            <Container>
              <SignatureDetail
                signatureDetail={{
                  rows: data.signature_content.rows,
                }}
              />
            </Container>
          </div>
        </main>
      </div>
    );
  }
}
