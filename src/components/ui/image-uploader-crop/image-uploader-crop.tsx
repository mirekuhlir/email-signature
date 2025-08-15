'use client';
import {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
  ReactNode,
} from 'react';
import ReactCrop, { type Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Button } from '@/src/components/ui/button';
import { debounce } from 'lodash';
import {
  getDefaultCrop,
  imageWidthDefault,
  convertFileToJpeg,
  generateCroppedImageFromParams,
  type BorderRadii,
} from './utils';
import { useMediaQuery } from '@/src/hooks/useMediaQuery';
import { useToast } from '@/src/components/ui/toast';
import { LoadingInfo } from '../../signature-detail/content-edit/content-edit';
import { MAX_IMAGE_WIDTH } from '@/supabase/functions/_shared/const';
import { CollapsibleSection } from '../collapsible-section';
import {
  ImageDropZone,
  WidthSliderControl,
  AspectRatioSelector,
  BorderRadiusControls,
} from './controls';

// Resolution multiplier for output images
const RESOLUTION_MULTIPLIER = 1;

interface ImageSettings {
  crop: Crop;
  aspect?: number | string;
  isCircular: boolean;
  borderRadius?: {
    topLeft: number;
    topRight: number;
    bottomRight: number;
    bottomLeft: number;
  };
}

interface ImageUploaderProps {
  onSetCropImagePreview?: (preview: string) => void;
  onSetOriginalImage?: (file: File | null) => void;
  onSetImageSettings?: (info: ImageSettings | string) => void;
  onSetPreviewWidth?: (width: number) => void;
  onLoadingChange?: (isLoading: boolean) => void;
  onSetTempRectCropPreview?: (preview: string) => void;
  onSetIsCornersPreviewing?: (isPreviewing: boolean) => void;
  onResizingChange?: (isResizing: boolean) => void;
  imageName: string;
  imageSettings?: ImageSettings;
  previewWidthInit?: number;
  onInit?: () => void;
  originalSrc?: string;
  isSignedIn?: boolean;
  imageCount?: number;
  originalImageFile?: File;
  imageLink?: ReactNode;
  horizontalAlign?: ReactNode;
}

