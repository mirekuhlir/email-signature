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
interface ImageSettings {
  crop: Crop;
  aspect?: number | string;
  isCircular: boolean;
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

  const [crop, setCrop] = useState<Crop | undefined>(undefined);
  const [aspect, setAspect] = useState<number | undefined>(undefined);
  const [isCircular, setIsCircular] = useState(false);
  const [croppedImageData, setCroppedImageData] = useState<string | null>(null);
  const [previewWidth, setPreviewWidth] = useState<number | undefined>(
    undefined,
  );

  const [originalImagePreview, setOriginalImagePreview] = useState<
    string | undefined
  >(undefined);
  const [isLoadingOriginalImage, setIsLoadingOriginalImage] = useState(false);
  const [isReplacing, setIsReplacing] = useState(false);

  const imgRef = useRef<HTMLImageElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

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

  const loadOriginalImage = useCallback(
    async (url: string) => {
      try {
        setIsLoadingOriginalImage(true);
        onLoadingChange?.(true);
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
      } finally {
        setIsLoadingOriginalImage(false);
        onLoadingChange?.(false);
      }
    },
    [onLoadingChange],
  );

  useEffect(() => {
    if (originalSrc) {
      loadOriginalImage(originalSrc);
    } else if (originalImageFile?.name) {
      loadOriginalImage(URL.createObjectURL(originalImageFile));
    }
  }, [originalSrc, originalImageFile]);

  const generateCroppedImage = useCallback((): string | null => {
    if (
      imgRef.current &&
      crop?.width &&
      crop?.height &&
      previewWidth &&
      originalImagePreview
    ) {
      const image = imgRef.current;
      const imageWidth = image.width;
      const imageHeight = image.height;
      const scaleX = image.naturalWidth / imageWidth;
      const scaleY = image.naturalHeight / imageHeight;

      // Ensure we have valid dimensions
      if (
        image.naturalWidth === 0 ||
        image.naturalHeight === 0 ||
        imageWidth === 0 ||
        imageHeight === 0
      ) {
        console.error('Image dimensions are invalid');
        return null;
      }

      // Convert percentage to pixels
      let cropX, cropY, cropWidth, cropHeight;

      if (crop.unit === '%') {
        // Convert percentages to actual pixels
        cropWidth = (crop.width / 100) * imageWidth;
        cropHeight = (crop.height / 100) * imageHeight;
        cropX = (crop.x / 100) * imageWidth;
        cropY = (crop.y / 100) * imageHeight;
      } else {
        // Already in pixels
        cropWidth = crop.width;
        cropHeight = crop.height;
        cropX = crop.x;
        cropY = crop.y;
      }

      // Scale to the actual image dimensions
      const cropWidthOrig = Math.max(1, cropWidth * scaleX);
      const cropHeightOrig = Math.max(1, cropHeight * scaleY);
      const xOrig = cropX * scaleX;
      const yOrig = cropY * scaleY;

      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = Math.max(1, cropWidthOrig);
      tempCanvas.height = Math.max(1, cropHeightOrig);
      const tempCtx = tempCanvas.getContext('2d');
      if (!tempCtx) return null;

      try {
        tempCtx.drawImage(
          image,
          xOrig,
          yOrig,
          cropWidthOrig,
          cropHeightOrig,
          0,
          0,
          cropWidthOrig,
          cropHeightOrig,
        );
      } catch (error) {
        console.error('Error drawing on temp canvas:', error);
        return null;
      }

      const finalCanvas = document.createElement('canvas');
      finalCanvas.width = Math.max(1, previewWidth);
      finalCanvas.height = Math.max(
        1,
        Math.round(previewWidth * (cropHeightOrig / cropWidthOrig)),
      );
      const ctx = finalCanvas.getContext('2d');
      if (!ctx) return null;

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      try {
        ctx.drawImage(
          tempCanvas,
          0,
          0,
          cropWidthOrig,
          cropHeightOrig,
          0,
          0,
          finalCanvas.width,
          finalCanvas.height,
        );
      } catch (error) {
        console.error('Error drawing on final canvas:', error);
        return null;
      }

      if (isCircular) {
        ctx.globalCompositeOperation = 'destination-in';
        ctx.beginPath();
        ctx.arc(
          finalCanvas.width / 2,
          finalCanvas.height / 2,
          Math.min(finalCanvas.width, finalCanvas.height) / 2,
          0,
          Math.PI * 2,
        );
        ctx.fill();
      }

      return finalCanvas.toDataURL('image/png', 1.0);
    }
    return null;
  }, [crop, previewWidth, originalImagePreview, isCircular]);

