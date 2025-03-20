/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useState, useEffect, useRef } from 'react';
import { useSignatureStore } from '@/src/store/content-edit-add-store';
import { Button } from '@/src/components/ui/button';
import { handleCopy } from './content-view/utils';
import { EmailTemplateView } from './content-view/signature-view';
import { EmailTemplateEdit } from './signature-edit-add';
import { useContentEditStore } from '@/src/store/content-edit-add-path-store';
import { useToast } from '@/src/components/ui/toast';

export const SignatureDetail = (props: any) => {
  const { signatureDetail, isSignedIn, templateSlug } = props;
  const { toast } = useToast();

  const { rows, initSignature } = useSignatureStore();
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
        initSignature(parsedData);
        localStorage.removeItem(templateSlug);
      } catch (error) {
        console.error('Error parsing local data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load saved signature data.',
          variant: 'error',
          duration: 5000,
        });
      }
    } else {
      initSignature({
        rows: signatureDetail.rows,
        colors: signatureDetail.colors,
      });
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
              <div className="mt-8 flex items-center">
                <Button size="lg" onClick={() => setIsEdit(true)}>
                  Edit
                </Button>
                {/*    TODO - tady vymyslet, aby při prvním zobrazení uživatel neviděl tlačítko Copy signature, ale pouze edit */}
                <div className="ml-8">
                  <Button
                    size="lg"
                    onClick={() => {
                      handleCopy('email-signature');
                    }}
                  >
                    Copy Signature
                  </Button>
                </div>
              </div>
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
          {!contentEdit.editPath &&
            !contentEdit.addPath &&
            !contentEdit.columnPath && (
              <div className="flex justify-end pt-4 pb-8 border-t border-gray-300">
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
