"use client";
import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import ReactCrop, { type Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Button } from "@/components/ui/button";
import Slider from "../slider";

const cropDefault: Crop = {
  unit: "px",
  width: 100,
  height: 100,
  x: 0,
  y: 0,
};

const imageWidthDefault = 150;

interface ImageSettings {
  crop: Crop;
  aspect?: number;
  isCircular: boolean;
}

interface ImageUploaderProps {
  onSetCropImagePreview?: (preview: string) => void;
  onSetOriginalImagePreview?: (original: string) => void;
  originalImagePreview?: string;
  onSetCropImageFile?: (file: File) => void;
  onSetOriginalImageFile?: (file: File) => void;
  imageName: string;
  imageSettings?: ImageSettings;
  onSetImageSettings?: (info: ImageSettings) => void;
  previewWidthInit?: number;
  onSetPreviewWidth?: (width: number) => void;
}

function getDefaultCrop(
  aspect: number,
  imgWidth: number,
  imgHeight: number,
): Crop {
  const maxCropWidth = imgWidth * 0.8;
  const maxCropHeight = imgHeight * 0.8;

  let cropWidth, cropHeight;
  if (maxCropWidth / aspect <= maxCropHeight) {
    cropWidth = Math.round(maxCropWidth);
    cropHeight = Math.round(maxCropWidth / aspect);
  } else {
    cropHeight = Math.round(maxCropHeight);
    cropWidth = Math.round(maxCropHeight * aspect);
  }

  return {
    unit: "px",
    width: cropWidth,
    height: cropHeight,
    x: Math.floor((imgWidth - cropWidth) / 2),
    y: Math.floor((imgHeight - cropHeight) / 2),
  };
}

