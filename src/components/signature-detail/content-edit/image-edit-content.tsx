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
import { Hr } from '../../ui/hr';
import { generateRandomId } from '@/src/utils/generateRandomId';

export const ImageEditContent = (props: any) => {
  const { components, contentPathToEdit, isSignedIn } = props;
  const { setContent, rows } = useSignatureStore();
  const { setContentEdit, contentEdit } = useContentEditStore();
  const imageComponent = components[0];
  const [showLinkInput, setShowLinkInput] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: 'onSubmit',
  });

  useEffect(() => {
    if (showLinkInput && imageComponent.link) {
      reset({ link: imageComponent.link });
    }
  }, [showLinkInput, imageComponent.link, reset]);

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
        const newFileName = `${imageComponent.id}-${generateRandomId(4)}.png`;
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
    // TODO - asi smazat
    /* window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }) */
  }, []);

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

  const onSubmitLink = (data: any) => {
    const trimmedLink = data.link.trim();
    if (!trimmedLink) {
      // If input is empty, remove the link
      setContent(`${contentPathToEdit}.components[0].link`, '');
      setContentEdit({
        subEdit: null,
      });
      setShowLinkInput(false);
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
  };

  return (
    <>
      <ImageUploadCrop
        onSetCropImagePreview={handleCropImagePreview}
        onSetImageSettings={handleImageSettings}
        imageSettings={imageComponent.imageSettings}
        imageName={imageComponent.id}
        previewWidthInit={imageComponent.previewWidth}
        onSetPreviewWidth={handlePreviewWidth}
        onInit={onInit}
        originalSrc={imageComponent.originalSrc}
        originalImageFile={imageComponent.originalImageFile}
        onSetOriginalImage={handleOriginalImage}
        onLoadingChange={handleImageLoadingChange}
        isSignedIn={isSignedIn}
        imageCount={imageCount}
      />

      {!contentEdit.isImageLoading && (
        <>
          {imageComponent.src && <Hr className="mb-4" />}

          <div className="pb-6">
            <div
              className={
                showLinkInput ? 'bg-white p-4 shadow-md rounded-md mb-8' : ''
              }
            >
              {!showLinkInput &&
                (imageComponent.src || imageComponent.cropImagePreview) && (
                  <div className="pb-1">
                    <Typography variant="labelBase">Image Link</Typography>
                  </div>
                )}
              {imageComponent.link ? (
                <>
                  {!showLinkInput && (
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
                          setShowLinkInput(!showLinkInput);
                        }}
                      >
                        {'Edit Link'}
                      </Button>
                    </>
                  )}
                </>
              ) : (
                <>
                  {!showLinkInput &&
                    (imageComponent.src || imageComponent.cropImagePreview) && (
                      <Button
                        variant="blue"
                        onClick={() => {
                          setShowLinkInput(!showLinkInput);
                          setContentEdit({
                            subEdit: 'edit-link',
                          });
                        }}
                      >
                        Add Link
                      </Button>
                    )}

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
                </>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};
