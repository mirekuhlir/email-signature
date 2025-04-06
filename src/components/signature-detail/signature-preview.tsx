import React, { useState, useMemo } from 'react';
import { useSignatureStore } from '@/src/store/content-edit-add-store';
import { EmailTemplateView } from './content-view/signature-view';
import { TitleSwitch } from '../ui/title-switch';
import { Smartphone, Monitor, Sun, Moon } from 'lucide-react';
import { useMediaQuery } from '@/src/hooks/useMediaQuery';
import { MEDIA_QUERIES } from '@/src/constants/mediaQueries';
import { getInvertedSignatureRows } from '@/src/utils/colorUtils';

export const SignaturePreview: React.FC = () => {
  const [isMobilePreview, setIsMobilePreview] = useState(false);
  const isDesktopScreen = useMediaQuery(MEDIA_QUERIES.MD);

  const { rows, isDarkMode, toggleDarkMode } = useSignatureStore();

  const invertedRows = useMemo(() => {
    return getInvertedSignatureRows(rows);
  }, [rows]);

  const rowsToDisplay = isDarkMode ? invertedRows : rows;

  const outerDivClasses = 'py-2 flex justify-center';

  const wrapperDivClasses = [
    'rounded',
    !isDesktopScreen || isMobilePreview ? 'inline-flex' : '',

    isDarkMode ? 'bg-gray-900' : '',
    !isDesktopScreen ? 'w-full' : '',

    isDesktopScreen && !isMobilePreview ? 'w-full' : '',

    isDesktopScreen && isMobilePreview ? 'pb-4' : '',
    isDesktopScreen && isMobilePreview && isDarkMode ? 'px-4' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const containerDivClasses = [
    isDesktopScreen ? 'pt-4 pb-4' : '',
    isDesktopScreen ? 'px-4' : '',
    !isDesktopScreen ? 'py-4' : '',

    isMobilePreview || !isDesktopScreen ? 'max-w-[375px]' : '',

    isMobilePreview && isDesktopScreen
      ? `border-x border-b rounded-b-lg ${
          isDarkMode ? 'border-gray-500' : 'border-gray-400'
        }`
      : '',
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

      <div className={`py-4`}>
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-8 mb-8 w-full justify-center">
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

        <div className={outerDivClasses}>
          <div className={wrapperDivClasses}>
            <div className={containerDivClasses}>
              <EmailTemplateView id="email-signature" rows={rowsToDisplay} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignaturePreview;