export default function ImageCrop(props: ImageUploaderProps) {
  const {
    onSetCropImagePreview,
    onSetOriginalImagePreview,
    onSetOriginalImageFile,
    onSetCropImageFile,
    originalImagePreview,
    imageName,
    imageSettings,
    onSetImageSettings,
    previewWidthInit,
    onSetPreviewWidth,
  } = props;

  const [crop, setCrop] = useState<Crop | undefined>(undefined);
  // TODO - vybrat
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
        onSetOriginalImageFile?.(file);
        setCroppedImageData(null);
      }
    },
    [onSetOriginalImagePreview, onSetOriginalImageFile],
  );

  const onCropComplete = useCallback(
    (crop: Crop) => {
      if (imgRef.current && crop.width && crop.height) {
        const image = imgRef.current;
        const canvas = document.createElement("canvas");
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        const ctx = canvas.getContext("2d");

        canvas.width = crop.width;
        canvas.height = crop.height;

        if (ctx) {
          ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width,
            crop.height,
          );

          if (isCircular) {
            ctx.globalCompositeOperation = "destination-in";
            ctx.beginPath();
            ctx.arc(
              crop.width / 2,
              crop.height / 2,
              Math.min(crop.width, crop.height) / 2,
              0,
              Math.PI * 2,
            );
            ctx.fill();
          }
        }

        if (previewCanvasRef.current) {
          previewCanvasRef.current.width = crop.width;
          previewCanvasRef.current.height = crop.height;
          const previewCtx = previewCanvasRef.current.getContext("2d");
          previewCtx?.drawImage(canvas, 0, 0);
        }
      }
    },
    [isCircular],
  );

  function dataURLtoFile(dataurl: string, filename: string): File {
    const arr = dataurl.split(",");
    const mimeMatch = arr[0].match(/:(.*?);/);
    if (!mimeMatch) {
      throw new Error("Invalid dataURL");
    }
    const mime = mimeMatch[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }

  const generateCroppedImage = useCallback((): string | null => {
    if (imgRef.current && crop?.width && crop?.height) {
      const image = imgRef.current;
      const pixelRatio = window.devicePixelRatio || 1;
      const canvas = document.createElement("canvas");
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;

      canvas.width = crop.width * pixelRatio;
      canvas.height = crop.height * pixelRatio;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        ctx.drawImage(
          image,
          crop.x * scaleX,
          crop.y * scaleY,
          crop.width * scaleX,
          crop.height * scaleY,
          0,
          0,
          crop.width,
          crop.height,
        );

        if (isCircular) {
          ctx.globalCompositeOperation = "destination-in";
          ctx.beginPath();
          ctx.arc(
            crop.width / 2,
            crop.height / 2,
            Math.min(crop.width, crop.height) / 2,
            0,
            Math.PI * 2,
          );
          ctx.fill();
        }
        return canvas.toDataURL("image/png");
      }
    }
    return null;
  }, [crop, isCircular]);

  const handleCrop = useCallback(() => {
    const croppedImageDataUrl = generateCroppedImage();
    if (croppedImageDataUrl) {
      onSetCropImagePreview?.(croppedImageDataUrl);
      const croppedFile = dataURLtoFile(
        croppedImageDataUrl,
        `${imageName}.png`,
      );
      onSetCropImageFile?.(croppedFile);
      setCroppedImageData(croppedImageDataUrl);
      onSetImageSettings?.({
        crop: crop!,
        aspect,
        isCircular,
      });

      if (!previewWidth) {
        setPreviewWidth(imageWidthDefault);
      }
    }
  }, [
    generateCroppedImage,
    onSetCropImagePreview,
    onSetCropImageFile,
    onSetImageSettings,
    crop,
    aspect,
    isCircular,
    imageName,
  ]);

  useEffect(() => {
    if (
      originalImagePreview &&
      crop &&
      aspect &&
      isCircular &&
      previewWidth &&
      !croppedImageData
    ) {
      handleCrop();
    }
  }, [
    originalImagePreview,
    crop,
    aspect,
    isCircular,
    previewWidth,
    croppedImageData,
    handleCrop,
  ]);

  const handleDeleteImage = useCallback(() => {
    onSetOriginalImagePreview?.("");
    setCroppedImageData(null);
  }, [onSetOriginalImagePreview]);

  const handleAspectChange = useCallback(
    (newAspect: number, circular: boolean = false) => {
      setAspect(newAspect);
      setIsCircular(circular);
      const newCrop = getDefaultCropForCurrentImage(newAspect);
      if (newCrop) {
        setCrop(newCrop);
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
    if (imageSettings && !crop?.width) {
      setCrop(imageSettings.crop || cropDefault);
      setAspect(imageSettings.aspect || 1);
      setIsCircular(imageSettings.isCircular || false);
    }
  }, [imageSettings, crop?.width]);

  useEffect(() => {
    if (previewWidthInit && !previewWidth) {
      setPreviewWidth(previewWidthInit);
    }
  });

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
    <div className="w-full max-w-3xl mx-auto p-4 space-y-4">
      {!originalImagePreview ? (
        <div className="grid place-items-center p-4 border border-dashed border-gray-300 rounded min-h-[200px]">
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            onChange={onSelectFile}
            className="hidden"
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Select image
          </label>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="border rounded-lg overflow-hidden bg-black/5">
            <ReactCrop
              crop={crop}
              onChange={(c) => setCrop(c)}
              onComplete={onCropComplete}
              aspect={aspect}
              circularCrop={isCircular}
              className="relative [&_.ReactCrop__crop-selection]:border-2 [&_.ReactCrop__crop-selection]:border-white [&_.ReactCrop__drag-handle]:w-2.5 [&_.ReactCrop__drag-handle]:h-2.5 [&_.ReactCrop__drag-handle]:bg-white [&_.ReactCrop__drag-handle]:rounded-full [&_.ReactCrop__drag-handle]:border-2 [&_.ReactCrop__drag-handle]:border-primary [&_.ReactCrop__drag-handle]:shadow-xl [&_.ReactCrop__drag-handle]:block"
            >
              <img
                ref={imgRef}
                alt="Crop me"
                src={originalImagePreview}
                onLoad={() => {
                  if (imgRef.current && !imageSettings) {
                    const { width: imgWidth, height: imgHeight } =
                      imgRef.current.getBoundingClientRect();
                    setCrop(getDefaultCrop(1, imgWidth, imgHeight));
                  }
                }}
                className="max-h-[600px] w-full object-contain"
              />
            </ReactCrop>
          </div>

          <div className="flex items-center justify-between gap-4">
            <Button variant="outline" onClick={() => handleAspectChange(1)}>
              1:1
            </Button>
            <Button variant="outline" onClick={() => handleAspectChange(3 / 2)}>
              3:2
            </Button>
            <Button variant="outline" onClick={() => handleAspectChange(2 / 3)}>
              2:3
            </Button>
            <Button
              variant="outline"
              onClick={() => handleAspectChange(1, true)}
            >
              Circular
            </Button>
          </div>

          <div className="flex items-center justify-end gap-4">
            <Button onClick={handleCrop}>Crop</Button>
            <Button variant="red" onClick={handleDeleteImage}>
              Delete Image
            </Button>
          </div>

          <canvas ref={previewCanvasRef} className="hidden" />
          {previewWidth !== undefined && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span>Width: {previewWidth}px</span>
                <Slider
                  min={50}
                  max={200}
                  defaultValue={previewWidth}
                  onChange={handlePreviewWidthChange}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