  const handleCrop = useCallback(() => {
    const croppedImageDataUrl = generateCroppedImage();
    if (croppedImageDataUrl) {
      onSetCropImagePreview?.(croppedImageDataUrl);
      setCroppedImageData(croppedImageDataUrl);
      onSetImageSettings?.({
        crop: crop!,
        aspect: aspect === undefined ? 'free' : aspect,
        isCircular,
      });
    }
  }, [
    onSetCropImagePreview,
    onSetImageSettings,
    crop,
    aspect,
    isCircular,
    generateCroppedImage,
  ]);

  const debouncedHandleCrop = useMemo(
    () => debounce(handleCrop, 200),
    [handleCrop],
  );

  useEffect(() => {
    debouncedHandleCrop();
    return () => {
      debouncedHandleCrop.cancel();
    };
  }, [previewWidth, debouncedHandleCrop, croppedImageData]);

  const handleDeleteImage = useCallback(() => {
    setIsReplacing(true);

    // TODO - sjednotit - null undefined prázdný string
    onSetCropImagePreview?.('');
    setCroppedImageData?.(null);
    onSetOriginalImage?.(null);
    onSetImageSettings?.('');
    setCrop(undefined);
    setIsCircular(false);
    setOriginalImagePreview(undefined);
  }, [onSetCropImagePreview, onSetImageSettings, onSetOriginalImage]);

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
    }
  }, [imageSettings, crop?.width, getDefaultCropForCurrentImage]);

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
    }
  }, [croppedImageData]);

  useEffect(() => {
    if (croppedImageData) {
      const img = new Image();
      img.onload = () => {
        if (!previewCanvasRef.current || !previewWidth) return;
        const scale = previewWidth / img.width;
        previewCanvasRef.current.width = previewWidth;
        previewCanvasRef.current.height = img.height * scale;
        const ctx = previewCanvasRef.current.getContext('2d');
        ctx?.clearRect(
          0,
          0,
          previewCanvasRef.current.width,
          previewCanvasRef.current.height,
        );
        ctx?.drawImage(
          img,
          0,
          0,
          previewCanvasRef.current.width,
          previewCanvasRef.current.height,
        );
        const newDataUrl = previewCanvasRef.current.toDataURL('image/png');
        onSetCropImagePreview?.(newDataUrl);
      };
      img.src = croppedImageData;
    }
  }, [croppedImageData, previewWidth, onSetCropImagePreview]);

  if (isLoadingOriginalImage) {
    return (
      <div className="flex items-center justify-center w-full h-[70px]">
        <Typography variant="large">Loading image...</Typography>
      </div>
    );
  }

  return (
    <div className="w-full pt-8">
      {!originalImagePreview && !originalSrc ? (
        <div className="grid place-items-center p-4 border border-dashed border-gray-300 rounded min-h-[200px] w-[80%] md:w-[400px] mx-auto">
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
      ) : (
        <div className="space-y-4">
          {croppedImageData && (
            <div className="space-y-2">
              <Typography variant="labelBase">
                {`Width of image: ${
                  croppedImageData ? `${previewWidth}px` : ''
                }`}
              </Typography>
              <div className="pb-3">
                <Slider
                  min={50}
                  max={200}
                  units="pixels"
                  defaultValue={previewWidth}
                  onChange={handlePreviewWidthChange}
                  id="slider"
                />
              </div>
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
            >
              <img
                ref={imgRef}
                alt="Crop me"
                src={originalImagePreview}
                onLoad={() => {
                  if (imgRef.current && !imageSettings?.crop?.width) {
                    const { width: imgWidth, height: imgHeight } =
                      imgRef.current.getBoundingClientRect();
                    const defaultCrop = getDefaultCrop(1, imgWidth, imgHeight);
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

          <Typography variant="labelBase">Choose the aspect ratio</Typography>
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
  );
}
