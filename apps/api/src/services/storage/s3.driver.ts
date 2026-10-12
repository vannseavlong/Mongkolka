import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import type { PhotoStorage } from "./storage.types.js";

export interface S3StorageConfig {
  endpoint: string;
  region: string;
  bucket: string;
  accessKeyId: string;
  secretAccessKey: string;
  publicBaseUrl: string;
}

/** Works with Cloudflare R2 and any S3-compatible store (set `endpoint`). */
export function createS3Storage(config: S3StorageConfig): PhotoStorage {
  const client = new S3Client({
    region: config.region,
    endpoint: config.endpoint || undefined,
    credentials: { accessKeyId: config.accessKeyId, secretAccessKey: config.secretAccessKey },
  });

  return {
    async put(key, body, mimeType) {
      await client.send(
        new PutObjectCommand({
          Bucket: config.bucket,
          Key: key,
          Body: body,
          ContentType: mimeType,
          // Keys are unique per upload, so the object never changes — cache it hard.
          CacheControl: "public, max-age=31536000, immutable",
        }),
      );
      return `${config.publicBaseUrl.replace(/\/$/, "")}/${key}`;
    },
    async delete(key) {
      await client.send(new DeleteObjectCommand({ Bucket: config.bucket, Key: key }));
    },
  };
}
