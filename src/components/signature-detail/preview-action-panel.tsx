import React from 'react';
import { useSignatureStore } from '@/src/store/content-edit-add-store';
import { EmailTemplateView } from './content-view/signature-view';
import { useModal } from '@/src/components/ui/modal-system';
import { Container } from '@/src/components/ui/container';
import { Button } from '@/src/components/ui/button';

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
                Preview
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
                    Preview
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
    modal({
      content: (
        <div className="py-4">
          <EmailTemplateView rows={rows} />
        </div>
      ),
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
