/* eslint-disable @typescript-eslint/no-explicit-any */

import { useCallback } from 'react';
import { useSignatureStore } from '@/src/store/content-edit-add-store';
import ImageUploadCrop from '@/src/components/ui/image-uploader-crop/image-uploader-crop';
import { useContentEditStore } from '@/src/store/content-edit-add-path-store';

export const ImageEditContent = (props: any) => {
  const { components, contentPathToEdit, isSignedIn } = props;
  const { setContent } = useSignatureStore();
  const { setContentEdit } = useContentEditStore();
  const imageComponent = components[0];

  const handleCropImagePreview = useCallback(
    (croppedImage: string) => {
      setContent(
        `${contentPathToEdit}.components[0].cropImagePreview`,
        croppedImage,
      );
    },
    [contentPathToEdit, setContent],
  );

  const handleOriginalImagePreview = useCallback(
    (originalImage: string) => {
      setContent(`${contentPathToEdit}.components[0].src`, '');

      setContent(
        `${contentPathToEdit}.components[0].originalImagePreview`,
        originalImage,
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
        const newFileName = `${imageComponent.id}-${originalImage.name}`;
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

  const onInit = useCallback(() => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  }, []);

  const handleImageLoadingChange = useCallback(
    (isLoading: boolean) => {
      setContentEdit({ isImageLoading: isLoading });
    },
    [setContentEdit],
  );

  return (
    <ImageUploadCrop
      onSetCropImagePreview={handleCropImagePreview}
      onSetOriginalImagePreview={handleOriginalImagePreview}
      originalImagePreview={imageComponent.originalImagePreview}
      onSetImageSettings={handleImageSettings}
      imageSettings={imageComponent.imageSettings}
      imageName={imageComponent.id}
      previewWidthInit={imageComponent.previewWidth}
      onSetPreviewWidth={handlePreviewWidth}
      onInit={onInit}
      srcOriginalImage={imageComponent.originalSrc}
      onSetOriginalImage={handleOriginalImage}
      onLoadingChange={handleImageLoadingChange}
      isSignedIn={isSignedIn}
    />
  );
};
