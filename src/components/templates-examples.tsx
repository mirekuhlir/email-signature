/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { EmailTemplateView } from './signature-detail/content-view/signature-view';
import { getTemplates } from '@/src/templates';
import { Button } from './ui/button';
import { Hr } from './ui/hr';
import { Typography } from './ui/typography';

type TemplatesExamplesProps = {
  onCreateSignature: (template: any) => void;
};

export const TemplatesExamples = (props: TemplatesExamplesProps) => {
  const { onCreateSignature } = props;

  const templates = getTemplates();

  return (
    <div className="bg-color-gray-50">
      <div className="mb-4">
        <Typography variant="h4" textColor="text-brand-blue-900">
          Choose a signature you like
        </Typography>
      </div>
      <div className="mb-6">
        <Hr />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 sm:gap-16 justify-items-center items-end max-w-6xl mx-auto mb-16">
        {templates.map((template, index) => (
          <div key={index} className="flex flex-col">
            <EmailTemplateView rows={template.rows} />
            <div className="flex mt-4 justify-center">
              <Button
                onClick={async () => {
                  onCreateSignature?.(template);
                }}
              >
                {'Select'}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
