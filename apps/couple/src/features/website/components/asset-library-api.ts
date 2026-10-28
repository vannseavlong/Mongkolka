import { ApiError } from "@/lib/api";
import { clearToken, getToken } from "@/lib/auth";
import { uploadErrorMessage, type WebsiteAsset } from "./asset-library-logic";

export const ASSETS_KEY = "/couple/api/website/assets";
export const PROFILE_KEY = "/couple/api/profile";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

/**
 * Uploads one file as multipart/form-data. Uses XHR (fetch cannot report upload
 * progress); the browser sets the multipart Content-Type and boundary itself.
 */
export function uploadAsset(file: File, onProgress: (percent: number) => void): Promise<WebsiteAsset> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${API_URL}${ASSETS_KEY}`);
    const token = getToken();
    if (token) xhr.setRequestHeader("Authorization", `Bearer ${token}`);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onerror = () => reject(new ApiError(uploadErrorMessage(0), 0));
    xhr.onload = () => {
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
