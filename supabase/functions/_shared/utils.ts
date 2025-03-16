export function transformUrlToKey(urlString: string): string {
  const marker = "amazonaws.com/";
  const parts = urlString.split(marker);
  return parts.length > 1 ? parts[1] : urlString;
}

export function extractImageSrc(data: unknown): string[] {
  const srcArr: string[] = [];

  if (Array.isArray(data)) {
    data.forEach((item) => {
      srcArr.push(...extractImageSrc(item));
    });
  } else if (data && typeof data === "object") {
    const obj = data as Record<string, unknown>;

    if (typeof obj.src === "string") {
      srcArr.push(transformUrlToKey(obj.src));
    }

    if (typeof obj.originalSrc === "string") {
      srcArr.push(transformUrlToKey(obj.originalSrc));
    }

    Object.values(obj).forEach((value) => {
      srcArr.push(...extractImageSrc(value));
    });
  }

  return srcArr;
}

export const generateRandomId = (length: number = 7): string => {
  let result = "";
  const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(
      Math.floor(Math.random() * charactersLength),
    );
  }
  return result;
};
