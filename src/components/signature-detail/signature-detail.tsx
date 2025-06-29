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
import TrialBanner from '../trial/trial-banner';
import { useMediaQuery } from '@/src/hooks/useMediaQuery';
import { MEDIA_QUERIES } from '@/src/constants/mediaQueries';
import { getUserStatus } from '@/src/utils/userState';

export const SignatureDetail = (props: any) => {
  const { signatureDetail, isSignedIn, templateSlug, user } = props;

  const { rows, initSignature } = useSignatureStore();
  const { contentEdit, resetContentEdit } = useContentEditStore();
  const [isEdit, setIsEdit] = useState(false);
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
    });
  };

  const isPreview =
    !contentEdit.editPath && !contentEdit.columnPath && !contentEdit.addPath;

  // Debug info
  console.log('Content edit state:', {
    editPath: contentEdit.editPath,
    columnPath: contentEdit.columnPath,
    addPath: contentEdit.addPath,
    isSticky,
    shouldShowSticky: contentEdit.editPath || contentEdit.columnPath,
  });

  return (
    <div
      className={`pb-8 ${contentEdit.editPath || contentEdit.columnPath ? 'pt-6' : 'pt-20'}`}
    >
      <Container>
        {isPreview && (
          <>
            {isSignedIn && !isEdit && (
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
        <div
          className={`${isSticky ? 'sticky top-0 bg-gray-50 z-10 pt-5 border-b border-gray-300' : ''}`}
        >
          <SignaturePreview />
        </div>
      )}

      {!isEdit && (
        <>
          <div className="flex justify-center">
            <TrialBanner user={user} />
          </div>

          <SignaturePreview />

          <Container>
            {!contentEdit.editPath && (
              <div className="mt-0 sm:mt-4 flex justify-center sm:justify-start">
                <Button
                  size="lg"
                  variant="brandBlue"
                  onClick={() => {
                    if (isSignedIn) {
                      handleCopy(userStatus);
                      showCopyInstructionsModal();
                    } else {
                      showAuthModal({
                        title: 'Sign in to use your signature',
                        description:
                          'Please enter your email to sign in. Then you can also save signatures and edit them again later.',
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
          {!contentEdit.editPath &&
            !contentEdit.addPath &&
            !contentEdit.columnPath && (
              <div className="mb-8 mt-4 flex justify-end sm:justify-start">
                <Button
                  size="lg"
                  onClick={() => setIsEdit(false)}
                  variant="blue"
                >
                  <Eye size={20} className="mr-2" /> View
                </Button>
              </div>
            )}
          <EmailTemplateEdit
            isSignedIn={isSignedIn}
            templateSlug={templateSlug}
            rows={rows}
          />
        </Container>
      )}
    </div>
  );
};
