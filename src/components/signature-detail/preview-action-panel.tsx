import React from 'react';
import { useModal } from '@/src/components/ui/modal-system';
import { Container } from '@/src/components/ui/container';
import { Button } from '@/src/components/ui/button';
import SignaturePreview from './signature-preview';
import EditPanel from './edit-panel';
import { useMediaQuery } from '@/src/hooks/useMediaQuery';
import { MEDIA_QUERIES } from '@/src/constants/mediaQueries';

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
  const isMobile = useMediaQuery(MEDIA_QUERIES.MOBILE);

  if (!visible) return null;

  const renderButtons = () => {
    if (isVisibleOnlyClose) {
      return (
        <div className="flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      );
    }

    if (isVisibleOnlyPreview && isMobile) {
      return (
        <div className="flex justify-end">
          <Button variant="outline" onClick={onPreview}>
            Preview
          </Button>
        </div>
      );
    }

    return (
      <div className="flex justify-between items-center">
        {onClose && (
          <Button
            variant="outline"
            onClick={onClose}
            buttonClassName="sm:min-w-35"
          >
            Cancel
          </Button>
        )}
        <div className="flex gap-4 sm:gap-8">
          {onPreview && isMobile && (
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

  if (isVisibleOnlyPreview && !isMobile) {
    return null;
  }

  return (
    <>
      <EditPanel>
        <Container>{renderButtons()}</Container>
      </EditPanel>
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

  const handleSave = () => {
    onSave?.();
    window.scrollTo(0, 0);
  };

  return (
    <>
      <ActionPanel
        visible={visible}
        onPreview={showPreview}
        onSave={handleSave}
        onClose={onClose}
        isVisibleOnlyPreview={isVisibleOnlyPreview}
        isVisibleOnlyClose={isVisibleOnlyClose}
      />
    </>
  );
};

export default PreviewActionPanel;
