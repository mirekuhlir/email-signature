/* eslint-disable @typescript-eslint/no-explicit-any */

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSignatureStore } from '@/src/store/content-edit-add-store';
import ImageUploadCrop from '@/src/components/ui/image-uploader-crop/image-uploader-crop';
import { useContentEditStore } from '@/src/store/content-edit-add-path-store';
import { countImageComponents } from '@/src/utils/content';
import { generateRandomId } from '@/src/utils/generateRandomId';
import { Button } from '@/src/components/ui/button';
import TextInput from '@/src/components/ui/text-input';
import { useForm } from 'react-hook-form';
import { Typography } from '@/src/components/ui/typography';
import Modal from '@/src/components/ui/modal';
import { Hr } from '../../ui/hr';

export const ImageEditContent = (props: any) => {
  const { components, contentPathToEdit, isSignedIn } = props;
  const { setContent, rows } = useSignatureStore();
  const { setContentEdit, contentEdit } = useContentEditStore();
  const imageComponent = components[0];
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

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
        const newFileName = `${generateRandomId(imageComponent.id.length)}-${generateRandomId(4)}.png`;
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

  const imageCount = useMemo(() => {
    if (isSignedIn) {
      return;
    }

    return countImageComponents(rows);
  }, [isSignedIn, rows]);

  const onSubmitLink = (data: any) => {
    let href = data.link;
    if (!/^https?:\/\//i.test(href)) {
      href = `https://${href}`;
    }
    setContent(`${contentPathToEdit}.components[0].link`, href);
    setContentEdit({
      subEdit: null,
    });
    setShowLinkInput(false);
  };

  const handleRemoveLink = () => {
    setContent(`${contentPathToEdit}.components[0].link`, '');
    setShowRemoveModal(false);
    setShowLinkInput(false);
    setContentEdit({
      subEdit: null,
    });
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
          <Hr className="mb-6" />

          <div className="pb-6">
            <div className="bg-white p-4 shadow-md rounded-md">
              {!showLinkInput && (
                <div className="pb-1">
                  <Typography variant="labelBase">Image Link</Typography>
                </div>
              )}
              {imageComponent.link ? (
                <>
                  {!showLinkInput && (
                    <div className="pb-6">
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
                    </div>
                  )}

                  {showLinkInput && (
                    <div className="mt-2">
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
                            required: 'URL is required',
                            pattern: {
                              value:
                                /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
                              message: 'Please enter a valid URL',
                            },
                          }}
                        />
                        <div className="flex justify-between">
                          <Button
                            type="button"
                            variant="red"
                            onClick={() => setShowRemoveModal(true)}
                          >
                            Delete
                          </Button>
                          <Button variant="blue" type="submit">
                            Save
                          </Button>
                        </div>
                      </form>
                    </div>
                  )}
                </>
              ) : (
                <>
                  {!showLinkInput && (
                    <Button
                      variant="blue"
                      onClick={() => setShowLinkInput(!showLinkInput)}
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
                            required: 'URL is required',
                            pattern: {
                              value:
                                /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
                              message: 'Please enter a valid URL',
                            },
                          }}
                        />
                        <div className="flex justify-end">
                          <Button type="submit" variant="blue">
                            Save Link
                          </Button>
                        </div>
                      </form>
                    </div>
                  )}
                </>
              )}
            </div>

            {showLinkInput && (
              <div className="pb-1 pt-6 w-full flex justify-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowLinkInput(false);
                    setContentEdit({
                      subEdit: null,
                    });
                  }}
                >
                  Close
                </Button>
              </div>
            )}

            <Modal isOpen={showRemoveModal} title="Remove Link" size="small">
              <div className="space-y-4">
                <Typography variant="body">
                  Are you sure you want to remove the link from this image?
                </Typography>
                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => setShowRemoveModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button variant="red" onClick={handleRemoveLink}>
                    Remove
                  </Button>
                </div>
              </div>
            </Modal>
          </div>
        </>
      )}
    </>
  );
};
