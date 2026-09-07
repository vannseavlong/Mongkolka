import { clearToken, getToken } from "./auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    // Machine-readable variant, only set on a few auth responses (e.g.
    // "google_only") that the UI needs to branch on without string-matching
    // the human-readable `message`.
    public code?: string,
  ) {
    super(message);
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: res.statusText }));
    if (res.status === 401 && token && typeof window !== "undefined") {
      // The token we sent was rejected (expired/invalid) — clear it and
      // bounce to sign-in so this surfaces as a redirect instead of an
      // inline error on whatever page happened to be fetching. Requests
      // made with no token (e.g. the login form itself) are left alone to
      // throw normally, so a bad-password attempt still shows as a toast.
      clearToken();
      if (window.location.pathname !== "/") {
        window.location.assign("/");
      }
    }
    throw new ApiError(body.error ?? "Request failed", res.status, body.code);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, data?: unknown) =>
    request<T>(path, { method: "POST", body: data ? JSON.stringify(data) : undefined }),
  patch: <T>(path: string, data?: unknown) =>
    request<T>(path, { method: "PATCH", body: data ? JSON.stringify(data) : undefined }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};

export const googleLoginUrl = `${API_URL}/admin/auth/google`;
