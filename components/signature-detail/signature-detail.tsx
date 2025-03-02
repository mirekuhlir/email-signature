/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useState, useEffect } from 'react';
import { useSignatureStore } from './store/content-edit-add-store';
import { Button } from '@/components/ui/button';
import { handleCopy } from './content-view/utils';
import { EmailTemplateView } from './content-view/signature-view';
import { EmailTemplateEdit } from './signature-edit-add';
import { useContentEditStore } from './store/content-edit-add-path-store';

export const SignatureDetail = (props: any) => {
  const { signatureDetail, isExample } = props;

  const { rows, initRows } = useSignatureStore();
  const { contentEdit } = useContentEditStore();
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    initRows(signatureDetail.rows);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="flex flex-col items-center">
        {(!isEdit || contentEdit.editPath) && (
          <>
            <EmailTemplateView isExample={isExample} rows={rows} />
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
          <EmailTemplateEdit isExample={isExample} rows={rows} />
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
