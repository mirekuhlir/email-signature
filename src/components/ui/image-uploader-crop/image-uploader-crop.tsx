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
import {
  baseStyles,
  Button,
  sizes,
  variants,
} from '@/src/components/ui/button';
import Slider from '../slider';
import { debounce } from 'lodash';
import { getDefaultCrop, imageWidthDefault } from './utils';
import { Typography } from '../typography';
import { useMediaQuery } from '@/src/hooks/useMediaQuery';
import { useToast } from '@/src/components/ui/toast';
import { LoadingInfo } from '../../signature-detail/content-edit/content-edit';
import pica from 'pica';
import {
  MIN_IMAGE_WIDTH,
  MAX_IMAGE_WIDTH,
} from '@/supabase/functions/_shared/const';
import { CollapsibleSection } from '../collapsible-section';

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
  imageName: string;
  imageSettings?: ImageSettings;
  previewWidthInit?: number;
  onInit?: () => void;
  originalSrc?: string;
  isSignedIn?: boolean;
  imageCount?: number;
  originalImageFile?: File;
  onResizing?: (isResizing: boolean) => void;
  isResizing?: boolean;
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
    onResizing,
    isResizing,
    imageLink,
    horizontalAlign,
  } = props;

  const isDesktop = useMediaQuery('(min-width: 768px)');
  const { toast } = useToast();

  const [crop, setCrop] = useState<Crop | undefined>(undefined);
  const [aspect, setAspect] = useState<number | undefined>(undefined);
  const [isCircular, setIsCircular] = useState(false);
  const [borderRadii, setBorderRadii] = useState({
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

  const imgRef = useRef<HTMLImageElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  const picaInstanceRef = useRef(pica());

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
      if (files && files.length > 0) {
        const file = files[0];

        const fileUrl = URL.createObjectURL(file);
        setOriginalImagePreview(fileUrl);

        const img = new Image();
        img.src = fileUrl;

        const picaInstance = new pica();

        img.onload = async () => {
          // Create a canvas to draw the image
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (ctx) {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            const blob = await picaInstance.toBlob(canvas, 'image/jpeg', 0.9);

            const jpegFile = new File(
              [blob],
              file.name.replace(/\.[^/.]+$/, '') + '.jpg',
              { type: 'image/jpg' },
            );

            onResizing?.(false);

            setCroppedImageData(null);
            onSetOriginalImage?.(jpegFile); // Pass the File object instead of the data URL
          }
        };
      }
    },
    [onResizing, onSetOriginalImage],
  );

  const handleFileDrop = useCallback(
    (file: File) => {
      if (file.type.startsWith('image/')) {
        const fileUrl = URL.createObjectURL(file);
        setOriginalImagePreview(fileUrl);
        onResizing?.(false);
        setCroppedImageData(null);
        onSetOriginalImage?.(file);
      }
    },
    [onResizing, onSetOriginalImage],
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
    let currentImageNaturalWidth: number | null = null;
    let currentImageNaturalHeight: number | null = null;
    let currentImageDisplayWidth: number | null = null;
    let currentImageDisplayHeight: number | null = null;

    if (imgRef.current) {
      currentImageNaturalWidth = imgRef.current.naturalWidth;
      currentImageNaturalHeight = imgRef.current.naturalHeight;
      const rect = imgRef.current.getBoundingClientRect();
      currentImageDisplayWidth = rect.width;
      currentImageDisplayHeight = rect.height;
    } else {
      currentImageNaturalWidth = lastKnownNatWidth;
      currentImageNaturalHeight = lastKnownNatHeight;
      currentImageDisplayWidth = lastKnownDispWidth;
      currentImageDisplayHeight = lastKnownDispHeight;
    }

    if (
      !(crop?.width && crop?.height && previewWidth && originalImagePreview) ||
      currentImageNaturalWidth === null ||
      currentImageNaturalHeight === null ||
      currentImageDisplayWidth === null ||
      currentImageDisplayHeight === null ||
      currentImageNaturalWidth === 0 ||
      currentImageNaturalHeight === 0 ||
      currentImageDisplayWidth === 0 ||
      currentImageDisplayHeight === 0
    ) {
      return Promise.resolve(null);
    }

    try {
      let cropXPercent, cropYPercent, cropWidthPercent, cropHeightPercent;

      if (crop.unit === '%') {
        cropWidthPercent = crop.width;
        cropHeightPercent = crop.height;
        cropXPercent = crop.x;
        cropYPercent = crop.y;
      } else {
        // Convert pixel crop to percentage based on current display dimensions
        cropWidthPercent = (crop.width / currentImageDisplayWidth) * 100;
        cropHeightPercent = (crop.height / currentImageDisplayHeight) * 100;
        cropXPercent = (crop.x / currentImageDisplayWidth) * 100;
        cropYPercent = (crop.y / currentImageDisplayHeight) * 100;
      }

      // Convert percentage crop (which is relative to the *displayed* image in ReactCrop)
      // to absolute pixels on the *displayed* image
      const cropDisplayX = (cropXPercent / 100) * currentImageDisplayWidth;
      const cropDisplayY = (cropYPercent / 100) * currentImageDisplayHeight;
      const cropDisplayWidth =
        (cropWidthPercent / 100) * currentImageDisplayWidth;
      const cropDisplayHeight =
        (cropHeightPercent / 100) * currentImageDisplayHeight;

      // Calculate scaling factors from displayed size to natural size
      const displayToNaturalRatioX =
        currentImageNaturalWidth / currentImageDisplayWidth;
      const displayToNaturalRatioY =
        currentImageNaturalHeight / currentImageDisplayHeight;

      // Convert crop from displayed image coordinates to natural image coordinates
      const cropNaturalX = cropDisplayX * displayToNaturalRatioX;
      const cropNaturalY = cropDisplayY * displayToNaturalRatioY;
      const cropNaturalWidth = cropDisplayWidth * displayToNaturalRatioX;
      const cropNaturalHeight = cropDisplayHeight * displayToNaturalRatioY;

      const originalImg = new Image();
      originalImg.crossOrigin = 'anonymous';

      // Return a promise that resolves with the final image URL
      return new Promise<string | null>((resolve, reject) => {
        originalImg.onload = async () => {
          try {
            // Calculate output dimensions
            const outputWidth = previewWidth;
            const outputHeight = Math.round(
              (cropNaturalHeight / cropNaturalWidth) * outputWidth,
            );

            // Create source canvas for the cropped area at full resolution
            const sourceCanvas = document.createElement('canvas');
            sourceCanvas.width = cropNaturalWidth;
            sourceCanvas.height = cropNaturalHeight;
            const sourceCtx = sourceCanvas.getContext('2d');
            if (!sourceCtx) {
              reject("Couldn't get source canvas context");
              return;
            }
            sourceCtx.drawImage(
              originalImg,
              cropNaturalX,
              cropNaturalY,
              cropNaturalWidth,
              cropNaturalHeight,
              0,
              0,
              cropNaturalWidth,
              cropNaturalHeight,
            );

            // Create target canvas for the final resized image
            const targetCanvas = document.createElement('canvas');
            targetCanvas.width = outputWidth;
            targetCanvas.height = outputHeight;

            // Use pica to resize from sourceCanvas to targetCanvas
            await picaInstanceRef.current.resize(sourceCanvas, targetCanvas, {
              // quality: 3, // Optional: Higher quality, slower
            });

            // Get context of the target canvas to apply masking
            const targetCtx = targetCanvas.getContext('2d', {
              alpha: true, // Ensure context supports transparency
            });

            if (!targetCtx) {
              reject("Couldn't get target canvas context");
              return;
            }

            // Apply circular mask if needed (AFTER resizing)
            if (isCircular) {
              targetCtx.globalCompositeOperation = 'destination-in';
              targetCtx.beginPath();
              targetCtx.arc(
                outputWidth / 2,
                outputHeight / 2,
                Math.min(outputWidth, outputHeight) / 2,
                0,
                Math.PI * 2,
              );
              targetCtx.fill();
              targetCtx.globalCompositeOperation = 'source-over'; // Reset composite operation
            }
            // Apply border radius if needed (AFTER resizing)
            else if (
              borderRadii.topLeft > 0 ||
              borderRadii.topRight > 0 ||
              borderRadii.bottomRight > 0 ||
              borderRadii.bottomLeft > 0
            ) {
              targetCtx.globalCompositeOperation = 'destination-in';
              targetCtx.beginPath();

              const rTL = Math.min(
                borderRadii.topLeft,
                outputWidth / 2,
                outputHeight / 2,
              );
              const rTR = Math.min(
                borderRadii.topRight,
                outputWidth / 2,
                outputHeight / 2,
              );
              const rBR = Math.min(
                borderRadii.bottomRight,
                outputWidth / 2,
                outputHeight / 2,
              );
              const rBL = Math.min(
                borderRadii.bottomLeft,
                outputWidth / 2,
                outputHeight / 2,
              );

              targetCtx.moveTo(rTL, 0);
              targetCtx.lineTo(outputWidth - rTR, 0);
              targetCtx.arcTo(outputWidth, 0, outputWidth, rTR, rTR);
              targetCtx.lineTo(outputWidth, outputHeight - rBR);
              targetCtx.arcTo(
                outputWidth,
                outputHeight,
                outputWidth - rBR,
                outputHeight,
                rBR,
              );
              targetCtx.lineTo(rBL, outputHeight);
              targetCtx.arcTo(0, outputHeight, 0, outputHeight - rBL, rBL);
              targetCtx.lineTo(0, rTL);
              targetCtx.arcTo(0, 0, rTL, 0, rTL);

              targetCtx.closePath();
              targetCtx.fill();
              targetCtx.globalCompositeOperation = 'source-over'; // Reset composite operation
            }

            const imageDataUrl = targetCanvas.toDataURL('image/png', 0.9);
            resolve(imageDataUrl);
          } catch (error) {
            console.error('Error processing image with pica:', error);
            reject(error);
            return null;
          }
        };

        originalImg.onerror = () => {
          console.error('Failed to load original image for processing');
          reject('Failed to load original image');
          return null;
        };

        originalImg.src = originalImagePreview;
      })
        .then((dataUrl) => dataUrl)
        .catch((error) => {
          console.error('Error in image processing promise:', error);
          return null;
        });
    } catch (error) {
      console.error('Error in crop operation:', error);

      return Promise.resolve(null);
    }
  }, [
    crop,
    previewWidth,
    originalImagePreview,
    lastKnownNatWidth,
    lastKnownNatHeight,
    lastKnownDispWidth,
    lastKnownDispHeight,
    isCircular,
    borderRadii.topLeft,
    borderRadii.topRight,
    borderRadii.bottomRight,
    borderRadii.bottomLeft,
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
    }
  }, [
    onSetCropImagePreview,
    onSetImageSettings,
    crop,
    aspect,
    isCircular,
    borderRadii,
    generateCroppedImage,
  ]);

  const debouncedHandleCrop = useMemo(
    () =>
      // First debounce with 400ms, then call handleCrop after 100ms delay
      debounce(() => {
        onResizing?.(true);

        setTimeout(() => {
          handleCrop()
            .catch((err) => {
              console.error('Error in debounced crop handler:', err);
            })
            .finally(() => {
              onResizing?.(false);
            });
          // display resizing text
        }, 100);
      }, 1000),
    [handleCrop, onResizing],
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
      const img = new Image();
      img.onload = () => {
        if (!previewCanvasRef.current || !previewWidth) return;

        // Calculate simple scale without pixel ratio multiplication
        const scale = previewWidth / img.width;
        const scaledHeight = img.height * scale;

        // Set canvas dimensions directly to the display size
        previewCanvasRef.current.width = previewWidth;
        previewCanvasRef.current.height = scaledHeight;
        previewCanvasRef.current.style.width = `${previewWidth}px`;
        previewCanvasRef.current.style.height = `${scaledHeight}px`;

        const ctx = previewCanvasRef.current.getContext('2d', { alpha: true });
        if (!ctx) return;

        // Apply high-quality settings without pixel ratio scaling
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Clear the canvas to ensure transparency
        ctx.clearRect(0, 0, previewWidth, scaledHeight);
        ctx.drawImage(img, 0, 0, previewWidth, scaledHeight);

        // Always use PNG format with maximum quality to ensure transparency
        // Even though the final output might be JPEG, keep PNG for preview to handle transparency correctly during adjustments.
        // The final conversion to JPEG happens in generateCroppedImage.
        const newDataUrl = previewCanvasRef.current.toDataURL('image/png', 1.0);
        onSetCropImagePreview?.(newDataUrl);
      };
      img.src = croppedImageData; // This is now potentially a JPEG URL from generateCroppedImage
    }
  }, [croppedImageData, previewWidth, onSetCropImagePreview]);

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
  }, [
    onSetCropImagePreview,
    onSetOriginalImage,
    onSetImageSettings,
    originalImagePreview,
  ]);

  const handleAspectChange = useCallback(
    (newAspect: number, circular: boolean = false) => {
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
    [getDefaultCropForCurrentImage],
  );

  const handlePreviewWidthChange = useCallback(
    (value: number) => {
      setPreviewWidth(value);
      onSetPreviewWidth?.(value);
    },
    [onSetPreviewWidth],
  );

  const handleBorderRadiusTopLeftChange = useCallback((value: number) => {
    setBorderRadii((prev) => ({ ...prev, topLeft: value }));
  }, []);
  const handleBorderRadiusTopRightChange = useCallback((value: number) => {
    setBorderRadii((prev) => ({ ...prev, topRight: value }));
  }, []);
  const handleBorderRadiusBottomRightChange = useCallback((value: number) => {
    setBorderRadii((prev) => ({ ...prev, bottomRight: value }));
  }, []);
  const handleBorderRadiusBottomLeftChange = useCallback((value: number) => {
    setBorderRadii((prev) => ({ ...prev, bottomLeft: value }));
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
      onResizing?.(false);
    }
  }, [croppedImageData, onInit, onResizing]);

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
      <canvas ref={previewCanvasRef} className="hidden" />
      <div className="w-full mb-2">
        <CollapsibleSection title="Image" isInitOpen={true}>
          {!originalImagePreview && !originalSrc ? (
            <div
              className={`grid place-items-center p-4 border border-dashed ${isDragging ? 'border-orange-500 bg-orange-50' : 'border-gray-300'} rounded min-h-[200px] w-[80%] md:w-[400px] mx-auto transition-colors duration-200`}
              onDragEnter={isDesktop ? handleDragEnter : undefined}
              onDragOver={isDesktop ? handleDragOver : undefined}
              onDragLeave={isDesktop ? handleDragLeave : undefined}
              onDrop={isDesktop ? handleDrop : undefined}
            >
              <div className="flex flex-col items-center space-y-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <Typography variant="body" className="text-center">
                  {isDesktop
                    ? isDragging
                      ? 'Drop image here'
                      : 'Drag and drop an image here, or'
                    : 'Select an image to upload'}
                </Typography>
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  onChange={onSelectFile}
                  className="hidden"
                />
                <label
                  htmlFor="file-upload"
                  className={`${baseStyles} ${variants.orange} ${sizes.md} cursor-pointer`}
                >
                  Select image
                </label>
              </div>
            </div>
          ) : (
            <>
              {croppedImageData && (
                <div className="space-y-2">
                  <>
                    <Typography variant="labelBase">
                      {`Width of image: ${
                        croppedImageData ? `${previewWidth} px` : ''
                      }`}
                    </Typography>
                    <div className="pb-3">
                      <Slider
                        min={MIN_IMAGE_WIDTH}
                        max={MAX_IMAGE_WIDTH}
                        units="pixels"
                        defaultValue={previewWidth}
                        onChange={handlePreviewWidthChange}
                        id="slider"
                        isDisabled={isResizing}
                      />
                    </div>
                  </>
                </div>
              )}
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
              <div className="mb-4">
                <Typography variant="labelBase">Aspect ratio</Typography>
                <div className="flex flex-wrap gap-y-4 gap-x-8">
                  <Button
                    size="md"
                    variant="outline"
                    onClick={() => {
                      handleAspectChange(1, false);
                    }}
                    selected={!isCircular && aspect === 1}
                  >
                    1:1
                  </Button>
                  <Button
                    size="md"
                    variant="outline"
                    onClick={() => {
                      handleAspectChange(3 / 2, false);
                    }}
                    selected={!isCircular && aspect === 3 / 2}
                  >
                    3:2
                  </Button>
                  <Button
                    size="md"
                    variant="outline"
                    onClick={() => {
                      handleAspectChange(2 / 3, false);
                    }}
                    selected={!isCircular && aspect === 2 / 3}
                  >
                    2:3
                  </Button>
                  <Button
                    size="md"
                    variant="outline"
                    onClick={() => {
                      handleAspectChange(1, true);
                    }}
                    selected={isCircular}
                  >
                    Circular
                  </Button>
                  <Button
                    size="md"
                    variant="outline"
                    onClick={() => {
                      setIsCircular(false);
                      setAspect(undefined);
                      if (crop) {
                        setCrop({
                          ...crop,
                          unit: '%',
                        });
                      }
                    }}
                    selected={!isCircular && aspect === undefined}
                  >
                    Free
                  </Button>
                </div>
              </div>
            </>
          )}
        </CollapsibleSection>

        {originalImagePreview && !isCircular && (
          <CollapsibleSection title="Image rounded corners">
            <div className="space-y-2">
              {croppedImageData && (
                <div className="space-y-2">
                  <div className="space-y-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <div className="mb-1">
                          <Typography variant="labelBase">
                            {`Top Left: ${borderRadii.topLeft} px`}
                          </Typography>
                        </div>
                        <Slider
                          min={0}
                          max={maxImageRadius}
                          units="px"
                          value={borderRadii.topLeft}
                          onChange={handleBorderRadiusTopLeftChange}
                          id="border-radius-slider-tl"
                          isDisabled={isResizing}
                        />
                      </div>
                      <div>
                        <div className="mb-1">
                          <Typography variant="labelBase">
                            {`Top Right: ${borderRadii.topRight} px`}
                          </Typography>
                        </div>
                        <Slider
                          min={0}
                          max={maxImageRadius}
                          units="px"
                          value={borderRadii.topRight}
                          onChange={handleBorderRadiusTopRightChange}
                          id="border-radius-slider-tr"
                          isDisabled={isResizing}
                        />
                      </div>
                      <div>
                        <div className="mb-1">
                          <Typography variant="labelBase">
                            {`Bottom Left: ${borderRadii.bottomLeft} px`}
                          </Typography>
                        </div>
                        <Slider
                          min={0}
                          max={maxImageRadius}
                          units="px"
                          value={borderRadii.bottomLeft}
                          onChange={handleBorderRadiusBottomLeftChange}
                          id="border-radius-slider-bl"
                          isDisabled={isResizing}
                        />
                      </div>
                      <div>
                        <div className="mb-1">
                          <Typography variant="labelBase">
                            {`Bottom Right: ${borderRadii.bottomRight} px`}
                          </Typography>
                        </div>
                        <Slider
                          min={0}
                          max={maxImageRadius}
                          units="px"
                          value={borderRadii.bottomRight}
                          onChange={handleBorderRadiusBottomRightChange}
                          id="border-radius-slider-br"
                          isDisabled={isResizing}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CollapsibleSection>
        )}
      </div>
      {imageLink}
      {horizontalAlign}
    </>
  );
}
