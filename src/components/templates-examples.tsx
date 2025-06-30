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
          Choose a template you like
        </Typography>
      </div>
      <div className="mb-6">
        <Hr />
      </div>
      {templates.map((template, index) => (
        <div key={index} className="flex flex-col">
          <EmailTemplateView rows={template.rows} />
          <div className="flex mt-4 justify-end sm:justify-start">
            <Button
              onClick={async () => {
                onCreateSignature?.(template);
              }}
            >
              {'Select'}
            </Button>
          </div>
          <div className="mt-6 mb-6">
            {index !== templates.length - 1 && <Hr />}
          </div>
        </div>
      ))}
    </div>
  );
};
