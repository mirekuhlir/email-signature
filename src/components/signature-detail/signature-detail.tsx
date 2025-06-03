/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useState, useEffect } from 'react';
import { useSignatureStore } from '@/src/store/content-edit-add-store';
import { Button } from '@/src/components/ui/button';
import { handleCopy } from './content-view/utils';
import { EmailTemplateEdit } from './signature-edit-add';
import { useContentEditStore } from '@/src/store/content-edit-add-path-store';
import StyledLink from '../ui/styled-link';
import { useModal } from '@/src/components/ui/modal-system';
import CopyInstructionsModalContent from './copy-instructions-modal';
import SignaturePreview from './signature-preview';
import { useAuthModal } from '@/src/hooks/use-auth-modal';
import { Hr } from '../ui/hr';
import { ChevronLeft, Edit2, Copy, Eye } from 'lucide-react';
import { Container } from '../ui/container';
import { TEMP_SIGNATURE } from '@/src/const/content';
import { Typography } from '../ui/typography';

// Function to calculate remaining trial days
const calculateRemainingTrialDays = (emailConfirmedAt: string): number => {
  if (!emailConfirmedAt) {
    return 30;
  }

  const confirmedDate = new Date(emailConfirmedAt);
  const currentDate = new Date();
  const trialEndDate = new Date(confirmedDate);

  // Add 30 days to the confirmed date
  trialEndDate.setDate(confirmedDate.getDate() + 30);

  // Calculate difference in milliseconds
  const timeDifference = trialEndDate.getTime() - currentDate.getTime();

  // Convert to days and round up
  const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

  // Return 0 if trial has expired, otherwise return remaining days
  return Math.max(0, daysDifference);
};

export const SignatureDetail = (props: any) => {
  const { signatureDetail, isSignedIn, templateSlug, user } = props;

  console.warn('user1', user);

  const { rows, initSignature } = useSignatureStore();
  const { contentEdit } = useContentEditStore();
  const [isEdit, setIsEdit] = useState(false);
  const { modal } = useModal();
  const { showAuthModal } = useAuthModal();

  // Calculate remaining trial days
  const remainingTrialDays = calculateRemainingTrialDays(
    user?.email_confirmed_at,
  );

  /*  console.warn('    user?.email_confirmed_at', user?.email_confirmed_at); */

  useEffect(() => {
    const tempSignature = JSON.parse(
      localStorage.getItem(TEMP_SIGNATURE) || '{}',
    );

    // Load signature if template slug from url matches the template slug from local storage
    if (templateSlug && tempSignature?.info?.templateSlug === templateSlug) {
      initSignature({
        rows: tempSignature.rows,
        colors: tempSignature.colors,
      });
    } else {
      initSignature({
        rows: signatureDetail.rows,
        colors: signatureDetail.colors,
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showCopyInstructionsModal = () => {
    modal({
      content: <CopyInstructionsModalContent />,
      size: 'large',
    });
  };

  const isPreview =
    !contentEdit.editPath && !contentEdit.columnPath && !contentEdit.addPath;

  return (
    <div className="pb-8">
      <Container>
        {isPreview && (
          <>
            {isSignedIn && (
              <>
                <StyledLink
                  variant="default"
                  href="/signatures"
                  className="flex items-center gap-1"
                >
                  <ChevronLeft size={23} />
                  Back to My signatures
                </StyledLink>
                <Hr className="mt-4 mb-2 sm:mb-8 sm:mt-4" />
              </>
            )}

            {!isSignedIn && !isEdit && (
              <>
                <StyledLink
                  variant="default"
                  href="/templates"
                  className="flex items-center gap-1"
                >
                  <ChevronLeft size={23} />
                  Back to templates
                </StyledLink>
                <Hr className="mt-4 mb-2 sm:mb-8 sm:mt-4" />
              </>
            )}
          </>
        )}
      </Container>

      {(contentEdit.editPath || contentEdit.columnPath) && (
        <div className="flex flex-col">
          <SignaturePreview />
        </div>
      )}

      {!isEdit && (
        <>
          <Container>
            <div className="flex flex-col bg-orange-200 p-4 mb-8 rounded-lg">
              <Typography variant="large">
                Try all features free for{' '}
                {remainingTrialDays > 0
                  ? `${remainingTrialDays} more days`
                  : '30 days'}
              </Typography>

              <Typography variant="body">
                Use all features for free for{' '}
                {remainingTrialDays > 0
                  ? `${remainingTrialDays} more days`
                  : '30 days'}
                . If you are satisfied, you pay a one-time fee and your
                signatures will remain yours forever. If you decide not to
                continue with the paid service, your signatures will be
                automatically deleted after the trial period ends.
              </Typography>
              {remainingTrialDays > 0 && isSignedIn && (
                <div className="flex justify-end sm:justify-start">
                  <StyledLink
                    variant="button-brand-blue"
                    href="/pricing"
                    className="mt-4"
                  >
                    Upgrade to premium
                  </StyledLink>
                </div>
              )}
              {remainingTrialDays === 0 && (
                <div className="mt-4">
                  <Typography variant="body" className="font-semibold">
                    Your trial has expired.
                  </Typography>
                </div>
              )}
            </div>
          </Container>
          <SignaturePreview />

          <Container>
            {!contentEdit.editPath && (
              <div className="mt-0 sm:mt-4 flex justify-center sm:justify-start">
                <Button
                  size="lg"
                  variant="brandBlue"
                  onClick={() => {
                    if (isSignedIn) {
                      handleCopy();
                      showCopyInstructionsModal();
                    } else {
                      showAuthModal({
                        title: 'Sign in to use your signature',
                        description: 'Please enter your e-mail to sign in.',
                      });
                    }
                  }}
                >
                  <Copy size={18} className="mr-2" /> Use signature
                </Button>
                <div className="ml-6">
                  <Button size="lg" onClick={() => setIsEdit(true)}>
                    <Edit2 size={18} className="mr-2" /> Edit
                  </Button>
                </div>
              </div>
            )}
          </Container>
        </>
      )}

      {isEdit && (
        <Container>
          <EmailTemplateEdit
            isSignedIn={isSignedIn}
            templateSlug={templateSlug}
            rows={rows}
          />
          {!contentEdit.editPath &&
            !contentEdit.addPath &&
            !contentEdit.columnPath && (
              <div className="flex justify-end">
                <Button size="lg" onClick={() => setIsEdit(false)}>
                  <Eye size={20} className="mr-2" /> View
                </Button>
              </div>
            )}
        </Container>
      )}
    </div>
  );
};
