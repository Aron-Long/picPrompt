import OSS from "ali-oss";

/**
 * Initialize Alibaba Cloud OSS client
 */
export function createOSSClient() {
  const region = process.env.OSS_REGION;
  const accessKeyId = process.env.OSS_ACCESS_KEY_ID;
  const accessKeySecret = process.env.OSS_ACCESS_KEY_SECRET;
  const bucket = process.env.OSS_BUCKET;

  if (!region || !accessKeyId || !accessKeySecret || !bucket) {
    throw new Error(
      "OSS configuration is missing. Please set OSS_REGION, OSS_ACCESS_KEY_ID, OSS_ACCESS_KEY_SECRET, and OSS_BUCKET in your environment variables.",
    );
  }

  return new OSS({
    region,
    accessKeyId,
    accessKeySecret,
    bucket,
  });
}

/**
 * Upload file to OSS
 * @param file - File to upload
 * @param folder - Optional folder path (e.g., "images/uploads")
 * @returns Object containing the file URL and path
 */
export async function uploadToOSS(
  file: File | Blob,
  folder: string = "images",
): Promise<{ url: string; path: string; name: string }> {
  const client = createOSSClient();

  // Generate unique filename
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 15);
  const extension = file instanceof File ? file.name.split(".").pop() : "jpg";
  const fileName = `${timestamp}-${randomStr}.${extension}`;
  const filePath = `${folder}/${fileName}`;

  // Convert File/Blob to Buffer for OSS upload
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  try {
    // Upload to OSS
    const result = await client.put(filePath, buffer, {
      headers: {
        "Content-Type": file.type || "image/jpeg",
      },
    });

    return {
      url: result.url,
      path: filePath,
      name: fileName,
    };
  } catch (error) {
    console.error("Error uploading to OSS:", error);
    throw new Error(
      `Failed to upload file to OSS: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

/**
 * Delete file from OSS
 * @param filePath - Path of the file to delete
 */
export async function deleteFromOSS(filePath: string): Promise<void> {
  const client = createOSSClient();

  try {
    await client.delete(filePath);
  } catch (error) {
    console.error("Error deleting from OSS:", error);
    throw new Error(
      `Failed to delete file from OSS: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

/**
 * Generate signed URL for private access
 * @param filePath - Path of the file
 * @param expiresInSeconds - URL expiration time in seconds (default: 1 hour)
 */
export async function getSignedUrl(
  filePath: string,
  expiresInSeconds: number = 3600,
): Promise<string> {
  const client = createOSSClient();

  try {
    const url = client.signatureUrl(filePath, {
      expires: expiresInSeconds,
    });
    return url;
  } catch (error) {
    console.error("Error generating signed URL:", error);
    throw new Error(
      `Failed to generate signed URL: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}
