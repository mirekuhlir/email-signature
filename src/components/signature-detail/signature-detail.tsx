/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useEffect } from 'react';
import { useSignatureStore } from '@/src/store/content-edit-add-store';
import { EmailTemplateEdit } from './signature-edit-add';
import { useContentEditStore } from '@/src/store/content-edit-add-path-store';
import StyledLink from '../ui/styled-link';
import SignaturePreview from './signature-preview';

import { Hr } from '../ui/hr';
import { ChevronLeft } from 'lucide-react';
import { Container } from '../ui/container';
import TrialBanner from '../trial/trial-banner';
import { useMediaQuery } from '@/src/hooks/useMediaQuery';
import { MEDIA_QUERIES } from '@/src/constants/mediaQueries';
import { getUserStatus, UserStatus } from '@/src/utils/userState';
import PreviewEditPanel from './preview-edit-panel';

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

      {userStatus === UserStatus.TRIAL &&
        !contentEdit.editPath &&
        !contentEdit.columnPath && (
          <div className="flex justify-center">
            <TrialBanner user={user} />
          </div>
        )}

      {isMobile && (
        <Container>
          <div className="overflow-x-auto ">
            {isEdit && <SignaturePreview />}
            <EmailTemplateEdit
              isSignedIn={isSignedIn}
              templateSlug={templateSlug}
              rows={rows}
              userStatus={userStatus}
              tempSignatureCreatedAt={tempSignatureCreatedAt}
            />
          </div>
        </Container>
      )}

      {!isMobile && (
        <Container className="max-w-7xl">
          <div className="flex flex-row gap-4">
            <div className="min-w-1/2">
              <div className="overflow-x-auto">
                {isEdit && (
                  // TODO - odělit na 2 komponenty
                  <EmailTemplateEdit
                    isSignedIn={isSignedIn}
                    templateSlug={templateSlug}
                    rows={rows}
                    userStatus={userStatus}
                    tempSignatureCreatedAt={tempSignatureCreatedAt}
                  />
                )}
                {!isEdit && (
                  <div className="flex justify-center">
                    <EmailTemplateEdit
                      isSignedIn={isSignedIn}
                      templateSlug={templateSlug}
                      rows={rows}
                      userStatus={userStatus}
                      tempSignatureCreatedAt={tempSignatureCreatedAt}
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="min-w-1/2">
              <div className={`sticky ${!isEdit ? 'top-20' : 'top-4'} w-full`}>
                <SignaturePreview />
              </div>
            </div>
          </div>
        </Container>
      )}
      {!isEdit && (
        <PreviewEditPanel
          isSavingOrder={isSavingOrder}
          isSignedIn={isSignedIn}
          userStatus={userStatus}
        />
      )}
    </div>
  );
};
