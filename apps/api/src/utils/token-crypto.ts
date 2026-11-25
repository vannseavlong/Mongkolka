import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";

const VERSION = "v1";

/** AES-256-GCM box for secrets at rest. keys[0] encrypts; every key is tried on decrypt (rotation). */
export interface TokenBox {
  encrypt(plain: string): string;
  decrypt(boxed: string): string;
}

function toKey(raw: string): Buffer {
  const key = Buffer.from(raw, "base64");
  if (key.length !== 32) throw new Error("Token key must be 32 bytes, base64 encoded");
  return key;
}

export function createTokenBox(rawKeys: string[]): TokenBox {
  const keys = rawKeys.filter(Boolean).map(toKey);
  if (keys.length === 0) throw new Error("DRIVE_TOKEN_KEY is not set");

  return {
    encrypt(plain) {
      const iv = randomBytes(12);
      const cipher = createCipheriv("aes-256-gcm", keys[0] as Buffer, iv);
      const body = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
      return [VERSION, iv.toString("base64"), cipher.getAuthTag().toString("base64"), body.toString("base64")].join(".");
    },
    decrypt(boxed) {
      const [version, iv, tag, body] = boxed.split(".");
      if (version !== VERSION || !iv || !tag || !body) throw new Error("Unrecognised token format");
      for (const key of keys) {
        try {
          const decipher = createDecipheriv("aes-256-gcm", key, Buffer.from(iv, "base64"));
          decipher.setAuthTag(Buffer.from(tag, "base64"));
          return Buffer.concat([decipher.update(Buffer.from(body, "base64")), decipher.final()]).toString("utf8");
        } catch {
          // wrong key or tampered data; try the next key
        }
      }
      throw new Error("Token could not be decrypted");
    },
  };
}
