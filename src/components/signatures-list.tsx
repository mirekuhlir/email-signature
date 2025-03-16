/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useState, useEffect } from 'react';
import { Typography } from '@/src/components/ui/typography';
import t from '@/app/localization/translate';
import Modal from './ui/modal';
import { Button } from '@/src/components/ui/button';
import { createClient } from '@/src/utils/supabase/client';
import { TemplatesExamples } from './templates-examples';
import { useMediaQuery } from '@/src/hooks/useMediaQuery';
import { MEDIA_QUERIES } from '@/src/constants/mediaQueries';
import { EmailTemplateView } from './signature-detail/content-view/signature-view';
import { useRouter } from 'next/navigation';
import { TEMP_SIGNATURE } from '../const/content';

type SignaturesPreviewsProps = {
  rows: any;
  createdAt: string;
  updatedAt?: string;
  onDelete: () => void;
  onEdit: () => void;
  isLoading: boolean;
  isFromTemp: boolean;
};

const SignaturesPreview = (props: SignaturesPreviewsProps) => {
  const {
    rows,
    createdAt,
    updatedAt,
    onDelete,
    onEdit,
    isLoading,
    isFromTemp,
  } = props;

  const editButtonText = isFromTemp ? 'Continue' : 'Edit';

  return (
    <div>
      <div className="flex flex-col items-start w-full my-4">
        <EmailTemplateView rows={rows} />
        <div className="flex flex-col mt-3 w-full">
          {createdAt && (
            <div className="flex gap-2">
              <Typography>Created at:</Typography>
              <Typography className="text-gray-500">
                {new Date(createdAt).toLocaleString('cs-CZ')}
              </Typography>
            </div>
          )}
          {updatedAt && (
            <div className="flex gap-2">
              <Typography>Updated at:</Typography>
              <Typography className="text-gray-500">
                {new Date(updatedAt).toLocaleString('cs-CZ')}
              </Typography>
            </div>
          )}
        </div>
        <div className="flex items-center gap-4 mt-3">
          <>
            <Button
              variant="blue"
              loading={isLoading}
              onClick={() => {
                onEdit();
              }}
            >
              {isLoading ? 'Creating...' : editButtonText}
            </Button>
            <Button
              variant="red"
              disabled={isLoading}
              onClick={() => {
                onDelete();
              }}
            >
              {t('Delete')}
            </Button>
          </>
        </div>
      </div>
    </div>
  );
};

export const SignaturesList = (props: any) => {
  const { signatures: signaturesData } = props;
  const router = useRouter();
  const supabase = createClient();
  const isMobile = useMediaQuery(MEDIA_QUERIES.MOBILE);

  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [signatureToDelete, setSignatureToDelete] = useState<any>(null);

  const [signatures, setSignatures] = useState<any[]>(signaturesData);
  const [tempSignature, setTempSignature] = useState<any>(null);

  useEffect(() => {
    const savedData = localStorage.getItem(TEMP_SIGNATURE);

    if (savedData) {
      setTempSignature(JSON.parse(savedData));
    }
  }, []);

  const createSignature = async (template: any, isTemp: boolean = false) => {
    setIsLoading(true);
    const { data, error } = await supabase.functions.invoke('post-signature', {
      method: 'POST',
      body: {
        signatureContent: {
          rows: template.rows,
          colors: template.colors,
        },
        info: template.info,
      },
    });

    if (error) {
      setIsLoading(false);
      console.error(error);
      // TODO - toast error
    }

    if (isTemp) {
      setTempSignature(null);
      localStorage.removeItem(TEMP_SIGNATURE);
    }

    setIsLoading(false);

    if (data?.signatureId) {
      router.push(`/signatures/${data.signatureId}`);
    }
  };

  return (
    <div className="w-full pt-6">
      <>
        <Typography variant="h3">My signatures</Typography>
        {tempSignature?.rows && (
          <SignaturesPreview
            rows={tempSignature.rows}
            isLoading={isLoading}
            isFromTemp={true}
            createdAt={tempSignature.createdAt}
            onDelete={() => {
              setTempSignature(null);
              localStorage.removeItem(TEMP_SIGNATURE);
            }}
            onEdit={() => {
              createSignature(tempSignature, true);
            }}
          />
        )}
        {signatures
          ?.sort(
            (a, b) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime(),
          )
          .map((signature: any) => (
            <SignaturesPreview
              key={signature.id}
              rows={signature.signature_content.rows}
              createdAt={signature.created_at}
              updatedAt={signature.updated_at}
              isLoading={isLoading}
              isFromTemp={false}
              onEdit={() => {
                router.push(`/signatures/${signature.id}`);
              }}
              onDelete={() => {
                setSignatureToDelete(signature);
                setIsDeleteModalOpen(true);
              }}
            />
          ))}
        <div className="flex pt-8 pb-8 justify-end">
          <Button size="lg" onClick={() => setIsModalOpen(true)}>
            Create new signature
          </Button>
        </div>
      </>

      <Modal
        size={isMobile ? 'fullscreen' : 'xlarge'}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <div className="pt-4">
          <div className="mb-6">
            <Typography variant="h3">Select signature</Typography>
          </div>
          <TemplatesExamples
            isSignedIn={true}
            createSignature={createSignature}
            isLoading={isLoading}
          />
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
