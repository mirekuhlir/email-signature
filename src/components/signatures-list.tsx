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
import { useToast } from '@/src/components/ui/toast';
import { Hr } from './ui/hr';
import { LoadingInfo } from './signature-detail/content-edit/content-edit';
import { ContextMenu } from './ui/context-menu';

type SignaturesPreviewsProps = {
  rows: any;
  createdAt: string;
  updatedAt?: string;
  onDelete: () => void;
  onEdit: () => void;
  isLoading: boolean;
  isFromTemp: boolean;
  duplicateSignature?: (signatureId: string) => Promise<void>;
  signatureId?: string;
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
    duplicateSignature,
    signatureId,
  } = props;

  const editButtonText = isFromTemp ? 'Continue' : 'View';

  return (
    <div>
      <div className="flex flex-col w-full py-4">
        <EmailTemplateView rows={rows} />
        <div className="flex justify-between w-full bg-gray-200 mb-14 p-3 rounded-md mt-4">
          <div className="flex flex-col justify-center">
            {createdAt && (
              <div className="mb-2 md:mb-0">
                <Typography className="text-gray-500 text-sm md:text-base block md:inline">
                  Created at:
                </Typography>
                <Typography className="text-sm md:text-base block md:inline md:ml-1">
                  {new Date(createdAt).toLocaleString('cs-CZ')}
                </Typography>
              </div>
            )}
            {updatedAt && (
              <div>
                <Typography className="text-gray-500 text-sm md:text-base block md:inline">
                  Updated at:
                </Typography>
                <Typography className="text-sm md:text-base block md:inline md:ml-1">
                  {new Date(updatedAt).toLocaleString('cs-CZ')}
                </Typography>
              </div>
            )}
          </div>
          <div className="flex gap-3 items-center">
            <>
              <ContextMenu>
                <div className="pt-2 pb-2 px-2 flex flex-col gap-1 whitespace-nowrap items-start">
                  <Button
                    variant="ghost"
                    disabled={isLoading}
                    onClick={() => {
                      onDelete();
                    }}
                  >
                    {t('Delete')}
                  </Button>
                  <Button
                    variant="ghost"
                    disabled={isLoading}
                    onClick={() => {
                      if (signatureId && duplicateSignature) {
                        duplicateSignature(signatureId);
                      }
                    }}
                  >
                    {t('Duplicate')}
                  </Button>
                </div>
              </ContextMenu>
              <Button
                variant="blue"
                loading={isLoading}
                onClick={() => {
                  onEdit();
                }}
              >
                {isLoading ? 'Creating...' : editButtonText}
              </Button>
            </>
          </div>
        </div>
      </div>
      <div />
    </div>
  );
};

export const SignaturesList = (props: any) => {
  const { signatures: signaturesData } = props;
  const router = useRouter();
  const supabase = createClient();
  const isMobile = useMediaQuery(MEDIA_QUERIES.MOBILE);
  const { toast } = useToast();

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

  const duplicateSignature = async (signatureId: string) => {
    setIsLoading(true);

    const { data, error } = await supabase.functions.invoke(
      'duplicate-signature',
      {
        method: 'POST',
        body: {
          signatureId: signatureId,
        },
      },
    );

    if (error) {
      setIsLoading(false);
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to duplicate signature. Please try again.',
        variant: 'error',
        duration: 5000,
      });
      return;
    }

    setIsLoading(false);

    if (data?.signatureId) {
      router.push(`/signatures/${data.signatureId}`);
    }
  };

  const createSignature = async (template: any, isTemp: boolean = false) => {
    setIsLoading(true);

    setIsModalOpen(false);

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
      toast({
        title: 'Error',
        description: 'Failed to create signature. Please try again.',
        variant: 'error',
        duration: 5000,
      });
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

  if (isLoading) {
    return (
      <div className="w-full pt-6">
        <div className="flex justify-center items-center">
          <LoadingInfo text="Creating signature. Please wait..." />
        </div>
      </div>
    );
  }
  return (
    <div className="w-full pt-6">
      <div>
        <div className="flex justify-center md:justify-end pt-2 pb-6 w-full">
          <Button size="lg" onClick={() => setIsModalOpen(true)}>
            Create new signature
          </Button>
        </div>

        {tempSignature?.rows ||
          (signatures?.length > 0 && (
            <>
              <Typography
                className="leading-none"
                variant="h3"
                textColor="text-gray-700"
              >
                My signatures
              </Typography>
              <Hr className="pb-4 mt-4" />
            </>
          ))}

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
              duplicateSignature={duplicateSignature}
              signatureId={signature.id}
            />
          ))}
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

          <TemplatesExamples
            isSignedIn={true}
            createSignature={createSignature}
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
