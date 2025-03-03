'use client';
import { EmailTemplateView } from './signature-detail/content-view/signature-view';
import { templates } from '@/src/templates';
import { Container } from './ui/container';
import { createClient } from '../utils/supabase/client';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';

type TemplatesExamplesProps = {
  isSignedIn: boolean;
};

export const TemplatesExamples = (props: TemplatesExamplesProps) => {
  const { isSignedIn } = props;
  const router = useRouter();
  const supabase = createClient();

  return (
    <Container>
      {templates.map((template, index) => (
        <div key={index}>
          <EmailTemplateView rows={template.rows} />

          <Button
            onClick={async () => {
              if (isSignedIn) {
                const { data } = await supabase.functions.invoke(
                  'post-signature',

                  {
                    method: 'POST',

                    body: {
                      signatureContent: template,
                    },
                  },
                );

                router.push(`/signatures/${data.signatureId}`);
              } else {
                router.push(
                  `/signatures/example/?template=${template.templateSlug}`,
                );
              }
            }}
          >
            Select
          </Button>
        </div>
      ))}
    </Container>
  );
};
