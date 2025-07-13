/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useRef } from 'react';
import { Typography } from '@/src/components/ui/typography';
import t from '@/src/localization/translate';
import { Button } from '@/src/components/ui/button';
import { EmailTemplateView } from '../signature-detail/content-view/signature-view';
import { ContextMenu } from '../ui/context-menu';
import { MAX_SIGNATURES } from '@/supabase/functions/_shared/const';

type SignatureListItemProps = {
  rows: any;
  createdAt: string;
  updatedAt?: string;
  onDelete: () => void;
  onEdit: () => void;
  isLoading: boolean;
  duplicateSignature?: (signatureId: string) => Promise<void>;
  duplicateTempSignature?: () => void;
  signatureId?: string;
  signatureCount?: number;
};

export const SignatureListItem = (props: SignatureListItemProps) => {
  const {
    rows,
    createdAt,
    updatedAt,
    onDelete,
    onEdit,
    isLoading,
    duplicateSignature,
    duplicateTempSignature,
    signatureId,
    signatureCount,
  } = props;

  const autoScaleRef = useRef<HTMLDivElement>(null);

  return (
    <div>
      <div ref={autoScaleRef} className="flex flex-col py-4">
        <EmailTemplateView rows={rows} />
        <div className="flex justify-between bg-gray-200 mb-6 p-3 rounded-md mt-4 w-full sm:w-1/2">
          <div className="flex flex-col justify-center">
            {updatedAt && (
              <div>
                <Typography className="text-gray-500 text-sm md:text-base block md:inline">
                  Updated at:
                </Typography>
                <Typography
                  className="text-sm md:text-base block md:inline md:ml-1"
                  textColor="text-gray-900"
                >
                  {new Date(updatedAt).toLocaleString()}
                </Typography>
              </div>
            )}
            {createdAt && (
              <div className="mb-2 md:mb-0">
                <Typography className="text-gray-500 text-sm md:text-base block md:inline">
                  Created at:
                </Typography>
                <Typography
                  className="text-sm md:text-base block md:inline md:ml-1"
                  textColor="text-gray-900"
                >
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
                  {(signatureCount ?? 0) < MAX_SIGNATURES && (
                    <Button
                      variant="ghost"
                      disabled={isLoading}
                      onClick={() => {
                        if (signatureId && duplicateSignature) {
                          duplicateSignature(signatureId);
                        } else if (duplicateTempSignature) {
                          duplicateTempSignature();
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
                {isLoading ? 'Creating...' : 'View'}
              </Button>
            </>
          </div>
        </div>
      </div>
      <div />
    </div>
  );
};
