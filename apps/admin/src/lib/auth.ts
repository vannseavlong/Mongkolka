const TOKEN_KEY = "mongkolka_admin_token";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  window.localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  window.localStorage.removeItem(TOKEN_KEY);
}

export interface SessionUser {
  user_id: string;
  role: string;
  email: string;
  status: string;
  [key: string]: unknown;
}

/** Decodes the JWT payload for display purposes only — the API is what actually verifies it. */
export function decodeSessionUser(token: string): SessionUser | null {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
    const json = atob(padded);
    return JSON.parse(json) as SessionUser;
  } catch {
    return null;
  }
}
