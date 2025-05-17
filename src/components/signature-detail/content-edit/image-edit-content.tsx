/* eslint-disable @typescript-eslint/no-explicit-any */

import { useCallback, useMemo, useState } from 'react';
import { useSignatureStore } from '@/src/store/content-edit-add-store';
import ImageUploadCrop from '@/src/components/ui/image-uploader-crop/image-uploader-crop';
import { useContentEditStore } from '@/src/store/content-edit-add-path-store';
import { countImageComponents } from '@/src/utils/content';
import { Typography } from '@/src/components/ui/typography';
import { generateRandomId } from '@/src/utils/generateRandomId';
import SelectBase from '../../ui/select-base';
import { ImageComponent } from '@/src/types/signature';
import { CollapsibleSection } from '@/src/components/ui/collapsible-section';
import { LinkComponent } from './add-link';

interface ImageHorizontalAlignProps {
  imageComponent: ImageComponent;
  contentPathToEdit: string;
  setContent: (path: string, value: any) => void;
}

const ImageHorizontalAlign = (props: ImageHorizontalAlignProps) => {
  const { imageComponent, contentPathToEdit, setContent } = props;
  return (
    <div className="w-full sm:w-1/4">
      <Typography variant="labelBase">Horizontal alignment</Typography>
      <SelectBase
        options={[
          { value: '0 auto 0 0', label: 'Left' },
          {
            value: '0 auto 0 auto',
            label: 'Center',
          },
          { value: '0 0 0 auto', label: 'Right' },
        ]}
        value={imageComponent.margin}
        onChange={(value: string) => {
          setContent(`${contentPathToEdit}.components[0].margin`, value);
        }}
      />
    </div>
  );
};

interface ImageEditContentProps {
  components: ImageComponent[];
  contentPathToEdit: string;
  isSignedIn: boolean;
}

export const ImageEditContent = (props: ImageEditContentProps) => {
  const { components, contentPathToEdit, isSignedIn } = props;
  const { setContent, rows } = useSignatureStore();
  const {
    setContentEdit,
    contentEdit,
    addEditingSectionId,
    removeEditingSectionId,
  } = useContentEditStore();
  const imageComponent: ImageComponent = components[0];
  const [imageIsResizing, setImageIsResizing] = useState(false);

  const handleCropImagePreview = useCallback(
    (croppedImage: string) => {
      setContent(
        `${contentPathToEdit}.components[0].cropImagePreview`,
        croppedImage,
      );
    },
    [contentPathToEdit, setContent],
  );

  const handleImageSettings = useCallback(
    (imageSettings: any) => {
      setContent(
        `${contentPathToEdit}.components[0].imageSettings`,
        imageSettings,
      );
    },
    [contentPathToEdit, setContent],
  );

  const handlePreviewWidth = useCallback(
    (width: number) => {
      setContent(`${contentPathToEdit}.components[0].previewWidth`, width);
    },
    [contentPathToEdit, setContent],
  );

  const handleOriginalImage = useCallback(
    (originalImage: File | null) => {
      if (originalImage instanceof File) {
        const newFileName = `${imageComponent.id}-${generateRandomId(4)}.jpg`;
        const modifiedFile = new File([originalImage], newFileName, {
          type: originalImage.type,
          lastModified: Date.now(),
        });

        setContent(
          `${contentPathToEdit}.components[0].originalImageFile`,
          modifiedFile,
        );
        // remove image
      } else {
        setContent(`${contentPathToEdit}.components[0].originalSrc`, '');
        setContent(`${contentPathToEdit}.components[0].originalImageFile`, '');
      }
    },
    [contentPathToEdit, setContent, imageComponent.id],
  );

  const handleImageLoadingChange = useCallback(
    (isLoading: boolean) => {
      setContentEdit({ isImageLoading: isLoading });
    },
    [setContentEdit],
  );

  const imageCount = useMemo(() => {
    if (isSignedIn) {
      return;
    }

    return countImageComponents(rows);
  }, [isSignedIn, rows]);

  const isImageLoading = contentEdit.isImageLoading;

  const isImage =
    (imageComponent.originalSrc || imageComponent.cropImagePreview) &&
    imageComponent.imageSettings;

  const handleResizing = useCallback((isResizing: boolean) => {
    setImageIsResizing(isResizing);
  }, []);

  return (
    <>
      {imageIsResizing && (
        <div className="mt-2">
          <Typography
            variant="labelBase"
            className={`text-center ${
              imageIsResizing ? 'text-gray-800' : 'text-transparent'
            }`}
          >
            Resizing...
          </Typography>
        </div>
      )}
      <ImageUploadCrop
        onSetCropImagePreview={handleCropImagePreview}
        onSetImageSettings={handleImageSettings}
        imageSettings={imageComponent.imageSettings}
        imageName={imageComponent.id}
        previewWidthInit={imageComponent.previewWidth}
        onSetPreviewWidth={handlePreviewWidth}
        originalSrc={imageComponent.originalSrc}
        originalImageFile={imageComponent.originalImageFile}
        onSetOriginalImage={handleOriginalImage}
        onLoadingChange={handleImageLoadingChange}
        isSignedIn={isSignedIn}
        imageCount={imageCount}
        onResizing={handleResizing}
        isResizing={imageIsResizing}
        imageLink={
          isImage && !isImageLoading ? (
            <CollapsibleSection title="Image link">
              <LinkComponent
                component={imageComponent}
                contentPathToEdit={contentPathToEdit}
                setContent={setContent}
                setContentEdit={setContentEdit}
                addEditingSectionId={addEditingSectionId}
                removeEditingSectionId={removeEditingSectionId}
              />
            </CollapsibleSection>
          ) : null
        }
        horizontalAlign={
          isImage && !isImageLoading ? (
            <CollapsibleSection title="Horizontal alignment">
              <ImageHorizontalAlign
                imageComponent={imageComponent}
                contentPathToEdit={contentPathToEdit}
                setContent={setContent}
              />
            </CollapsibleSection>
          ) : null
        }
      />
    </>
  );
};
