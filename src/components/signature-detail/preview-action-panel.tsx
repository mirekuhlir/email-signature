import React, { useState } from 'react';
import { useSignatureStore } from '@/src/store/content-edit-add-store';
import { EmailTemplateView } from './content-view/signature-view';
import { useModal } from '@/src/components/ui/modal-system';
import { Container } from '@/src/components/ui/container';
import { Button } from '@/src/components/ui/button';
import { TitleSwitch } from '../ui/title-switch';
import { Smartphone, Monitor } from 'lucide-react';
import { useMediaQuery } from '@/src/hooks/useMediaQuery';
import { MEDIA_QUERIES } from '@/src/constants/mediaQueries';

interface ActionPanelProps {
  visible: boolean;
  isSaving?: boolean;
  onClose?: () => void;
  onPreview?: () => void;
  onSave?: () => void;
  isVisibleOnlyPreview?: boolean;
}

export const ActionPanel: React.FC<ActionPanelProps> = ({
  visible,
  isSaving = false,
  onClose,
  onSave,
  onPreview,
  isVisibleOnlyPreview = false,
}) => {
  if (!visible) return null;

  return (
    <>
      <div
        className={`fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg py-4 z-40`}
      >
        <Container>
          {isVisibleOnlyPreview && (
            <div className="flex justify-end">
              <Button variant="outline" onClick={onPreview}>
                View
              </Button>
            </div>
          )}

          {!isVisibleOnlyPreview && (
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
                {onSave && !isSaving && !isVisibleOnlyPreview && (
                  <Button variant="blue" size="md" onClick={onSave}>
                    Save
                  </Button>
                )}
              </div>
            </div>
          )}
        </Container>
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
}

const PreviewActionPanel: React.FC<PreviewActionPanelProps> = ({
  visible,
  onClose,
  onSave,
  isSignedIn,
  isVisibleOnlyPreview = false,
}) => {
  const { rows } = useSignatureStore();
  const { modal } = useModal();

  if (!visible) return null;

  const showPreview = () => {
    const ModalContent = () => {
      const [isMobilePreview, setIsMobilePreview] = useState(false);
      const isDesktopScreen = useMediaQuery(MEDIA_QUERIES.MD);

      return (
        <div className="py-4 flex flex-col items-center">
          {isDesktopScreen && (
            <div className="flex items-center space-x-4 mb-8 w-full justify-center">
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
            </div>
          )}

          <div className="w-full rounded flex justify-center">
            <div
              className={`px-4 transition-all duration-300 ease-in-out rounded overflow-hidden ${
                isMobilePreview ? 'w-[375px] shadow-lg' : 'w-full'
              }`}
            >
              <EmailTemplateView rows={rows} />
            </div>
          </div>
        </div>
      );
    };

    modal({
      content: <ModalContent />,
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
      />
    </>
  );
};

export default PreviewActionPanel;
