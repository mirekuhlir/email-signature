import React, { useState, useMemo } from 'react';
import { useSignatureStore } from '@/src/store/content-edit-add-store';
import { EmailTemplateView } from './content-view/signature-view';
import { useModal } from '@/src/components/ui/modal-system';
import { Container } from '@/src/components/ui/container';
import { Button } from '@/src/components/ui/button';
import { TitleSwitch } from '../ui/title-switch';
import { Smartphone, Monitor, Sun, Moon } from 'lucide-react';
import { useMediaQuery } from '@/src/hooks/useMediaQuery';
import { MEDIA_QUERIES } from '@/src/constants/mediaQueries';
import { getInvertedSignatureRows } from '@/src/utils/colorUtils';

interface ActionPanelProps {
  visible: boolean;
  isSaving?: boolean;
  onClose?: () => void;
  onPreview?: () => void;
  onSave?: () => void;
  isVisibleOnlyPreview?: boolean;
  isVisibleOnlyClose?: boolean;
}

export const ActionPanel: React.FC<ActionPanelProps> = ({
  visible,
  isSaving = false,
  onClose,
  onSave,
  onPreview,
  isVisibleOnlyPreview = false,
  isVisibleOnlyClose = false,
}) => {
  if (!visible) return null;

  const renderButtons = () => {
    if (isVisibleOnlyClose) {
      return (
        <div className="flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      );
    }

    if (isVisibleOnlyPreview) {
      return (
        <div className="flex justify-end">
          <Button variant="outline" onClick={onPreview}>
            View
          </Button>
        </div>
      );
    }

    return (
      <div className="flex justify-between items-center">
        {onClose && (
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        )}
        <div className="flex space-x-2">
          {onPreview && (
            <Button variant="outline" onClick={onPreview}>
              View
            </Button>
          )}
          {onSave && !isSaving && (
            <Button variant="blue" size="md" onClick={onSave}>
              Save
            </Button>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <div
        className={`fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg py-4 z-40`}
      >
        <Container>{renderButtons()}</Container>
      </div>
    </>
  );
};

interface PreviewActionPanelProps {
  visible: boolean;
  isSignedIn: boolean;
  onClose?: () => void;
  onSave?: () => void;
  isVisibleOnlyPreview?: boolean;
  isVisibleOnlyClose?: boolean;
}

const PreviewActionPanel: React.FC<PreviewActionPanelProps> = ({
  visible,
  onClose,
  onSave,
  isSignedIn,
  isVisibleOnlyPreview = false,
  isVisibleOnlyClose = false,
}) => {
  const { modal } = useModal();

  if (!visible) return null;

  const showPreview = () => {
    const ModalContent = () => {
      const [isMobilePreview, setIsMobilePreview] = useState(false);
      const isDesktopScreen = useMediaQuery(MEDIA_QUERIES.MD);

      const { rows, isDarkMode, toggleDarkMode } = useSignatureStore();

      const invertedRows = useMemo(() => {
        return getInvertedSignatureRows(rows);
      }, [rows]);

      const rowsToDisplay = isDarkMode ? invertedRows : rows;

      return (
        <div
          className={`px-4 py-8 flex flex-col items-center ${
            isDarkMode ? 'bg-gray-900 text-white' : 'bg-white'
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
                    Mobil
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
              className={`py-4 ${isDesktopScreen ? 'px-4' : ''} rounded overflow-hidden ${
                isDesktopScreen && isMobilePreview
                  ? `border-x ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`
                  : ''
              } ${isMobilePreview ? 'w-[375px]' : 'w-full'}`}
            >
              <EmailTemplateView rows={rowsToDisplay} />
            </div>
          </div>
        </div>
      );
    };

    modal({
      content: <ModalContent />,
      isZeroPadding: true,
      size: 'large',
    });
  };

  return (
    <>
      <ActionPanel
        visible={visible}
        onPreview={showPreview}
        onSave={isSignedIn ? onSave : undefined}
        onClose={onClose}
        isVisibleOnlyPreview={isVisibleOnlyPreview}
        isVisibleOnlyClose={isVisibleOnlyClose}
      />
    </>
  );
};

export default PreviewActionPanel;
