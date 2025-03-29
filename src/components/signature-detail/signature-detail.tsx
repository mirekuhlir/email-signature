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
import { useModal } from '@/src/components/ui/modal-system';
import { Typography } from '@/src/components/ui/typography';

export const SignatureDetail = (props: any) => {
  const { signatureDetail, isSignedIn, templateSlug } = props;

  const { rows, initSignature } = useSignatureStore();
  const { contentEdit } = useContentEditStore();
  const [isEdit, setIsEdit] = useState(false);
  const { modal } = useModal();

  useEffect(() => {
    initSignature({
      rows: signatureDetail.rows,
      colors: signatureDetail.colors,
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const BackButton = () => {
    return (
      <div className="pb-8 pt-4">
        <StyledLink
          variant="default"
          href="/signatures"
        >{`< Back to My signatures`}</StyledLink>
      </div>
    );
  };

  const showCopyInstructionsModal = () => {
    modal({
      title: 'Email Signature Instructions',
      content: (
        <div className="py-4 space-y-4">
          <Typography variant="large" weight="bold">
            Your signature has been copied to clipboard! Here&apos;s what to do
            next:
          </Typography>

          <div className="space-y-2">
            <Typography variant="body" weight="bold">
              Gmail:
            </Typography>
            <Typography variant="body">
              1. Open Gmail and go to Settings (gear icon) → See all settings
            </Typography>
            <Typography variant="body">
              2. In the &quot;General&quot; tab, scroll to the
              &quot;Signature&quot; section
            </Typography>
            <Typography variant="body">
              3. Create a new signature or edit an existing one
            </Typography>
            <Typography variant="body">
              4. Paste your signature and click &quot;Save Changes&quot; at the
              bottom
            </Typography>
          </div>

          <div className="space-y-2">
            <Typography variant="body" weight="bold">
              Outlook:
            </Typography>
            <Typography variant="body">
              1. Open Outlook and go to File → Options → Mail → Signatures
            </Typography>
            <Typography variant="body">
              2. Select &quot;New&quot; or edit an existing signature
            </Typography>
            <Typography variant="body">
              3. Paste your signature and click &quot;OK&quot;
            </Typography>
          </div>

          <div className="space-y-2">
            <Typography variant="body" weight="bold">
              Apple Mail:
            </Typography>
            <Typography variant="body">
              1. Open Mail and go to Mail → Settings → Signatures
            </Typography>
            <Typography variant="body">
              2. Create a new signature or select an existing one
            </Typography>
            <Typography variant="body">
              3. Paste your signature and close the preferences window
            </Typography>
          </div>
        </div>
      ),
      size: 'medium',
    });
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
                      showCopyInstructionsModal();
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
      {!contentEdit.editPath &&
        !contentEdit.columnPath &&
        !contentEdit.addPath &&
        !isEdit && <BackButton />}
    </>
  );
};
