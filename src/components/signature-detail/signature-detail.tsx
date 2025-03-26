/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useState, useEffect } from 'react';
import { useSignatureStore } from '@/src/store/content-edit-add-store';
import { Button } from '@/src/components/ui/button';
import { handleCopy } from './content-view/utils';
import { EmailTemplateView } from './content-view/signature-view';
import { EmailTemplateEdit } from './signature-edit-add';
import { useContentEditStore } from '@/src/store/content-edit-add-path-store';
import StyledLink from '../ui/styled-link';

export const SignatureDetail = (props: any) => {
  const { signatureDetail, isSignedIn, templateSlug } = props;

  const { rows, initSignature } = useSignatureStore();
  const { contentEdit } = useContentEditStore();
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    initSignature({
      rows: signatureDetail.rows,
      colors: signatureDetail.colors,
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const BackButton = () => {
    return (
      <div className="pb-8">
        <StyledLink
          variant="default"
          href="/signatures"
        >{`< Back to My signatures`}</StyledLink>
      </div>
    );
  };

  return (
    <>
      <div className="flex flex-col">
        {(!isEdit || contentEdit.editPath) && (
          <>
            <EmailTemplateView rows={rows} />
            {!contentEdit.editPath && (
              <div className="mt-8 flex">
                <Button size="lg" onClick={() => setIsEdit(true)}>
                  Edit
                </Button>
                {/*    TODO - design so that on first view user doesn't see Copy signature button, but only edit */}
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
        <>
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
        </>
      )}
      {!contentEdit.editPath && !contentEdit.columnPath && <BackButton />}
    </>
  );
};
