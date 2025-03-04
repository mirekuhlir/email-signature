import { SignatureDetail } from '@/src/components/signature-detail/signature-detail';
import { Header } from '@/src/components/header';
import { Container } from '@/src/components/ui/container';
import { createClient } from '@/src/utils/supabase/server';
import { redirect } from 'next/navigation';
import { getTemplateBySlug } from '@/src/templates';

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

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isSignedIn = !!user;

  // User is not signed in
  if (templateSlug && !isSignedIn) {
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
                isSignedIn={isSignedIn}
                templateSlug={templateSlug}
              />
            </Container>
          </div>
        </main>
      </div>
    );
  } else {
    if (!isSignedIn) {
      return redirect('/sign-in');
    }

    const { data } = await supabase
      .from('signatures')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    // TODO - taky ještě domylset, co se stane, když uživatel nemá signature, ale j příhlášen je na example?template=signature-a
    const rows = data?.signature_content?.rows || [];

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Header user={user} />
        <main>
          <div className="pt-24">
            <Container>
              <SignatureDetail
                isSignedIn={isSignedIn}
                signatureDetail={{
                  rows,
                }}
              />
            </Container>
          </div>
        </main>
      </div>
    );
  }
}
