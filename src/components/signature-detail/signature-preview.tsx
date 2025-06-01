import React, { useMemo } from 'react';
import { useSignatureStore } from '@/src/store/content-edit-add-store';
import { EmailTemplateView } from './content-view/signature-view';
import { TitleSwitch } from '../ui/title-switch';
import { Smartphone, Monitor, Sun, Moon } from 'lucide-react';
import { useMediaQuery } from '@/src/hooks/useMediaQuery';
import { MEDIA_QUERIES } from '@/src/constants/mediaQueries';
import { getInvertedSignatureRows } from '@/src/utils/colorUtils';
import { Container } from '../ui/container';
import { MAX_IMAGE_WIDTH } from '@/supabase/functions/_shared/const';

export const SignaturePreview: React.FC = () => {
  const isDesktopScreen = useMediaQuery(MEDIA_QUERIES.MD);

  const {
    rows,
    isDarkMode,
    toggleDarkMode,
    isMobilePreview,
    setIsMobilePreview,
  } = useSignatureStore();

  const invertedRows = useMemo(() => {
    return getInvertedSignatureRows(rows);
  }, [rows]);

  const rowsToDisplay = isDarkMode ? invertedRows : rows;

  const outerDivClasses = 'py-2 flex justify-center';

  const wrapperDivClasses = [
    !isDesktopScreen || isMobilePreview ? 'inline-flex' : '',

    isDarkMode ? 'bg-neutral-800' : '',
    !isDesktopScreen ? 'w-full px-4' : '',

    isDesktopScreen && !isMobilePreview ? 'w-full' : '',

    isMobilePreview && isDesktopScreen
      ? `border-x border-b rounded-b-lg ${
          isDarkMode ? 'border-gray-500' : 'border-gray-400'
        }`
      : '',
  ]
    .filter(Boolean)
    .join(' ');

  const mobilePreviewWidth = isMobilePreview ? `w-[${MAX_IMAGE_WIDTH}px]` : '';

  const containerDivClasses = [
    isDesktopScreen ? 'pt-4 pb-4' : '',
    isDesktopScreen ? 'px-4' : '',
    !isDesktopScreen ? 'py-4' : '',
    mobilePreviewWidth ? mobilePreviewWidth : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <>
      <div
        id="email-signature-light-for-copy"
        style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}
        aria-hidden="true"
      >
        <EmailTemplateView rows={rows} />
      </div>

      <div className={`sm:px-0 lg:px-4`}>
        <Container>
          {/*      <div className="flex justify-center sm:justify-start mb-1">
            <Typography variant="lead">Preview</Typography>
          </div>
 */}
          <div className="flex flex-col sm:flex-row items-center w-full justify-center sm:justify-start mb-0 sm:mb-2 space-y-4 sm:space-y-0 sm:space-x-8">
            {isDesktopScreen && (
              <TitleSwitch
                checked={isMobilePreview}
                onCheckedChange={setIsMobilePreview}
                leftContent={
                  <div className="flex items-center">
                    <Monitor size={16} className="mr-1" />
                    Desktop
                  </div>
                }
                rightContent={
                  <div className="flex items-center">
                    <Smartphone size={16} className="mr-1" />
                    Mobile
                  </div>
                }
                aria-label="Switch between desktop and mobile view"
              />
            )}
            <TitleSwitch
              checked={isDarkMode}
              onCheckedChange={toggleDarkMode}
              leftContent={
                <div className="flex items-center">
                  <Sun size={16} className="mr-1" />
                  Light
                </div>
              }
              rightContent={
                <div className="flex items-center">
                  <Moon size={16} className="mr-1" />
                  Dark
                </div>
              }
              aria-label="Switch between light and dark mode"
            />
          </div>
        </Container>

        <div className={`${outerDivClasses} w-full max-w-6xl mx-auto`}>
          <div className={`${wrapperDivClasses}`}>
            <div className={containerDivClasses}>
              <EmailTemplateView rows={rowsToDisplay} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignaturePreview;
