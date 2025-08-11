/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useState, useEffect } from 'react';
import { useSignatureStore } from '@/src/store/content-edit-add-store';
import { Button } from '@/src/components/ui/button';
import { copySignatureToClipboard } from './content-view/utils';
import { EmailTemplateEdit } from './signature-edit-add';
import { useContentEditStore } from '@/src/store/content-edit-add-path-store';
import StyledLink from '../ui/styled-link';
import { useModal } from '@/src/components/ui/modal-system';
import CopyInstructionsModalContent from './copy-instructions-modal';
import SignaturePreview from './signature-preview';

import { Hr } from '../ui/hr';
import { ChevronLeft } from 'lucide-react';
import { Container } from '../ui/container';
import TrialBanner from '../trial/trial-banner';
import { useMediaQuery } from '@/src/hooks/useMediaQuery';
import { MEDIA_QUERIES } from '@/src/constants/mediaQueries';
import { getUserStatus, UserStatus } from '@/src/utils/userState';
import EditPanel from './edit-panel';
import { useAuthModal } from '@/src/hooks/useAuthModal';

export const SignatureDetail = (props: any) => {
  const {
    signatureDetail,
    isSignedIn,
    templateSlug,
    user,
    tempSignatureCreatedAt,
  } = props;

  const { rows, initSignature, isSavingOrder } = useSignatureStore();
  const { contentEdit, resetContentEdit } = useContentEditStore();
  const [isSticky, setIsSticky] = useState(false);
  const { modal } = useModal();
  const { showAuthModal } = useAuthModal();
  const isMobile = useMediaQuery(MEDIA_QUERIES.MOBILE);

  const userStatus = getUserStatus(user);

  useEffect(() => {
    resetContentEdit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const tempSignature = JSON.parse(
      localStorage.getItem(`${templateSlug}-${tempSignatureCreatedAt}`) || '{}',
    );

    // Load signature if template slug from url matches the template slug from local storage
    if (templateSlug && tempSignature?.info?.templateSlug === templateSlug) {
      initSignature({
        rows: tempSignature.rows,
        colors: tempSignature.colors,
        dimensions: tempSignature.dimensions,
      });
    } else {
      initSignature({
        rows: signatureDetail.rows,
        colors: signatureDetail.colors,
        dimensions: signatureDetail.dimensions,
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!isMobile) {
        const shouldBeSticky = window.scrollY > 1;
        setIsSticky(shouldBeSticky);
      } else {
        setIsSticky(false);
      }
    };

    // Only add scroll listener when in edit mode with edit/column path
    if (contentEdit.editPath || contentEdit.columnPath) {
      window.addEventListener('scroll', handleScroll);
      window.addEventListener('resize', handleScroll); // Handle screen size changes
      // Call once to set initial state
      handleScroll();
      return () => {
        window.removeEventListener('scroll', handleScroll);
        window.removeEventListener('resize', handleScroll);
      };
    }
  }, [contentEdit.editPath, contentEdit.columnPath, isMobile]);

  const showCopyInstructionsModal = () => {
    modal({
      content: <CopyInstructionsModalContent />,
      size: 'fullscreen',
      isZeroPadding: true,
    });
  };

  const isEdit = contentEdit.editPath || contentEdit.columnPath;

  return (
    <div className={`pb-12 min-h-screen ${isEdit ? 'pt-6' : 'pt-20'}`}>
      {!isEdit && (
        <Container>
          <StyledLink
            variant="default"
            href="/signatures"
            className="flex items-center gap-1"
          >
            <ChevronLeft size={23} />
            Back to My signatures
          </StyledLink>
          <Hr className="mt-4 mb-4 sm:mb-4 sm:mt-4" />
        </Container>
      )}

      {isEdit && (
        <div
          className={`${isSticky ? 'sticky top-0 bg-gray-50 z-10 pt-5 border-b border-gray-300' : ''}`}
        >
          <SignaturePreview />
        </div>
      )}

      {userStatus === UserStatus.TRIAL &&
        !contentEdit.editPath &&
        !contentEdit.columnPath && (
          <div className="flex justify-center">
            <TrialBanner user={user} />
          </div>
        )}

      {!isEdit && (
        <EditPanel>
          <Container>
            <div className="flex justify-end sm:justify-start sm:gap-8  flex-row ">
              <Button
                size="md"
                variant="blue"
                buttonClassName="min-w-35"
                disabled={isSavingOrder}
                onClick={() => {
                  if (isSignedIn) {
                    copySignatureToClipboard(userStatus, () => {
                      showCopyInstructionsModal();
                    });
                  } else {
                    showAuthModal({
                      title: 'Sign in to use your signature',
                      description:
                        'To use your signature in email, you need to sign up first.',
                    });
                  }
                }}
              >
                Use signature
              </Button>
            </div>
          </Container>
        </EditPanel>
      )}

      <Container>
        <div className="overflow-x-auto ">
          <EmailTemplateEdit
            isSignedIn={isSignedIn}
            templateSlug={templateSlug}
            rows={rows}
            userStatus={userStatus}
            tempSignatureCreatedAt={tempSignatureCreatedAt}
          />
        </div>
      </Container>
    </div>
  );
};
