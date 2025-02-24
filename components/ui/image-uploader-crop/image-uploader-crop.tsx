"use client";
import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import ReactCrop, { type Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { baseStyles, Button, sizes, variants } from "@/components/ui/button";
import Slider from "../slider";
import { debounce } from "lodash";
import {
  getDefaultCrop,
  dataURLToFile,
  cropDefault,
  imageWidthDefault,
} from "./utils";
import { Typography } from "../typography";

interface ImageSettings {
  crop: Crop;
  aspect?: number;
  isCircular: boolean;
}

interface ImageUploaderProps {
  onSetCropImagePreview?: (preview: string) => void;
  onSetOriginalImagePreview?: (original: string) => void;
  originalImagePreview?: string;
  imageName: string;
  imageSettings?: ImageSettings;
  onSetImageSettings?: (info: ImageSettings) => void;
  previewWidthInit?: number;
  onSetPreviewWidth?: (width: number) => void;
  onInit?: () => void;
}

export default function ImageUploadCrop(props: ImageUploaderProps) {
  const {
    onSetCropImagePreview,
    onSetOriginalImagePreview,
    originalImagePreview,
    imageName,
    imageSettings,
    onSetImageSettings,
    previewWidthInit,
    onSetPreviewWidth,
    onInit,
  } = props;

  const [crop, setCrop] = useState<Crop | undefined>(undefined);
  const [aspect, setAspect] = useState<number | undefined>(undefined);
  const [isCircular, setIsCircular] = useState(false);
  const [croppedImageData, setCroppedImageData] = useState<string | null>(null);
  const [previewWidth, setPreviewWidth] = useState<number | undefined>(
    undefined,
  );

  const imgRef = useRef<HTMLImageElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  const getDefaultCropForCurrentImage = useCallback((aspectRatio: number) => {
    if (!imgRef.current) return null;
    const { width: imgWidth, height: imgHeight } =
      imgRef.current.getBoundingClientRect();
    return getDefaultCrop(aspectRatio, imgWidth, imgHeight);
  }, []);

  const onSelectFile = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        const file = files[0];
        const fileUrl = URL.createObjectURL(file);
        onSetOriginalImagePreview?.(fileUrl);
        setCroppedImageData(null);
      }
    },
    [onSetOriginalImagePreview],
  );

  const generateCroppedImage = useCallback((): string | null => {
    if (imgRef.current && crop?.width && crop?.height && previewWidth) {
      const image = imgRef.current;
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;

      const cropWidthOrig = crop.width * scaleX;
      const cropHeightOrig = crop.height * scaleY;
      const xOrig = crop.x * scaleX;
      const yOrig = crop.y * scaleY;

      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = cropWidthOrig;
      tempCanvas.height = cropHeightOrig;
      const tempCtx = tempCanvas.getContext("2d");
      if (!tempCtx) return null;

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

      const finalCanvas = document.createElement("canvas");
      finalCanvas.width = previewWidth;
      finalCanvas.height = Math.round(
        previewWidth * (cropHeightOrig / cropWidthOrig),
      );
      const ctx = finalCanvas.getContext("2d");
      if (!ctx) return null;

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

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

      if (isCircular) {
        ctx.globalCompositeOperation = "destination-in";
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

      return finalCanvas.toDataURL("image/png", 1.0);
    }
    return null;
  }, [crop, isCircular, previewWidth]);

  const handleCrop = useCallback(() => {
    const croppedImageDataUrl = generateCroppedImage();
    if (croppedImageDataUrl) {
      onSetCropImagePreview?.(croppedImageDataUrl);
      const croppedFile = dataURLToFile(
        croppedImageDataUrl,
        `${imageName}.png`,
      );
      setCroppedImageData(croppedImageDataUrl);
      onSetImageSettings?.({
        crop: crop!,
        aspect,
        isCircular,
      });
    }
  }, [
    onSetCropImagePreview,
    onSetImageSettings,
    crop,
    aspect,
    isCircular,
    imageName,
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
    onSetOriginalImagePreview?.("");
    setCroppedImageData(null);
  }, [onSetOriginalImagePreview]);

  const handleAspectChange = useCallback(
    (newAspect: number, circular: boolean = false) => {
      if (circular) {
        setIsCircular(true);
        setAspect(1);
        const newCrop = getDefaultCropForCurrentImage(1);
        if (newCrop) {
          setCrop(newCrop);
        }
      } else {
        setIsCircular(false);
        setAspect(newAspect);
        const newCrop = getDefaultCropForCurrentImage(newAspect);
        if (newCrop) {
          setCrop(newCrop);
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
      setCrop(imageSettings?.crop || cropDefault);
      setAspect(imageSettings?.aspect || 1);
      setIsCircular(imageSettings?.isCircular || false);
    }
  }, [imageSettings, crop?.width]);

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
    return () => {};
  }, [croppedImageData]);

  useEffect(() => {
    if (croppedImageData) {
      const img = new Image();
      img.onload = () => {
        if (!previewCanvasRef.current || !previewWidth) return;
        const scale = previewWidth / img.width;
        previewCanvasRef.current.width = previewWidth;
        previewCanvasRef.current.height = img.height * scale;
        const ctx = previewCanvasRef.current.getContext("2d");
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
        const newDataUrl = previewCanvasRef.current.toDataURL("image/png");
        onSetCropImagePreview?.(newDataUrl);
      };
      img.src = croppedImageData;
    }
  }, [croppedImageData, previewWidth, onSetCropImagePreview]);

  return (
    <div className="w-full pt-8">
      {!originalImagePreview ? (
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
            className={`${baseStyles} ${variants.outline} ${sizes.md}`}
          >
            Select image
          </label>
        </div>
      ) : (
        <div className="space-y-4">
          {croppedImageData && (
            <div className="space-y-2">
              <Typography variant="labelBase">
                Set the width of the cropped image
              </Typography>
              <Slider
                min={50}
                max={200}
                defaultValue={previewWidth}
                onChange={handlePreviewWidthChange}
                id="slider"
              />
              <label
                htmlFor="slider"
                className="block pb-5 text-center text-sm font-medium text-gray-700"
              >
                Width: {previewWidth}px
              </label>
            </div>
          )}

          <div className="overflow-hidden bg-black/5 max-w-[90%] mx-0 md:mx-auto">
            <ReactCrop
              crop={crop}
              onChange={(c) => setCrop(c)}
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
                    setCrop(defaultCrop);
                  }
                }}
                className="max-h-[600px] w-full object-contain"
              />
            </ReactCrop>
          </div>

          <Typography variant="labelBase">Choose the aspect ratio</Typography>
          <div className="flex items-center justify-between gap-4">
            <Button
              variant="outline"
              onClick={() => {
                handleAspectChange(1, false);
              }}
              selected={!isCircular && aspect === 1}
            >
              1:1
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                handleAspectChange(3 / 2, false);
              }}
              selected={!isCircular && aspect === 3 / 2}
            >
              3:2
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                handleAspectChange(2 / 3, false);
              }}
              selected={!isCircular && aspect === 2 / 3}
            >
              2:3
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                handleAspectChange(1, true);
              }}
              selected={isCircular}
            >
              Circular
            </Button>
          </div>
          <div className="flex items-center justify-end gap-4">
            {/*   TODO */}
            {/*   <Button variant="red" onClick={handleDeleteImage}>
              Delete Image
            </Button> */}
          </div>

          <canvas ref={previewCanvasRef} className="hidden" />
        </div>
      )}
    </div>
  );
}
