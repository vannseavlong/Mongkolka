import fs from "node:fs/promises";
import path from "node:path";
import type { PhotoStorage } from "./storage.types.js";

export function createLocalStorage(rootDir: string, publicBaseUrl: string): PhotoStorage {
  const root = path.resolve(process.cwd(), rootDir);

  // Keys are generated server-side, but resolve + prefix-check anyway so a bad key
  // can never escape the upload directory.
  function resolveKey(key: string) {
    const full = path.resolve(root, key);
    if (!full.startsWith(root + path.sep)) throw new Error("Invalid storage key");
    return full;
  }

  return {
    async put(key, body) {
      const full = resolveKey(key);
      await fs.mkdir(path.dirname(full), { recursive: true });
      await fs.writeFile(full, body);
      return `${publicBaseUrl.replace(/\/$/, "")}/uploads/${key}`;
    },
    async delete(key) {
      await fs.rm(resolveKey(key), { force: true });
    },
  };
}

export function localUploadsRoot(rootDir: string) {
  return path.resolve(process.cwd(), rootDir);
}
