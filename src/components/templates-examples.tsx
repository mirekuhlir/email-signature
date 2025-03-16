/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { EmailTemplateView } from './signature-detail/content-view/signature-view';
import { templates } from '@/src/templates';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';

type TemplatesExamplesProps = {
  isSignedIn: boolean;
  createSignature: (template: any) => void;
  isLoading: boolean;
};

export const TemplatesExamples = (props: TemplatesExamplesProps) => {
  const { isLoading, createSignature, isSignedIn } = props;
  const router = useRouter();

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
                loading={isLoading}
                onClick={async () => {
                  if (isSignedIn) {
                    createSignature(template);
                  } else {
                    router.push(
                      `/signatures/example/?template=${template.info?.templateSlug}`,
                    );
                  }
                }}
              >
                {isLoading ? 'Loading...' : 'Select'}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
