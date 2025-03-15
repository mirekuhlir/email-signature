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
import { EmailTemplateView } from './signature-detail/content-view/signature-view';

export const SignaturesList = (props: any) => {
  const { signatures: signaturesData } = props;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [signatureToDelete, setSignatureToDelete] = useState<any>(null);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const supabase = createClient();
  const isMobile = useMediaQuery(MEDIA_QUERIES.MOBILE);

  const [signatures, setSignatures] = useState<any[]>(signaturesData);

  return (
    <div className="w-full pt-6">
      <Typography variant="h3">My signatures</Typography>
      {signatures
        ?.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        )
        .map((signature: any) => (
          <div key={signature.id}>
            <div className="flex flex-col items-start w-full p-4 my-4">
              <EmailTemplateView rows={signature.signature_content.rows} />
              <div className="flex flex-col mt-3 w-full">
                <div className="flex gap-2">
                  <Typography>Created at:</Typography>
                  <Typography className="text-gray-500">
                    {new Date(signature.created_at).toLocaleString('cs-CZ')}
                  </Typography>
                </div>
                {signature.updated_at && (
                  <div className="flex gap-2">
                    <Typography>Updated at:</Typography>
                    <Typography className="text-gray-500">
                      {new Date(signature.updated_at).toLocaleString('cs-CZ')}
                    </Typography>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 mt-3">
                <StyledLink
                  variant="button-blue"
                  href={`/signatures/${signature.id}`}
                >
                  {t('Edit')}
                </StyledLink>
                <Button
                  variant="red"
                  onClick={() => {
                    setSignatureToDelete(signature);
                    setIsDeleteModalOpen(true);
                  }}
                >
                  {t('Delete')}
                </Button>
              </div>
            </div>
          </div>
        ))}
      <div className="flex pt-8 pb-8 justify-end">
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
      <Modal size="small" isOpen={isDeleteModalOpen}>
        <div className="pt-4">
          <div className="mb-4">
            <Typography variant="h3">{t('Confirm Deletion')}</Typography>
          </div>
          <Typography>
            {t('Are you sure you want to delete this signature?')}
          </Typography>
          <div className="mt-4 flex justify-between">
            <Button
              variant="gray"
              disabled={isDeleteLoading}
              onClick={() => setIsDeleteModalOpen(false)}
            >
              {t('Cancel')}
            </Button>
            <Button
              loading={isDeleteLoading}
              variant="red"
              onClick={async () => {
                if (signatureToDelete) {
                  setIsDeleteLoading(true);
                  await supabase.functions.invoke(
                    `delete-signature?signatureId=${signatureToDelete.id}`,
                    { method: 'DELETE' },
                  );

                  setSignatures(
                    signatures.filter(
                      (signature) => signature.id !== signatureToDelete.id,
                    ),
                  );
                  setIsDeleteLoading(false);
                  setIsDeleteModalOpen(false);
                }
              }}
            >
              {isDeleteLoading ? 'Deleting...' : t('Delete')}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
