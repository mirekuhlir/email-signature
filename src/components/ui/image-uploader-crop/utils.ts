import { type Crop } from "react-image-crop";

export const cropDefault: Crop = {
  unit: "%",
  width: 80,
  height: 80,
  x: 10,
  y: 10,
};

export const imageWidthDefault = 150;

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
