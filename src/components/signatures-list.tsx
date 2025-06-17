/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useState, useEffect } from 'react';
import { Typography } from '@/src/components/ui/typography';
import t from '@/src/localization/translate';
import Modal from './ui/modal';
import { Button } from '@/src/components/ui/button';
import { createClient } from '@/src/utils/supabase/client';
import { TemplatesExamples } from './templates-examples';
import { EmailTemplateView } from './signature-detail/content-view/signature-view';
import { useRouter } from 'next/navigation';
import { TEMP_SIGNATURE } from '../const/content';
import { useToast } from '@/src/components/ui/toast';
import { Hr } from './ui/hr';
import { LoadingInfo } from './signature-detail/content-edit/content-edit';
import { ContextMenu } from './ui/context-menu';
import { Container } from './ui/container';
import { MAX_SIGNATURES } from '@/supabase/functions/_shared/const';
import { PlusIcon } from 'lucide-react';
import TrialBanner from './trial/trial-banner';

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
  isTempSignature?: boolean;
  signatureCount?: number;
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
    isTempSignature,
    signatureCount,
  } = props;

  const editButtonText = isFromTemp ? 'Continue' : 'View';

  return (
    <div>
      <div className="flex flex-col py-4">
        <EmailTemplateView rows={rows} />
        <div className="flex justify-between bg-gray-200 mb-6 p-3 rounded-md mt-4 w-full sm:w-1/2">
          <div className="flex flex-col justify-center">
            {updatedAt && (
              <div>
                <Typography className="text-gray-500 text-sm md:text-base block md:inline">
                  Updated at:
                </Typography>
                <Typography className="text-sm md:text-base block md:inline md:ml-1">
                  {new Date(updatedAt).toLocaleString()}
                </Typography>
              </div>
            )}
            {createdAt && (
              <div className="mb-2 md:mb-0">
                <Typography className="text-gray-500 text-sm md:text-base block md:inline">
                  Created at:
                </Typography>
                <Typography className="text-sm md:text-base block md:inline md:ml-1">
                  {new Date(createdAt).toLocaleString()}
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
                  {!isTempSignature &&
                    (signatureCount ?? 0) < MAX_SIGNATURES && (
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
                    )}
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
  const { signatures: signaturesData, user } = props;
  const router = useRouter();
  const supabase = createClient();
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
        duration: 0,
      });
      return;
    }

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
      toast({
        title: 'Error',
        description: 'Failed to create signature. Please try again.',
        variant: 'error',
        duration: 0,
      });
      return;
    }

    if (isTemp) {
      setTempSignature(null);
      localStorage.removeItem(TEMP_SIGNATURE);
      if (data?.signatureId) {
        router.push(`/signatures/${data.signatureId}`);
      }
      return;
    }

    if (data?.signatureId) {
      router.push(`/signatures/${data.signatureId}`);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full pt-20">
        <div className="flex justify-center items-center">
          <LoadingInfo text="Creating signature. Please wait..." />
        </div>
      </div>
    );
  }
  return (
    <div className="w-full pt-6">
      {user && <TrialBanner user={user} />}
      <div>
        {signatures.length < MAX_SIGNATURES && (
          <div className="flex justify-center sm:justify-end pt-8 pb-10 sm:pb-2 w-full">
            <Button size="xl" onClick={() => setIsModalOpen(true)}>
              <PlusIcon className="w-7 h-7 mr-4" />
              Create new signature
            </Button>
          </div>
        )}

        {(tempSignature?.rows || signatures?.length > 0) && (
          <>
            <Typography
              className="leading-none"
              variant="h3"
              textColor="text-brand-blue-900"
            >
              My signatures
            </Typography>
            <Hr className="pb-4 mt-4" />
          </>
        )}

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
            isTempSignature={true}
            signatureCount={signatures.length}
          />
        )}
        {signatures
          ?.sort(
            (a, b) =>
              new Date(b.updated_at || b.created_at).getTime() -
              new Date(a.updated_at || a.created_at).getTime(),
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
              signatureCount={signatures.length}
            />
          ))}
      </div>

      <Modal
        size="fullscreen"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <Container isZeroPadding={true}>
          <TemplatesExamples
            isSignedIn={true}
            createSignature={createSignature}
          />
        </Container>
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
