/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { EmailTemplateView } from './signature-detail/content-view/signature-view';
import { templates } from '@/src/templates';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';
import { Typography } from './ui/typography';

type TemplatesExamplesProps = {
  isSignedIn: boolean;
  createSignature?: (template: any) => void;
};

export const TemplatesExamples = (props: TemplatesExamplesProps) => {
  const { createSignature, isSignedIn } = props;
  const router = useRouter();

  return (
    <>
      {templates.map((template, index) => (
        <div key={index} className="flex flex-col mt-4 mb-20">
          <div className="">
            <div className="mb-4">
              <Typography variant="labelBase">{template.info?.name}</Typography>
            </div>
            <EmailTemplateView rows={template.rows} />
          </div>
          <div className="flex mt-4 justify-end sm:justify-start">
            <Button
              onClick={async () => {
                if (isSignedIn) {
                  createSignature?.(template);
                } else {
                  router.push(
                    `/signatures/example/?template=${template.info?.templateSlug}`,
                  );
                }
              }}
            >
              {'Select'}
            </Button>
          </div>
        </div>
      ))}
    </>
  );
};
