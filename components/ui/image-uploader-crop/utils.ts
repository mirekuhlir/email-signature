import { type Crop } from "react-image-crop";

export const cropDefault: Crop = {
  unit: "px",
  width: 100,
  height: 100,
  x: 0,
  y: 0,
};

export const imageWidthDefault = 150;

export function getDefaultCrop(
  aspect: number,
  imgWidth: number,
  imgHeight: number,
): Crop {
  const maxCropWidth = imgWidth * 0.8;
  const maxCropHeight = imgHeight * 0.8;

  let cropWidth: number, cropHeight: number;
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
