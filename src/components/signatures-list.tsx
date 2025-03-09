/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useState } from 'react';
import { Typography } from '@/src/components/ui/typography';
import StyledLink from '@/src/components/ui/styled-link';
import t from '@/app/localization/translate';
import Modal from './ui/modal';
import { Button } from '@/src/components/ui/button';
import { createClient } from '@/src/utils/supabase/client';
import { TemplatesExamples } from './templates-examples';
import { useMediaQuery } from '@/src/hooks/useMediaQuery';
import { MEDIA_QUERIES } from '@/src/constants/mediaQueries';

export const SignaturesList = (props: any) => {
  const { signatures } = props;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const supabase = createClient();
  const isMobile = useMediaQuery(MEDIA_QUERIES.MOBILE);

  return (
    <div className="w-full">
      {signatures?.map((signature: any) => (
        <div key={signature.id}>
          <div className="flex items-center justify-between w-full p-4 my-4 bg-white rounded-md shadow-md">
            <Typography variant="h3">{signature.id}</Typography>
            <StyledLink
              variant="button-blue"
              href={`/signatures/${signature.id}`}
            >
              {t('edit')}
            </StyledLink>
            <Button
              variant="red"
              onClick={async () => {
                await supabase.functions.invoke(
                  `delete-signature?signatureId=${signature.id}`,
                  {
                    method: 'DELETE',
                  },
                );
              }}
            >
              {t('delete')}
            </Button>
          </div>
        </div>
      ))}
      <div className="mt-8 flex justify-end">
        <Button size="lg" onClick={() => setIsModalOpen(true)}>
          Create signature
        </Button>
      </div>
      <Modal
        size={isMobile ? 'fullscreen' : 'xlarge'}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <div className="pt-4">
          <div className="mb-6">
            <Typography variant="h3">Select signature</Typography>
          </div>
          <TemplatesExamples isSignedIn={true} />
        </div>
      </Modal>
    </div>
  );
};
