/* eslint-disable @typescript-eslint/no-explicit-any */

import { useCallback, useMemo, useState, useEffect } from 'react';
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
import { VerticalAlign } from '../column-settings/column-settings';
import { get } from 'lodash';

interface ImageHorizontalAlignProps {
  imageComponent: ImageComponent;
  contentPathToEdit: string;
  setContent: (path: string, value: any) => void;
}

const ImageHorizontalAlign = (props: ImageHorizontalAlignProps) => {
  const { imageComponent, contentPathToEdit, setContent } = props;
  return (
    <div className="w-full">
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
  const [verticalAlign, setVerticalAlign] = useState('top');

  // Define path for the parent column's style (same pattern as content-edit.tsx)
  const columnPath = contentPathToEdit.substring(
    0,
    contentPathToEdit.lastIndexOf('.rows['),
  );
  const path = `${columnPath}.style`;
  const originalStyle = useMemo(() => get(rows, path) || {}, [rows, path]);

  // Initialize verticalAlign from existing column style data
  useEffect(() => {
    const currentVerticalAlign = originalStyle.verticalAlign || 'top';
    setVerticalAlign(currentVerticalAlign);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateVerticalAlign = useCallback(
    (value: string) => {
      const currentStyle = get(rows, path) || {};
      setContent(path, {
        ...currentStyle,
        verticalAlign: value,
      });
    },
    [path, setContent, rows],
  );

  // Apply vertical align changes immediately (same pattern as other properties in content-edit.tsx)
  useEffect(() => {
    if (verticalAlign) {
      updateVerticalAlign(verticalAlign);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [verticalAlign]);

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

  return (
    <>
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
        imageLink={
          isImage && !isImageLoading ? (
            <CollapsibleSection title="Image link">
              <LinkComponent
                component={imageComponent}
                contentPathToEdit={`${contentPathToEdit}.components[0].link`}
                setContent={setContent}
                setContentEdit={setContentEdit}
                addEditingSectionId={addEditingSectionId}
                removeEditingSectionId={removeEditingSectionId}
                title="Add link to image"
              />
            </CollapsibleSection>
          ) : null
        }
        horizontalAlign={
          isImage && !isImageLoading ? (
            <CollapsibleSection title="Alignment">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <ImageHorizontalAlign
                  imageComponent={imageComponent}
                  contentPathToEdit={contentPathToEdit}
                  setContent={setContent}
                />
                <VerticalAlign
                  verticalAlign={verticalAlign}
                  setVerticalAlign={setVerticalAlign}
                />
              </div>
            </CollapsibleSection>
          ) : null
        }
      />
    </>
  );
};
