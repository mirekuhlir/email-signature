import { ListObjectsV2Command, S3Client } from "npm:@aws-sdk/client-s3";

export function transformUrlToKey(urlString: string): string {
  const marker = "amazonaws.com/";
  const parts = urlString.split(marker);
  return parts.length > 1 ? parts[1] : urlString;
}

/**
 * Shortens a UUID to the first 8 characters for privacy while maintaining uniqueness
 * @param uuid The full UUID string to shorten
 * @returns The first 8 characters of the UUID
 */
export function shortenUuid(uuid: string): string {
  return uuid.substring(0, 8);
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

export async function countImagesInS3(
  userId: string,
  signatureId: string,
  s3Client: S3Client,
  bucketName: string,
): Promise<number> {
  try {
    // Use only first 8 characters of userId and signatureId for privacy
    const shortUserId = shortenUuid(userId);
    const shortSignatureId = shortenUuid(signatureId);
    const prefix = `${shortUserId}/${shortSignatureId}/`;
    let imageCount = 0;
    let continuationToken: string | undefined;

    const imageExtensions = [".png", ".jpg", ".jpeg", ".gif", ".webp"];

    do {
      const command = new ListObjectsV2Command({
        Bucket: bucketName,
        Prefix: prefix,
        ContinuationToken: continuationToken,
      });

      const response = await s3Client.send(command);
      // Count only files with image extensions
      imageCount += (response.Contents || []).filter((file: { Key?: string }) =>
        imageExtensions.some((ext) =>
          file.Key?.toLowerCase().endsWith(ext)
        )
      ).length;

      continuationToken = response.NextContinuationToken;
    } while (continuationToken);

    return imageCount;
  } catch (error) {
    console.error("Error counting images in S3:", error);
    throw error;
  }
}
