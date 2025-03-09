'use client';
import { EmailTemplateView } from './signature-detail/content-view/signature-view';
import { templates } from '@/src/templates';
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
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {templates.map((template, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center p-4"
          >
            <div className="w-full max-w-md mx-auto">
              <EmailTemplateView rows={template.rows} />
            </div>
            <div className="flex justify-center mt-4">
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
          </div>
        ))}
      </div>
    </div>
  );
};
