import { API_URL, ApiError } from "@/lib/api";
import { clearToken, getToken } from "@/lib/auth";
import {
  ASSET_MAX_BYTES,
  ASSET_UPLOAD_TIMEOUT_MS,
  uploadErrorMessage,
  type WebsiteAsset,
} from "./asset-library-logic";

export const ASSETS_KEY = "/couple/api/website/assets";
export const PROFILE_KEY = "/couple/api/profile";

/** Reads an image's pixel size in the browser; null when it cannot be decoded (the server then decides). */
export function readImageSize(file: File): Promise<{ width: number; height: number } | null> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
      URL.revokeObjectURL(url);
    };
    img.onerror = () => {
      resolve(null);
      URL.revokeObjectURL(url);
    };
    img.src = url;
  });
}

export const UPLOAD_CANCELLED = -1;

/**
 * Uploads one file as multipart/form-data. Uses XHR (fetch cannot report upload
 * progress); the browser sets the multipart Content-Type and boundary itself.
 * Aborting `signal` rejects with ApiError status UPLOAD_CANCELLED.
 */
export function uploadAsset(
  file: File,
  onProgress: (percent: number) => void,
  signal: AbortSignal,
  timeoutMs = ASSET_UPLOAD_TIMEOUT_MS,
): Promise<WebsiteAsset> {
  return new Promise((resolve, reject) => {
    if (signal.aborted) return reject(new ApiError("Cancelled", UPLOAD_CANCELLED));
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${API_URL}${ASSETS_KEY}`);
    xhr.timeout = timeoutMs;
    const token = getToken();
    if (token) xhr.setRequestHeader("Authorization", `Bearer ${token}`);
    const onAbort = () => xhr.abort();
    signal.addEventListener("abort", onAbort, { once: true });
    const done = () => signal.removeEventListener("abort", onAbort);

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onabort = () => {
      done();
      reject(new ApiError("Cancelled", UPLOAD_CANCELLED));
    };
    xhr.ontimeout = () => {
      done();
      reject(new ApiError("The upload took too long and was stopped. Check your connection and try again.", 0));
    };
    xhr.onerror = () => {
      done();
      // A connection reset right after sending a very large body is usually the server refusing it.
      const msg = file.size > ASSET_MAX_BYTES ? uploadErrorMessage(413) : uploadErrorMessage(0);
      reject(new ApiError(msg, 0));
    };
    xhr.onload = () => {
      done();
      let body: { asset?: WebsiteAsset; error?: string } = {};
      try {
        body = JSON.parse(xhr.responseText);
      } catch {
        /* non-JSON body */
      }
      if (xhr.status >= 200 && xhr.status < 300 && body.asset) return resolve(body.asset);
      if (xhr.status === 401 && token) {
        clearToken();
        if (window.location.pathname !== "/") window.location.assign("/");
      }
      reject(new ApiError(uploadErrorMessage(xhr.status, body.error), xhr.status));
    };
    const form = new FormData();
    form.append("file", file);
    xhr.send(form);
  });
}
