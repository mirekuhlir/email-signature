'use client';
import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
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
import { useModal } from '../modal-system';
import { useMediaQuery } from '@/src/hooks/useMediaQuery';
import { useToast } from '@/src/components/ui/toast';
import { LoadingInfo } from '../../signature-detail/content-edit/content-edit';
import pica from 'pica';

const MIN_IMAGE_WIDTH = 50;
const MAX_IMAGE_WIDTH = 200;

interface ImageSettings {
  crop: Crop;
  aspect?: number | string;
  isCircular: boolean;
  borderRadius?: number;
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
    isSignedIn,
    imageCount,
    originalImageFile,
  } = props;

  const { modal } = useModal();
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const { toast } = useToast();

  const [crop, setCrop] = useState<Crop | undefined>(undefined);
  const [aspect, setAspect] = useState<number | undefined>(undefined);
  const [isCircular, setIsCircular] = useState(false);
  const [borderRadius, setBorderRadius] = useState(0);
  const [croppedImageData, setCroppedImageData] = useState<string | null>(null);
  const [previewWidth, setPreviewWidth] = useState<number | undefined>(
    undefined,
  );
  const [isDragging, setIsDragging] = useState(false);

  const [originalImagePreview, setOriginalImagePreview] = useState<
    string | undefined
  >(undefined);
  const [isLoadingOriginalImage, setIsLoadingOriginalImage] = useState(false);
  const [isReplacing, setIsReplacing] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [initResizing, setInitResizing] = useState(true);

  const imgRef = useRef<HTMLImageElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  // Použití useRef místo useMemo zaručí stabilní referenci napříč rendery
  const picaInstanceRef = useRef(pica());

  const getDefaultCropForCurrentImage = useCallback((aspectRatio: number) => {
    if (!imgRef.current) return undefined;
    const { width: imgWidth, height: imgHeight } =
      imgRef.current.getBoundingClientRect();
    const defaultCrop = getDefaultCrop(aspectRatio, imgWidth, imgHeight);

    // Explicitně zajistíme, že výchozí crop používá procentuální jednotky
    return {
      ...defaultCrop,
      unit: '%' as const,
    };
  }, []);

  const onSelectFile = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        const file = files[0];

        const fileUrl = URL.createObjectURL(file);
        setOriginalImagePreview(fileUrl);
        setIsReplacing(false); // Reset isReplacing po úspěšném nahrání

        setCroppedImageData(null);
        onSetOriginalImage?.(file);
      }
    },
    [isSignedIn, onSetOriginalImage, modal, isReplacing, imageCount],
  );

  const handleFileDrop = useCallback(
    (file: File) => {
      if (file.type.startsWith('image/')) {
        const fileUrl = URL.createObjectURL(file);
        setOriginalImagePreview(fileUrl);
        setIsReplacing(false);
        setCroppedImageData(null);
        onSetOriginalImage?.(file);
      }
    },
    [onSetOriginalImage],
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
          description: 'Failed to load image. Please try again.',
          variant: 'error',
          duration: 5000,
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
  }, [originalSrc, originalImageFile]);

  const generateCroppedImage = useCallback((): Promise<string | null> => {
    if (
      imgRef.current &&
      crop?.width &&
      crop?.height &&
      previewWidth &&
      originalImagePreview
    ) {
      try {
        // Get the image and its dimensions
        const image = imgRef.current;
        const imageWidth = image.naturalWidth;
        const imageHeight = image.naturalHeight;

        // Convert crop to absolute pixels (based on actual image dimensions)
        let cropX, cropY, cropWidth, cropHeight;

        if (crop.unit === '%') {
          cropWidth = (crop.width / 100) * image.width;
          cropHeight = (crop.height / 100) * image.height;
          cropX = (crop.x / 100) * image.width;
          cropY = (crop.y / 100) * image.height;
        } else {
          cropWidth = crop.width;
          cropHeight = crop.height;
          cropX = crop.x;
          cropY = crop.y;
        }

        // Calculate scaling factors
        const displayToNaturalRatioX = imageWidth / image.width;
        const displayToNaturalRatioY = imageHeight / image.height;

        // Convert crop to natural image coordinates
        const cropNaturalX = cropX * displayToNaturalRatioX;
        const cropNaturalY = cropY * displayToNaturalRatioY;
        const cropNaturalWidth = cropWidth * displayToNaturalRatioX;
        const cropNaturalHeight = cropHeight * displayToNaturalRatioY;

        // Create a new Image object to load the original image at full resolution
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
              else if (borderRadius > 0) {
                const scaledRadius = Math.min(
                  borderRadius,
                  outputWidth / 2,
                  outputHeight / 2,
                );

                targetCtx.globalCompositeOperation = 'destination-in';
                targetCtx.beginPath();
                targetCtx.moveTo(scaledRadius, 0);
                targetCtx.lineTo(outputWidth - scaledRadius, 0);
                targetCtx.quadraticCurveTo(
                  outputWidth,
                  0,
                  outputWidth,
                  scaledRadius,
                );
                targetCtx.lineTo(outputWidth, outputHeight - scaledRadius);
                targetCtx.quadraticCurveTo(
                  outputWidth,
                  outputHeight,
                  outputWidth - scaledRadius,
                  outputHeight,
                );
                targetCtx.lineTo(scaledRadius, outputHeight);
                targetCtx.quadraticCurveTo(
                  0,
                  outputHeight,
                  0,
                  outputHeight - scaledRadius,
                );
                targetCtx.lineTo(0, scaledRadius);
                targetCtx.quadraticCurveTo(0, 0, scaledRadius, 0);
                targetCtx.closePath();
                targetCtx.fill();
                targetCtx.globalCompositeOperation = 'source-over'; // Reset composite operation
              }

              // Always use PNG format with maximum quality to ensure transparency
              const imageDataUrl = targetCanvas.toDataURL('image/png', 1.0);
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

          // Start loading the original high-resolution image
          originalImg.src = originalImagePreview;
        })
          .then((dataUrl) => dataUrl)
          .catch((error) => {
            console.error('Error in image processing promise:', error);
            toast({
              title: 'Error',
              description: 'Failed to process image. Please try again.',
              variant: 'error',
              duration: 5000,
            });
            return null;
          });
      } catch (error) {
        console.error('Error in crop operation:', error);
        toast({
          title: 'Error',
          description: 'Failed to process image. Please try again.',
          variant: 'error',
          duration: 5000,
        });
        return Promise.resolve(null);
      }
    }
    return Promise.resolve(null);
  }, [crop, previewWidth, originalImagePreview, isCircular, borderRadius]);

  const handleCrop = useCallback(async () => {
    const croppedImageDataUrl = await generateCroppedImage();
    if (croppedImageDataUrl) {
      onSetCropImagePreview?.(croppedImageDataUrl);
      setCroppedImageData(croppedImageDataUrl);
      onSetImageSettings?.({
        crop: crop!,
        aspect: aspect === undefined ? 'free' : aspect,
        isCircular,
        borderRadius,
      });
    }
  }, [
    onSetCropImagePreview,
    onSetImageSettings,
    crop,
    aspect,
    isCircular,
    borderRadius,
    generateCroppedImage,
  ]);

  const debouncedHandleCrop = useMemo(
    () =>
      // First debounce with 400ms, then call handleCrop after 100ms delay
      debounce(() => {
        setIsResizing(true);
        setTimeout(() => {
          handleCrop()
            .catch((err) => {
              console.error('Error in debounced crop handler:', err);
            })
            .finally(() => {
              setIsResizing(false);
            });
          // display resizing text
        }, 100);
      }, 1000),
    [handleCrop],
  );

  useEffect(() => {
    debouncedHandleCrop();
    return () => {
      debouncedHandleCrop.cancel();
    };
  }, [previewWidth, debouncedHandleCrop, crop, isCircular, borderRadius]);

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
        const newDataUrl = previewCanvasRef.current.toDataURL('image/png', 1.0);
        onSetCropImagePreview?.(newDataUrl);
      };
      img.src = croppedImageData;
    }
  }, [croppedImageData, previewWidth, onSetCropImagePreview]);

  const handleDeleteImage = useCallback(() => {
    setIsReplacing(true);

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
      if (!isResizing) {
        setIsResizing(true);
      }
      setPreviewWidth(value);
      onSetPreviewWidth?.(value);
    },
    [onSetPreviewWidth, isResizing],
  );

  const handleBorderRadiusChange = useCallback((value: number) => {
    setBorderRadius(value);
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
      setBorderRadius(imageSettings?.borderRadius || 0);
    }
  }, [
    imageSettings,
    crop?.width,
    getDefaultCropForCurrentImage,
    borderRadius,
    isCircular,
  ]);

  useEffect(() => {
    if (!previewWidth) {
      setPreviewWidth(previewWidthInit || imageWidthDefault);
    }
  }, [previewWidthInit]);

  const initCalledRef = useRef(false);

  useEffect(() => {
    if (croppedImageData && !initCalledRef.current) {
      initCalledRef.current = true;
      onInit?.();
      setInitResizing(false);
    }
  }, [croppedImageData, onInit]);

  if (isLoadingOriginalImage) {
    return (
      <div className="flex items-center justify-center w-full h-[70px]">
        <LoadingInfo text="Loading image. Please wait..." />
      </div>
    );
  }

  return (
    <>
      <div className="w-full pt-6 pb-10">
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
          <div className="space-y-4">
            {croppedImageData && (
              <div className="space-y-2">
                <>
                  <Typography
                    variant="labelBase"
                    className={`text-center ${
                      isResizing || initResizing
                        ? 'text-gray-800'
                        : 'text-transparent'
                    }`}
                  >
                    Resizing...
                  </Typography>

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
                    />
                  </div>
                </>

                {!isCircular && (
                  <div className="space-y-2">
                    <Typography variant="labelBase">
                      {`Border radius: ${borderRadius} px`}
                    </Typography>

                    <Slider
                      min={0}
                      max={MAX_IMAGE_WIDTH / 2}
                      units="px"
                      value={borderRadius}
                      onChange={handleBorderRadiusChange}
                      id="border-radius-slider"
                    />
                  </div>
                )}
              </div>
            )}

            <div className="overflow-hidden bg-black/5 max-w-[90%] mx-0 md:mx-auto">
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
                  onLoad={() => {
                    if (imgRef.current && !imageSettings?.crop?.width) {
                      const { width: imgWidth, height: imgHeight } =
                        imgRef.current.getBoundingClientRect();
                      const defaultCrop = getDefaultCrop(
                        1,
                        imgWidth,
                        imgHeight,
                      );
                      setCrop({
                        ...defaultCrop,
                        unit: '%' as const,
                      });
                    }
                  }}
                  className="max-h-[600px] w-full object-contain"
                />
              </ReactCrop>
            </div>

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

            <div>
              <div className="mt-10 flex justify-center">
                <Button variant="orange" size="md" onClick={handleDeleteImage}>
                  Change image
                </Button>
              </div>
            </div>

            <canvas ref={previewCanvasRef} className="hidden" />
          </div>
        )}
      </div>
    </>
  );
}
