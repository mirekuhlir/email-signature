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
    modal({
      content: <SignaturePreview />,
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
