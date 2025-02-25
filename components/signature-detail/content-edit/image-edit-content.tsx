/* eslint-disable @typescript-eslint/no-explicit-any */

import { useCallback } from "react";
import { useSignatureStore } from "@/components/signature-detail/store/content-edit-add-store";
import ImageUploaderCrop from "@/components/ui/image-uploader-crop/image-uploader-crop";

export const ImageEditContent = (props: any) => {
  const { components, contentPathToEdit } = props;
  const { setContent } = useSignatureStore();
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
      setContent(
        `${contentPathToEdit}.components[0].originalImagePreview`,
        originalImage,
      );

      setContent(`${contentPathToEdit}.components[0].src`, "");
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

  const onInit = useCallback(() => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  }, []);

  return (
    <ImageUploaderCrop
      onSetCropImagePreview={handleCropImagePreview}
      onSetOriginalImagePreview={handleOriginalImagePreview}
      originalImagePreview={imageComponent.originalImagePreview}
      onSetImageSettings={handleImageSettings}
      imageSettings={imageComponent.imageSettings}
      imageName={imageComponent.id}
      previewWidthInit={imageComponent.previewWidth}
      onSetPreviewWidth={handlePreviewWidth}
      onInit={onInit}
    />
  );
};
