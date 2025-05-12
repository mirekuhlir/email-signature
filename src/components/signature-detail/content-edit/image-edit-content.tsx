/* eslint-disable @typescript-eslint/no-explicit-any */

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSignatureStore } from '@/src/store/content-edit-add-store';
import ImageUploadCrop from '@/src/components/ui/image-uploader-crop/image-uploader-crop';
import { useContentEditStore } from '@/src/store/content-edit-add-path-store';
import { countImageComponents } from '@/src/utils/content';
import { Button } from '@/src/components/ui/button';
import TextInput from '@/src/components/ui/text-input';
import { useForm } from 'react-hook-form';
import { Typography } from '@/src/components/ui/typography';
import { generateRandomId } from '@/src/utils/generateRandomId';
import SelectBase from '../../ui/select-base';
import { ImageComponent } from '@/src/types/signature';
import { CollapsibleSection } from '@/src/components/ui/collapsible-section';
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
  const [showLinkInput, setShowLinkInput] = useState(false);
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

  const ImageLink = () => {
    const {
      register,
      handleSubmit,
      reset,
      formState: { errors },
    } = useForm({
      mode: 'onSubmit',
    });

    const onSubmitLink = (data: any) => {
      const trimmedLink = data.link.trim();
      if (!trimmedLink) {
        // If input is empty, remove the link
        setContent(`${contentPathToEdit}.components[0].link`, '');
        setContentEdit({
          subEdit: null,
        });
        setShowLinkInput(false);
        removeEditingSectionId(imageComponent.id);
        return;
      }

      let href = trimmedLink;
      if (!/^https?:\/\//i.test(href)) {
        href = `https://${href}`;
      }
      setContent(`${contentPathToEdit}.components[0].link`, href);
      setContentEdit({
        subEdit: null,
      });
      setShowLinkInput(false);
      removeEditingSectionId(imageComponent.id);
    };

    useEffect(() => {
      if (showLinkInput && imageComponent.link) {
        reset({ link: imageComponent.link });
      }
    }, [reset]);

    return (
      <>
        <div className="pb-2">
          <div
            className={
              showLinkInput ? 'bg-white p-4 shadow-md rounded-md mb-8' : ''
            }
          >
            {showLinkInput && (
              <div className="mt-2 p-3">
                <form
                  onSubmit={handleSubmit(onSubmitLink)}
                  className="space-y-4"
                >
                  <TextInput
                    label="Link URL"
                    name="link"
                    register={register}
                    errors={errors}
                    placeholder="Enter URL (e.g. https://example.com)"
                    validation={{
                      pattern: {
                        value:
                          /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
                        message: 'Please enter a valid URL',
                      },
                    }}
                  />
                  <div className="flex justify-between">
                    <Button
                      variant="outline"
                      type="button"
                      onClick={() => {
                        setShowLinkInput(false);
                        setContentEdit({
                          subEdit: null,
                        });
                        removeEditingSectionId(imageComponent.id);
                      }}
                    >
                      Close
                    </Button>
                    <Button type="submit" variant="blue">
                      Save
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {!showLinkInput && (
              <>
                {imageComponent?.link && (
                  <>
                    <div className="py-2">
                      <Typography
                        variant="large"
                        className="text-gray-900 break-all"
                      >
                        {imageComponent.link}
                      </Typography>
                    </div>
                    <Button
                      variant="blue"
                      onClick={() => {
                        setContentEdit({
                          subEdit: 'edit-link',
                        });
                        addEditingSectionId(imageComponent.id);
                        setShowLinkInput(true);
                      }}
                    >
                      {'Edit Link'}
                    </Button>
                  </>
                )}

                {!imageComponent?.link && (
                  <>
                    <div className="pb-1">
                      <Typography variant="labelBase">
                        Add link to image
                      </Typography>
                    </div>
                    <Button
                      variant="blue"
                      onClick={() => {
                        setShowLinkInput(true);
                        setContentEdit({
                          subEdit: 'edit-link',
                        });
                        addEditingSectionId(imageComponent.id);
                      }}
                    >
                      Add Link
                    </Button>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </>
    );
  };

  const ImageHorizontalAlign = () => {
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
              <ImageLink />
            </CollapsibleSection>
          ) : null
        }
        horizontalAlign={
          isImage && !isImageLoading ? <ImageHorizontalAlign /> : null
        }
      />
    </>
  );
};
