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

  return (
    <div
      className={`py-8 flex flex-col items-center ${
        isDarkMode ? 'bg-gray-900 text-white' : 'bg-transparent'
      }`}
    >
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

      <div className="w-full rounded flex justify-center">
        <div
          className={`pb-4 pt-15 ${isDesktopScreen ? 'px-4' : ''} ${
            isDesktopScreen && isMobilePreview
              ? `border-x border-b rounded-b-lg ${isDarkMode ? 'border-gray-500' : 'border-gray-400'}`
              : ''
          } ${isMobilePreview ? 'w-[375px]' : 'w-full'}`}
        >
          <EmailTemplateView rows={rowsToDisplay} />
        </div>
      </div>
    </div>
  );
};

export default SignaturePreview;
