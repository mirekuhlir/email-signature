import { type Crop } from "react-image-crop";
import pica from "pica";

export const cropDefault: Crop = {
  unit: "%",
  width: 80,
  height: 80,
  x: 10,
  y: 10,
};

export const imageWidthDefault = 120;

export function getDefaultCrop(
  aspect: number,
  imgWidth: number,
  imgHeight: number,
): Crop {
  // Calculate relative dimensions based on the aspect ratio
  // but using percentages instead of pixels
  let cropWidthPercent: number, cropHeightPercent: number;

  if (imgWidth / aspect <= imgHeight) {
    // Width constrained
    cropWidthPercent = 80; // Use 80% of the width
    cropHeightPercent = (cropWidthPercent / aspect) * (imgWidth / imgHeight);
  } else {
    // Height constrained
    cropHeightPercent = 80; // Use 80% of the height
    cropWidthPercent = (cropHeightPercent * aspect) * (imgHeight / imgWidth);
  }

  // Ensure the crop stays within bounds (0-100%)
  cropWidthPercent = Math.min(cropWidthPercent, 100);
  cropHeightPercent = Math.min(cropHeightPercent, 100);

  // Center the crop
  const xPercent = (100 - cropWidthPercent) / 2;
  const yPercent = (100 - cropHeightPercent) / 2;

  return {
    unit: "%",
    width: cropWidthPercent,
    height: cropHeightPercent,
    x: xPercent,
    y: yPercent,
  };
}

export function dataURLToFile(dataUrl: string, filename: string): File {
  const arr = dataUrl.split(",");
  const mimeMatch = arr[0].match(/:(.*?);/);
  if (!mimeMatch) {
    throw new Error("Invalid dataURL");
  }
  const mime = mimeMatch[1];
  const bstr = atob(arr[1]);
  const n = bstr.length;
  const u8arr = new Uint8Array(n);
  for (let i = 0; i < n; i++) {
    u8arr[i] = bstr.charCodeAt(i);
  }
  return new File([u8arr], filename, { type: mime });
}

// Shared types
export interface BorderRadii {
  topLeft: number;
  topRight: number;
  bottomRight: number;
  bottomLeft: number;
}

// A single pica instance reused for all resizes in this module
const sharedPicaInstance = pica();

export async function convertFileToJpeg(file: File): Promise<File> {
  const objectUrl = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error("Failed to load image"));
      image.src = objectUrl;
    });

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas 2D context not available");

    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);

    const blob = await sharedPicaInstance.toBlob(canvas, "image/jpeg", 0.9);
    const jpegFile = new File(
      [blob],
      file.name.replace(/\.[^/.]+$/, "") + ".jpg",
      { type: "image/jpg" },
    );
    return jpegFile;
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

interface GenerateParams {
  crop: Crop | undefined;
  previewWidth: number | undefined;
  originalImagePreview: string | undefined;
  naturalWidth: number | null;
  naturalHeight: number | null;
  displayWidth: number | null;
  displayHeight: number | null;
  isCircular: boolean;
  borderRadii: BorderRadii;
  resolutionMultiplier?: number; // default 1
}

