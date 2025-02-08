"use client";

import { useState, useRef } from "react";
import ReactCrop, { type Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Button } from "@/components/ui/button";

interface ImageUploaderProps {
  onSetImagePreview?: (preview: string) => void;
  previewImage?: string;
}

function getDefaultCrop(
  aspect: number,
  imgWidth: number,
  imgHeight: number,
): Crop {
  const cropHeight = Math.floor(imgHeight * 0.8);
  const cropWidth = Math.round(cropHeight * aspect);
  return {
    unit: "px",
    width: cropWidth,
    height: cropHeight,
    x: Math.floor((imgWidth - cropWidth) / 2),
    y: Math.floor((imgHeight - cropHeight) / 2),
  };
}

export default function ImageCrop(props: ImageUploaderProps) {
  const { onSetImagePreview, previewImage } = props;

  const [previewImageSrc, setPreviewImageSrc] = useState(previewImage);

  const [crop, setCrop] = useState<Crop>({
    unit: "px",
    width: 100,
    height: 100,
    x: 0,
    y: 0,
  });

  const [aspect, setAspect] = useState<number | undefined>(undefined);
  const [isCircular, setIsCircular] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  function onSelectFile(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];

      setPreviewImageSrc(URL.createObjectURL(file));
    }
  }

  function onCropComplete(crop: Crop) {
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
        if (previewCtx) {
          previewCtx.drawImage(canvas, 0, 0);
        }
      }
    }
  }

  function generateCroppedImage(): string | null {
    if (imgRef.current && crop.width && crop.height) {
      const image = imgRef.current;
      const canvas = document.createElement("canvas");
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;
      canvas.width = crop.width;
      canvas.height = crop.height;
      const ctx = canvas.getContext("2d");

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
        return canvas.toDataURL("image/png");
      }
    }
    return null;
  }

  function handleApply() {
    const croppedImageData = generateCroppedImage();
    if (croppedImageData) {
      onSetImagePreview?.(croppedImageData);
    }
  }

  return (
    <div className="w-full max-w-3xl mx-auto p-4 space-y-4">
      {!previewImageSrc ? (
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
                src={previewImageSrc}
                onLoad={() => {
                  if (imgRef.current) {
                    const { width: imgWidth, height: imgHeight } =
                      imgRef.current.getBoundingClientRect();
                    setCrop(getDefaultCrop(1, imgWidth, imgHeight));
                  }
                }}
                // TODO ?
                className="max-h-[600px] w-full object-contain"
              />
            </ReactCrop>
          </div>

          <div className="flex items-center justify-between gap-4">
            <Button
              variant="outline"
              onClick={() => {
                setAspect(1);
                setIsCircular(false);
                if (imgRef.current) {
                  const { width: imgWidth, height: imgHeight } =
                    imgRef.current.getBoundingClientRect();
                  setCrop(getDefaultCrop(1, imgWidth, imgHeight));
                }
              }}
            >
              1:1
            </Button>

            <Button
              variant="outline"
              onClick={() => {
                setAspect(3 / 2);
                setIsCircular(false);
                if (imgRef.current) {
                  const { width: imgWidth, height: imgHeight } =
                    imgRef.current.getBoundingClientRect();
                  setCrop(getDefaultCrop(3 / 2, imgWidth, imgHeight));
                }
              }}
            >
              3:2
            </Button>

            <Button
              variant="outline"
              onClick={() => {
                setAspect(2 / 3);
                setIsCircular(false);
                if (imgRef.current) {
                  const { width: imgWidth, height: imgHeight } =
                    imgRef.current.getBoundingClientRect();
                  setCrop(getDefaultCrop(2 / 3, imgWidth, imgHeight));
                }
              }}
            >
              2:3
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setAspect(1);
                setIsCircular(true);
                if (imgRef.current) {
                  const { width: imgWidth, height: imgHeight } =
                    imgRef.current.getBoundingClientRect();
                  setCrop(getDefaultCrop(1, imgWidth, imgHeight));
                }
              }}
            >
              Circular
            </Button>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleApply}>Apply</Button>
          </div>

          <canvas ref={previewCanvasRef} className="hidden" />
        </div>
      )}
    </div>
  );
}
