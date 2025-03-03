/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useState, useEffect, useRef } from 'react';
import { useSignatureStore } from '@/src/store/content-edit-add-store';
import { Button } from '@/src/components/ui/button';
import { handleCopy } from './content-view/utils';
import { EmailTemplateView } from './content-view/signature-view';
import { EmailTemplateEdit } from './signature-edit-add';
import { useContentEditStore } from '@/src/store/content-edit-add-path-store';

export const SignatureDetail = (props: any) => {
  const { signatureDetail, isSignedIn, templateSlug } = props;

  const { rows, initRows } = useSignatureStore();
  const { contentEdit } = useContentEditStore();
  const [isEdit, setIsEdit] = useState(false);

  // TODO - zmizit
  const isInitialized = useRef(false);

  useEffect(() => {
    if (isInitialized.current) return;

    // TODO - bude asi někde jinde, o krok dřív a na detail se uživatel už dostane s vytvořenou signature
    const savedData = localStorage.getItem(templateSlug);

    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        initRows(parsedData);
        localStorage.removeItem(templateSlug);
      } catch (error) {
        console.error('Error parsing local data:', error);
      }
    } else {
      initRows(signatureDetail.rows);
    }
    isInitialized.current = true;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="flex flex-col items-center">
        {(!isEdit || contentEdit.editPath) && (
          <>
            <EmailTemplateView rows={rows} />
            {!contentEdit.editPath && (
              <>
                <Button size="lg" onClick={() => setIsEdit(true)}>
                  Edit
                </Button>
                <Button
                  size="lg"
                  onClick={() => {
                    handleCopy('email-signature');
                  }}
                >
                  Copy Signature
                </Button>
              </>
            )}
            <div className="mt-5"></div>
          </>
        )}
      </div>

      {isEdit && (
        <div>
          <EmailTemplateEdit
            isSignedIn={isSignedIn}
            templateSlug={templateSlug}
            rows={rows}
          />
          {!contentEdit.editPath && !contentEdit.addPath && (
            <div className="flex justify-end pt-2 pb-8">
              <Button size="lg" onClick={() => setIsEdit(false)}>
                View
              </Button>
            </div>
          )}
        </div>
      )}
    </>
  );
};