export async function generateCroppedImageFromParams(
  params: GenerateParams,
): Promise<string | null> {
  const {
    crop,
    previewWidth,
    originalImagePreview,
    naturalWidth,
    naturalHeight,
    displayWidth,
    displayHeight,
    isCircular,
    borderRadii,
    resolutionMultiplier = 1,
  } = params;

  if (
    !(crop?.width && crop?.height && previewWidth && originalImagePreview) ||
    naturalWidth === null ||
    naturalHeight === null ||
    displayWidth === null ||
    displayHeight === null ||
    naturalWidth === 0 ||
    naturalHeight === 0 ||
    displayWidth === 0 ||
    displayHeight === 0
  ) {
    return null;
  }

  let cropXPercent: number;
  let cropYPercent: number;
  let cropWidthPercent: number;
  let cropHeightPercent: number;

  if (crop.unit === "%") {
    cropWidthPercent = crop.width;
    cropHeightPercent = crop.height;
    cropXPercent = crop.x;
    cropYPercent = crop.y;
  } else {
    cropWidthPercent = (crop.width / displayWidth) * 100;
    cropHeightPercent = (crop.height / displayHeight) * 100;
    cropXPercent = (crop.x / displayWidth) * 100;
    cropYPercent = (crop.y / displayHeight) * 100;
  }

  const cropDisplayX = (cropXPercent / 100) * displayWidth;
  const cropDisplayY = (cropYPercent / 100) * displayHeight;
  const cropDisplayWidth = (cropWidthPercent / 100) * displayWidth;
  const cropDisplayHeight = (cropHeightPercent / 100) * displayHeight;

  const ratioX = naturalWidth / displayWidth;
  const ratioY = naturalHeight / displayHeight;

  const cropNaturalX = cropDisplayX * ratioX;
  const cropNaturalY = cropDisplayY * ratioY;
  const cropNaturalWidth = cropDisplayWidth * ratioX;
  const cropNaturalHeight = cropDisplayHeight * ratioY;

  const originalImg = new Image();
  originalImg.crossOrigin = "anonymous";

  return await new Promise<string | null>((resolve, reject) => {
    originalImg.onload = async () => {
      try {
        const displayOutWidth = previewWidth;
        const displayOutHeight = Math.round(
          (cropNaturalHeight / cropNaturalWidth) * displayOutWidth,
        );
        const outputWidth = displayOutWidth * resolutionMultiplier;
        const outputHeight = displayOutHeight * resolutionMultiplier;

        const sourceCanvas = document.createElement("canvas");
        sourceCanvas.width = cropNaturalWidth;
        sourceCanvas.height = cropNaturalHeight;
        const sourceCtx = sourceCanvas.getContext("2d");
        if (!sourceCtx) return reject("No source 2D context");
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

        const targetCanvas = document.createElement("canvas");
        targetCanvas.width = outputWidth;
        targetCanvas.height = outputHeight;

        await sharedPicaInstance.resize(sourceCanvas, targetCanvas, {});

        const targetCtx = targetCanvas.getContext("2d", { alpha: true });
        if (!targetCtx) return reject("No target 2D context");

        if (isCircular) {
          targetCtx.globalCompositeOperation = "destination-in";
          targetCtx.beginPath();
          targetCtx.arc(
            outputWidth / 2,
            outputHeight / 2,
            Math.min(outputWidth, outputHeight) / 2,
            0,
            Math.PI * 2,
          );
          targetCtx.fill();
          targetCtx.globalCompositeOperation = "source-over";
        } else if (
          borderRadii.topLeft > 0 ||
          borderRadii.topRight > 0 ||
          borderRadii.bottomRight > 0 ||
          borderRadii.bottomLeft > 0
        ) {
          targetCtx.globalCompositeOperation = "destination-in";
          targetCtx.beginPath();

          const rTL = Math.min(
            borderRadii.topLeft * resolutionMultiplier,
            outputWidth / 2,
            outputHeight / 2,
          );
          const rTR = Math.min(
            borderRadii.topRight * resolutionMultiplier,
            outputWidth / 2,
            outputHeight / 2,
          );
          const rBR = Math.min(
            borderRadii.bottomRight * resolutionMultiplier,
            outputWidth / 2,
            outputHeight / 2,
          );
          const rBL = Math.min(
            borderRadii.bottomLeft * resolutionMultiplier,
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
          targetCtx.globalCompositeOperation = "source-over";
        }

        const imageDataUrl = targetCanvas.toDataURL("image/png", 0.9);
        resolve(imageDataUrl);
      } catch (e) {
        reject(e);
      }
    };

    originalImg.onerror = () => reject("Failed to load original image");
    originalImg.src = originalImagePreview;
  }).catch((err) => {
    console.error("Error in generateCroppedImageFromParams:", err);
    return null;
  });
}
