import React from 'react';
import { useModal } from '@/src/components/ui/modal-system';
import { Container } from '@/src/components/ui/container';
import { Button } from '@/src/components/ui/button';
import SignaturePreview from './signature-preview';

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
            Preview
          </Button>
        </div>
      );
    }

    return (
      <div className="flex justify-between items-center sm:flex-row-reverse">
        {onClose && (
          <Button
            variant="outline"
            onClick={onClose}
            buttonClassName="sm:min-w-35"
          >
            Close
          </Button>
        )}
        <div className="flex gap-8 sm:flex-row-reverse">
          {onPreview && (
            <Button
              variant="outline"
              onClick={onPreview}
              buttonClassName="min-w-24 sm:min-w-35"
            >
              Preview
            </Button>
          )}
          {onSave && !isSaving && (
            <Button
              size="md"
              onClick={onSave}
              buttonClassName="min-w-24 sm:min-w-35"
            >
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
        className={`fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-gray-200 shadow-lg py-2 z-40`}
      >
        <Container>{renderButtons()}</Container>
      </div>
    </>
  );
};

interface PreviewActionPanelProps {
  visible: boolean;
  onClose?: () => void;
  onSave?: () => void;
  isVisibleOnlyPreview?: boolean;
  isVisibleOnlyClose?: boolean;
}

const PreviewActionPanel: React.FC<PreviewActionPanelProps> = ({
  visible,
  onClose,
  onSave,
  isVisibleOnlyPreview = false,
  isVisibleOnlyClose = false,
}) => {
  const { modal } = useModal();

  if (!visible) return null;

  const showPreview = () => {
    modal({
      content: (
        <div className="pt-6">
          <SignaturePreview />
        </div>
      ),
      isZeroPadding: true,
      size: 'fullscreen',
    });
  };

  return (
    <>
      <ActionPanel
        visible={visible}
        onPreview={showPreview}
        onSave={onSave}
        onClose={onClose}
        isVisibleOnlyPreview={isVisibleOnlyPreview}
        isVisibleOnlyClose={isVisibleOnlyClose}
      />
    </>
  );
};

export default PreviewActionPanel;