export default function ImageUploadCrop(props: ImageUploaderProps) {
  const {
    onSetCropImagePreview,
    onSetOriginalImage,
    imageSettings,
    onSetImageSettings,
    previewWidthInit,
    onSetPreviewWidth,
    onInit,
    originalSrc,
    onLoadingChange,
    originalImageFile,
    imageLink,
    horizontalAlign,
    onSetTempRectCropPreview,
    onSetIsCornersPreviewing,
    onResizingChange,
  } = props;

  const isDesktop = useMediaQuery('(min-width: 768px)');
  const { toast } = useToast();

  const [crop, setCrop] = useState<Crop | undefined>(undefined);
  const [aspect, setAspect] = useState<number | undefined>(undefined);
  const [isCircular, setIsCircular] = useState(false);
  const [borderRadii, setBorderRadii] = useState<BorderRadii>({
    topLeft: 0,
    topRight: 0,
    bottomRight: 0,
    bottomLeft: 0,
  });

  const [croppedImageData, setCroppedImageData] = useState<string | null>(null);
  const [previewWidth, setPreviewWidth] = useState<number | undefined>(
    undefined,
  );
  const [isDragging, setIsDragging] = useState(false);

  const [lastKnownNatWidth, setLastKnownNatWidth] = useState<number | null>(
    null,
  );
  const [lastKnownNatHeight, setLastKnownNatHeight] = useState<number | null>(
    null,
  );
  const [lastKnownDispWidth, setLastKnownDispWidth] = useState<number | null>(
    null,
  );
  const [lastKnownDispHeight, setLastKnownDispHeight] = useState<number | null>(
    null,
  );
  const [originalImageNaturalHeight, setOriginalImageNaturalHeight] = useState<
    number | null
  >(null);

  const [originalImagePreview, setOriginalImagePreview] = useState<
    string | undefined
  >(undefined);
  const [isLoadingOriginalImage, setIsLoadingOriginalImage] = useState(false);

  const [isResizing, setIsResizing] = useState(false);

  const imgRef = useRef<HTMLImageElement>(null);
  // Removed hidden canvas and local pica instance; handled in utils

  const getDefaultCropForCurrentImage = useCallback((aspectRatio: number) => {
    if (!imgRef.current) return undefined;
    const { width: imgWidth, height: imgHeight } =
      imgRef.current.getBoundingClientRect();
    const defaultCrop = getDefaultCrop(aspectRatio, imgWidth, imgHeight);

    return {
      ...defaultCrop,
      unit: '%' as const,
    };
  }, []);

  const onSelectFile = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files || files.length === 0) return;
      const file = files[0];
      try {
        const jpegFile = await convertFileToJpeg(file);
        const fileUrl = URL.createObjectURL(jpegFile);
        setOriginalImagePreview(fileUrl);
        setIsResizing(false);
        onResizingChange?.(false);
        setCroppedImageData(null);
        onSetOriginalImage?.(jpegFile);
      } catch (err) {
        console.error('Failed to convert file to JPEG', err);
        setIsResizing(false);
        onResizingChange?.(false);
      }
    },
    [onSetOriginalImage, onResizingChange],
  );

  const handleFileDrop = useCallback(
    async (file: File) => {
      if (!file.type.startsWith('image/')) return;
      try {
        const jpegFile = await convertFileToJpeg(file);
        const fileUrl = URL.createObjectURL(jpegFile);
        setOriginalImagePreview(fileUrl);
        setIsResizing(false);
        onResizingChange?.(false);
        setCroppedImageData(null);
        onSetOriginalImage?.(jpegFile);
      } catch (err) {
        console.error('Failed to convert dropped file to JPEG', err);
      }
    },
    [onSetOriginalImage, onResizingChange],
  );

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.currentTarget === e.target) {
      setIsDragging(false);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        const file = files[0];
        if (file.type.startsWith('image/')) {
          handleFileDrop(file);
        }
      }
    },
    [handleFileDrop],
  );

  const loadOriginalImage = useCallback(
    async (url: string) => {
      setIsLoadingOriginalImage(true);
      onLoadingChange?.(true);
      // Reset last known dimensions when a new image starts loading
      setLastKnownNatWidth(null);
      setLastKnownNatHeight(null);
      setLastKnownDispWidth(null);
      setLastKnownDispHeight(null);
      try {
        const response = await fetch(url, { mode: 'cors' });
        if (!response.ok) {
          throw new Error('Failed to fetch image');
        }
        const blob = await response.blob();
        const fileUrl = URL.createObjectURL(blob);
        setOriginalImagePreview(fileUrl);
        setCroppedImageData(null);
      } catch (error) {
        console.error('Error fetching image from URL:', error);
        toast({
          title: 'Error',
          description: 'Failed to load image.',
          variant: 'error',
          duration: 0,
        });
      } finally {
        setIsLoadingOriginalImage(false);
        onLoadingChange?.(false);
      }
    },
    [onLoadingChange, toast],
  );

  useEffect(() => {
    if (originalSrc) {
      loadOriginalImage(originalSrc);
    } else if (originalImageFile?.name) {
      loadOriginalImage(URL.createObjectURL(originalImageFile));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [originalSrc, originalImageFile]);

  const generateCroppedImage = useCallback((): Promise<string | null> => {
    const currentNaturalWidth =
      imgRef.current?.naturalWidth ?? lastKnownNatWidth;
    const currentNaturalHeight =
      imgRef.current?.naturalHeight ?? lastKnownNatHeight;
    const rect = imgRef.current?.getBoundingClientRect();
    const currentDisplayWidth = rect?.width ?? lastKnownDispWidth;
    const currentDisplayHeight = rect?.height ?? lastKnownDispHeight;

    return generateCroppedImageFromParams({
      crop,
      previewWidth,
      originalImagePreview,
      naturalWidth: currentNaturalWidth ?? null,
      naturalHeight: currentNaturalHeight ?? null,
      displayWidth: currentDisplayWidth ?? null,
      displayHeight: currentDisplayHeight ?? null,
      isCircular,
      borderRadii,
      resolutionMultiplier: RESOLUTION_MULTIPLIER,
    });
  }, [
    crop,
    previewWidth,
    originalImagePreview,
    lastKnownNatWidth,
    lastKnownNatHeight,
    lastKnownDispWidth,
    lastKnownDispHeight,
    isCircular,
    borderRadii,
  ]);

  const handleCrop = useCallback(async () => {
    const croppedImageDataUrl = await generateCroppedImage();
    if (croppedImageDataUrl) {
      onSetCropImagePreview?.(croppedImageDataUrl);
      setCroppedImageData(croppedImageDataUrl);
      onSetImageSettings?.({
        crop: crop!,
        aspect: aspect === undefined ? 'free' : aspect,
        isCircular,
        borderRadius: borderRadii,
      });

      // Cropping finished → switch off corners preview and clear temp image
      onSetIsCornersPreviewing?.(false);
      onSetTempRectCropPreview?.('');
    }
  }, [
    onSetCropImagePreview,
    onSetImageSettings,
    onSetIsCornersPreviewing,
    crop,
    aspect,
    isCircular,
    borderRadii,
    generateCroppedImage,
    onSetTempRectCropPreview,
  ]);

  const debouncedHandleCrop = useMemo(
    () =>
      // First debounce with 400ms, then call handleCrop after 100ms delay
      debounce(() => {
        setIsResizing(true);
        onResizingChange?.(true);

        setTimeout(() => {
          handleCrop()
            .catch((err) => {
              console.error('Error in debounced crop handler:', err);
            })
            .finally(() => {
              setIsResizing(false);
              onResizingChange?.(false);
            });
          // display resizing text
        }, 100);
      }, 1000),
    [handleCrop, onResizingChange],
  );

  useEffect(() => {
    if (originalImagePreview) {
      debouncedHandleCrop();
    }
    return () => {
      debouncedHandleCrop.cancel();
    };
  }, [
    previewWidth,
    debouncedHandleCrop,
    crop,
    isCircular,
    borderRadii,
    originalImagePreview,
  ]);

  // Update the second useEffect to also work with promises
  useEffect(() => {
    if (croppedImageData) {
      // For the final output, we want to keep the resolution multiplier image data
      // So we just pass the image data directly without re-rendering
      onSetCropImagePreview?.(croppedImageData);
    }
  }, [croppedImageData, onSetCropImagePreview]);

  const handleDeleteImage = useCallback(() => {
    onSetCropImagePreview?.('');
    setCroppedImageData?.(null);
    onSetOriginalImage?.(null);
    onSetImageSettings?.('');

    // Clean up the object URL before setting to undefined to prevent memory leaks
    if (originalImagePreview) {
      URL.revokeObjectURL(originalImagePreview);
    }
    setOriginalImagePreview(undefined);

    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [
    onSetCropImagePreview,
    onSetOriginalImage,
    onSetImageSettings,
    originalImagePreview,
  ]);

  const handleAspectChange = useCallback(
    (newAspect: number, circular: boolean = false) => {
      // Immediately disable ratio buttons and related controls for snappier UX
      setIsResizing(true);
      onResizingChange?.(true);
      if (circular) {
        setIsCircular(true);
        setAspect(1);
        const newCrop = getDefaultCropForCurrentImage(1);
        if (newCrop) {
          // Ensure the unit is preserved as percentage
          setCrop({
            ...newCrop,
            unit: '%',
          });
        }
      } else {
        setIsCircular(false);
        setAspect(newAspect);
        const newCrop = getDefaultCropForCurrentImage(newAspect);
        if (newCrop) {
          // Ensure the unit is preserved as percentage
          setCrop({
            ...newCrop,
            unit: '%',
          });
        }
      }
    },
    [getDefaultCropForCurrentImage, onResizingChange],
  );

  const handlePreviewWidthChange = useCallback(
    (value: number) => {
      setPreviewWidth(value);
      onSetPreviewWidth?.(value);
    },
    [onSetPreviewWidth],
  );

  const handleBorderRadiusTopLeftChange = useCallback(
    (value: number) => {
      const updated = { ...borderRadii, topLeft: value };
      setBorderRadii(updated);
      onSetImageSettings?.({
        crop: crop!,
        aspect: aspect === undefined ? 'free' : aspect,
        isCircular,
        borderRadius: updated,
      });
    },
    [onSetImageSettings, crop, aspect, isCircular, borderRadii],
  );
  const handleBorderRadiusTopRightChange = useCallback(
    (value: number) => {
      const updated = { ...borderRadii, topRight: value };
      setBorderRadii(updated);
      onSetImageSettings?.({
        crop: crop!,
        aspect: aspect === undefined ? 'free' : aspect,
        isCircular,
        borderRadius: updated,
      });
    },
    [onSetImageSettings, crop, aspect, isCircular, borderRadii],
  );
  const handleBorderRadiusBottomRightChange = useCallback(
    (value: number) => {
      const updated = { ...borderRadii, bottomRight: value };
      setBorderRadii(updated);
      onSetImageSettings?.({
        crop: crop!,
        aspect: aspect === undefined ? 'free' : aspect,
        isCircular,
        borderRadius: updated,
      });
    },
    [onSetImageSettings, crop, aspect, isCircular, borderRadii],
  );
  const handleBorderRadiusBottomLeftChange = useCallback(
    (value: number) => {
      const updated = { ...borderRadii, bottomLeft: value };
      setBorderRadii(updated);
      onSetImageSettings?.({
        crop: crop!,
        aspect: aspect === undefined ? 'free' : aspect,
        isCircular,
        borderRadius: updated,
      });
    },
    [onSetImageSettings, crop, aspect, isCircular, borderRadii],
  );

  const handleCornersPreviewStart = useCallback(async () => {
    onSetIsCornersPreviewing?.(true);
    // Ensure we have a rectangular base preview
    try {
      const rectPreview = await generateCroppedImageFromParams({
        crop,
        previewWidth,
        originalImagePreview,
        naturalWidth: imgRef.current?.naturalWidth ?? lastKnownNatWidth ?? null,
        naturalHeight:
          imgRef.current?.naturalHeight ?? lastKnownNatHeight ?? null,
        displayWidth:
          imgRef.current?.getBoundingClientRect().width ??
          lastKnownDispWidth ??
          null,
        displayHeight:
          imgRef.current?.getBoundingClientRect().height ??
          lastKnownDispHeight ??
          null,
        isCircular: false,
        borderRadii: { topLeft: 0, topRight: 0, bottomRight: 0, bottomLeft: 0 },
        resolutionMultiplier: RESOLUTION_MULTIPLIER,
      });
      if (rectPreview) {
        onSetTempRectCropPreview?.(rectPreview);
      }
    } catch {
      // ignore
    }
  }, [
    onSetIsCornersPreviewing,
    crop,
    previewWidth,
    originalImagePreview,
    lastKnownNatWidth,
    lastKnownNatHeight,
    lastKnownDispWidth,
    lastKnownDispHeight,
    onSetTempRectCropPreview,
  ]);

  const handleCornersPreviewEnd = useCallback(() => {
    // Keep previewing ON until the new pica image is generated in handleCrop
  }, []);

  useEffect(() => {
    if (!crop?.width) {
      if (imageSettings?.crop) {
        // Ensure the loaded crop settings use percentage units
        setCrop({
          ...imageSettings.crop,
          unit: '%' as const,
        });
      } else {
        setCrop(getDefaultCropForCurrentImage(1));
      }

      // Check if aspect is "free" string or undefined in imageSettings
      // or use the saved aspect, or default to 1 if nothing is saved
      if (
        typeof imageSettings?.aspect === 'string' &&
        imageSettings.aspect === 'free'
      ) {
        setAspect(undefined);
      } else if (typeof imageSettings?.aspect === 'number') {
        setAspect(imageSettings.aspect);
      } else if (imageSettings?.aspect === undefined) {
        setAspect(undefined);
      } else {
        setAspect(1);
      }
      setIsCircular(imageSettings?.isCircular || false);
      setBorderRadii(
        imageSettings?.borderRadius || {
          topLeft: 0,
          topRight: 0,
          bottomRight: 0,
          bottomLeft: 0,
        },
      );
    }
  }, [imageSettings, crop?.width, getDefaultCropForCurrentImage]);

  useEffect(() => {
    if (!previewWidth) {
      setPreviewWidth(previewWidthInit || imageWidthDefault);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [previewWidthInit]);

  const initCalledRef = useRef(false);

  useEffect(() => {
    if (croppedImageData && !initCalledRef.current) {
      initCalledRef.current = true;
      onInit?.();
      setIsResizing(false);
    }
  }, [croppedImageData, onInit]);

  if (isLoadingOriginalImage) {
    return (
      <div className="flex items-center justify-center w-full h-[70px] mt-5">
        <LoadingInfo text="Loading image. Please wait..." />
      </div>
    );
  }

  const maxImageRadius = Math.round((previewWidth ?? MAX_IMAGE_WIDTH) / 2);

  return (
    <>
      <div className="w-full mb-2">
        <CollapsibleSection title="Image" isInitOpen={true}>
          {!originalImagePreview && !originalSrc ? (
            <ImageDropZone
              isDesktop={isDesktop}
              isDragging={isDragging}
              onDragEnter={handleDragEnter}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onFileChange={onSelectFile}
            />
          ) : (
            <>
              {croppedImageData && (
                <div className="space-y-2">
                  <WidthSliderControl
                    previewWidth={previewWidth}
                    isResizing={isResizing}
                    onChange={handlePreviewWidthChange}
                  />
                </div>
              )}
              {originalImagePreview && (
                <>
                  <div className="overflow-hidden bg-black/5 max-w-[90%] sm:max-w-[100%] mx-0 sm:mx-auto">
                    <ReactCrop
                      crop={crop}
                      onChange={(c, percentCrop) => {
                        if (percentCrop) {
                          setCrop(percentCrop);
                        } else {
                          setCrop({
                            ...c,
                            unit: crop?.unit || '%',
                          });
                        }
                      }}
                      aspect={aspect}
                      circularCrop={isCircular}
                      style={{ width: '100%' }}
                    >
                      <img
                        ref={imgRef}
                        alt="Crop me"
                        src={originalImagePreview}
                        onLoad={(e) => {
                          const img = e.currentTarget;
                          if (img) {
                            setLastKnownNatWidth(img.naturalWidth);
                            setLastKnownNatHeight(img.naturalHeight);

                            const rect = img.getBoundingClientRect();
                            setLastKnownDispWidth(rect.width);
                            setLastKnownDispHeight(rect.height);

                            setOriginalImageNaturalHeight(img.naturalHeight);

                            // Initialize crop here if not already set by imageSettings
                            // and if current dimensions are valid
                            if (
                              !crop?.width &&
                              rect.width > 0 &&
                              rect.height > 0 &&
                              !imageSettings?.crop?.width
                            ) {
                              const defaultCrop = getDefaultCrop(
                                aspect ?? 1, // Use current aspect or fallback
                                rect.width,
                                rect.height,
                              );
                              setCrop({
                                ...defaultCrop,
                                unit: '%' as const,
                              });
                            }

                            // If the image height has changed, update the crop
                            if (
                              originalImageNaturalHeight &&
                              originalImageNaturalHeight > 0 &&
                              img.naturalHeight !== originalImageNaturalHeight
                            ) {
                              const defaultCrop = getDefaultCrop(
                                aspect ?? 1,
                                rect.width,
                                rect.height,
                              );
                              setCrop({
                                ...defaultCrop,
                                unit: '%' as const,
                              });
                            }
                          }
                        }}
                        className="max-h-[600px] w-full object-contain"
                      />
                    </ReactCrop>
                  </div>
                  <div>
                    <div className="mt-10 mb-4 flex justify-center">
                      <Button
                        variant="orange"
                        size="md"
                        onClick={handleDeleteImage}
                      >
                        Replace image
                      </Button>
                    </div>
                  </div>
                  <AspectRatioSelector
                    isCircular={isCircular}
                    aspect={aspect}
                    onSelectAspect={handleAspectChange}
                    onSelectFree={() => {
                      // Immediately disable ratio buttons and related controls for snappier UX
                      setIsResizing(true);
                      onResizingChange?.(true);
                      setIsCircular(false);
                      setAspect(undefined);
                      if (crop) {
                        setCrop({ ...crop, unit: '%' });
                      }
                    }}
                    isDisabled={isResizing}
                  />
                </>
              )}
            </>
          )}
        </CollapsibleSection>

        {originalImagePreview && !isCircular && croppedImageData && (
          <CollapsibleSection title="Image rounded corners">
            <div className="space-y-2">
              {croppedImageData && (
                <BorderRadiusControls
                  isDisabled={isResizing}
                  maxRadius={maxImageRadius}
                  values={borderRadii}
                  onTopLeft={handleBorderRadiusTopLeftChange}
                  onTopRight={handleBorderRadiusTopRightChange}
                  onBottomLeft={handleBorderRadiusBottomLeftChange}
                  onBottomRight={handleBorderRadiusBottomRightChange}
                  onPointerStart={handleCornersPreviewStart}
                  onPointerEnd={handleCornersPreviewEnd}
                />
              )}
            </div>
          </CollapsibleSection>
        )}
      </div>
      {originalImagePreview && croppedImageData && (
        <>
          {imageLink}
          {horizontalAlign}
        </>
      )}
    </>
  );
}
