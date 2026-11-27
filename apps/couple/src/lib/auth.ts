import { assistSession, endsAssist } from "./assist-session";

const TOKEN_KEY = "mongkolka_couple_token";

/** In a help-session tab only the assist token counts, even after it ends (see assist-session.ts). */
export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  const assist = assistSession.get();
  if (assist.status === "active") return assist.token;
  if (assist.status === "ended") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

/** An ordinary sign-in. It turns a help-session tab back into a normal one. */
export function setToken(token: string): void {
  assistSession.forget();
  window.localStorage.setItem(TOKEN_KEY, token);
}

/** In a help-session tab this ends the session and never touches the couple login stored in this browser. */
export function clearToken(): void {
  if (assistSession.get().status !== "none") {
    assistSession.end("exited");
    return;
  }
  window.localStorage.removeItem(TOKEN_KEY);
}

/** Call when a request that carried a token failed. */
export function handleAuthFailure(status: number, message: string | undefined): void {
  if (typeof window === "undefined") return;
  if (assistSession.get().status !== "none") {
    // No redirect: the dashboard shows why the session is over.
    if (endsAssist(status, message)) assistSession.end("ended");
    return;
  }
  if (status !== 401) return;
  // The token we sent was rejected (expired/invalid): clear it and bounce to sign-in so this surfaces as a
  // redirect instead of an inline error on whatever page happened to be fetching.
  clearToken();
  if (window.location.pathname !== "/") window.location.assign("/");
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
