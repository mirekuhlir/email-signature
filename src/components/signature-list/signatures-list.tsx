/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useState, useCallback } from 'react';
import { Typography } from '@/src/components/ui/typography';
import t from '@/src/localization/translate';
import Modal from '../ui/modal';
import { Button } from '@/src/components/ui/button';
import { createClient } from '@/src/utils/supabase/client';
import { TemplatesExamples } from '../templates-examples';
import { useRouter } from 'next/navigation';
import { useToast } from '@/src/components/ui/toast';
import { Hr } from '../ui/hr';
import { LoadingInfo } from '../signature-detail/content-edit/content-edit';
import { Container } from '../ui/container';
import { MAX_SIGNATURES } from '@/supabase/functions/_shared/const';
import { PlusIcon } from 'lucide-react';
import TrialBanner from '../trial/trial-banner';

import { SignatureListItem } from './signature-list-item';
import { getUserStatus, UserStatus } from '@/src/utils/userState';
import useEffectOnce from '@/src/hooks/useEffectOnce';
import {
  deleteTempSignature,
  saveTempSignature,
} from '../signature-detail/content-edit/utils';

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
  const [tempSignatureToDelete, setTempSignatureToDelete] = useState<any>(null);

  const [signatures, setSignatures] = useState<any[]>(signaturesData || []);
  const [tempSignatures, setTempSignatures] = useState<any>([]);

  const userStatus = getUserStatus(user);

  const loadTempSignatures = useCallback(() => {
    const names = JSON.parse(localStorage.getItem('templates-names') || '[]');

    names.forEach((name: string) => {
      const savedData = localStorage.getItem(name);

      if (savedData) {
        setTempSignatures((prev: any) => [...prev, JSON.parse(savedData)]);
      }
    });
  }, []);

  useEffectOnce(() => {
    loadTempSignatures();
  });

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

  const createSignature = async (
    template: any,
    userStatus: UserStatus,
    isTemp: boolean = false,
  ) => {
    if (userStatus === UserStatus.NOT_LOGGED_IN) {
      const templateSlug = template.info?.templateSlug;

      const createdAt = new Date().toISOString();

      saveTempSignature({
        createdAt,
        updatedAt: createdAt,
        templateSlug,
        rows: template.rows,
        colors: template.colors,
        dimensions: template.dimensions,
      });

      router.push(
        `/signatures/example/?template=${template.info?.templateSlug}&createdAt=${createdAt}`,
      );
      return;
    }

    setIsLoading(true);

    setIsModalOpen(false);

    const { data, error } = await supabase.functions.invoke('post-signature', {
      method: 'POST',
      body: {
        signatureContent: {
          rows: template.rows,
          colors: template.colors,
          dimensions: template.dimensions,
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
      setTempSignatures(null);
      deleteTempSignature(template);
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

  const signaturesCount = signatures.length + tempSignatures.length;

  return (
    <div className="w-full pt-6">
      {userStatus === UserStatus.TRIAL && (
        <div className="flex justify-center">
          <TrialBanner user={user} />
        </div>
      )}
      <div>
        {signaturesCount < MAX_SIGNATURES && (
          <div className="flex justify-center pt-8 pb-10 sm:pb-2 w-full">
            <Button size="xl" onClick={() => setIsModalOpen(true)}>
              <PlusIcon className="w-7 h-7 mr-4" />
              Create new signature
            </Button>
          </div>
        )}

        {signaturesCount >= MAX_SIGNATURES && (
          <div className="flex justify-center pt-8 pb-12">
            <Typography variant="labelBase">
              You have reached the maximum number of signatures. Please delete
              some signatures to create a new one.
            </Typography>
          </div>
        )}

        {(tempSignatures?.length > 0 || signatures?.length > 0) && (
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

        {tempSignatures
          ?.sort(
            (a: any, b: any) =>
              new Date(b.updatedAt || b.createdAt).getTime() -
              new Date(a.updatedAt || a.createdAt).getTime(),
          )
          ?.map((tempSignature: any) => (
            <SignatureListItem
              key={`${tempSignature.info?.templateSlug}-${tempSignature.createdAt}`}
              rows={tempSignature.rows}
              isLoading={isLoading}
              createdAt={tempSignature.createdAt}
              updatedAt={tempSignature.updatedAt}
              onDelete={() => {
                setTempSignatureToDelete(tempSignature);
                setIsDeleteModalOpen(true);
              }}
              onEdit={() => {
                if (userStatus === UserStatus.NOT_LOGGED_IN) {
                  router.push(
                    `/signatures/example/?template=${tempSignature.info?.templateSlug}&createdAt=${tempSignature.createdAt}`,
                  );
                } else {
                  createSignature(tempSignature, userStatus, true);
                }
              }}
              signatureCount={signatures.length}
              duplicateTempSignature={() => {
                createSignature(tempSignature, userStatus, true);
              }}
            />
          ))}
        {signatures
          ?.sort(
            (a, b) =>
              new Date(b.updated_at || b.created_at).getTime() -
              new Date(a.updated_at || a.created_at).getTime(),
          )
          .map((signature: any) => (
            <SignatureListItem
              key={signature.id}
              rows={signature.signature_content.rows}
              createdAt={signature.created_at}
              updatedAt={signature.updated_at}
              isLoading={isLoading}
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
            onCreateSignature={(template: any) => {
              createSignature(template, userStatus, false);
            }}
          />
        </Container>
      </Modal>
      <Modal size="small" isOpen={isDeleteModalOpen}>
        <div className="mb-1">
          <Typography variant="lead" textColor="text-gray-900">
            {t('Confirm Deletion')}
          </Typography>
        </div>
        <Typography>
          {t('Are you sure you want to delete this signature?')}
        </Typography>
        <div className="mt-4 flex justify-between">
          <Button
            variant="gray"
            disabled={isDeleteLoading}
            onClick={() => {
              setIsDeleteModalOpen(false);
              setSignatureToDelete(null);
              setTempSignatureToDelete(null);
            }}
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
                setSignatureToDelete(null);
              } else if (tempSignatureToDelete) {
                const newTempSignatures = tempSignatures.filter(
                  (signature: any) =>
                    signature.info?.templateSlug !==
                      tempSignatureToDelete.info?.templateSlug ||
                    signature.createdAt !== tempSignatureToDelete.createdAt,
                );
                setTempSignatures(newTempSignatures);
                deleteTempSignature(tempSignatureToDelete);
                setIsDeleteModalOpen(false);
                setTempSignatureToDelete(null);
              }
            }}
          >
            {isDeleteLoading ? 'Deleting...' : t('Delete')}
          </Button>
        </div>
      </Modal>
    </div>
  );
};
