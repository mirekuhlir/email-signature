import { SignatureDetail } from '@/src/components/signature-detail/signature-detail';
import { Header } from '@/src/components/header';
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

  if (templateSlug && isSignedIn) {
    return redirect('/signatures');
  }

  // User is not signed in
  if (templateSlug && !isSignedIn) {
    const template = getTemplateBySlug(
      Array.isArray(templateSlug) ? templateSlug[0] : templateSlug,
    );

    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
        <Header user={user} />
        <main>
          <div className="pt-24">
            <SignatureDetail
              signatureDetail={{
                ...template,
              }}
              isSignedIn={isSignedIn}
              templateSlug={templateSlug}
            />
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

    const rows = data?.signature_content?.rows || [];
    const colors = data?.signature_content?.colors || [];

    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
        <Header user={user} />
        <main>
          <div className="pt-20">
            <SignatureDetail
              isSignedIn={isSignedIn}
              signatureDetail={{
                ...data?.signature_content,
                rows,
                colors,
              }}
            />
          </div>
        </main>
      </div>
    );
  }
}
