/**
 * An admin's help session in this browser tab ("assisted editing"). Pure logic: storage and clock are passed in.
 *
 * Rules that matter:
 * - The token lives in sessionStorage only, so it dies with the tab and never mixes with a couple's own login.
 * - A tab that has been a help session stays one. When access ends, it must not quietly fall back to whatever couple
 *   login this browser holds, or the admin would go on editing a different couple.
 */

export const ASSIST_STORAGE_KEY = "mongkolka_assist_session";
const FRAGMENT = "#assist=";

export type AssistEndReason = "exited" | "ended" | "expired" | "invalid";

export type AssistState =
  | { status: "none" }
  | { status: "active"; token: string; expiresAt: number }
  | { status: "ended"; reason: AssistEndReason };

type KeyValue = Pick<Storage, "getItem" | "setItem" | "removeItem">;

/** The token from an editor link, or null when this is not one. A link with nothing usable returns "". */
export function readAssistFragment(hash: string): string | null {
  if (!hash.startsWith(FRAGMENT)) return null;
  try {
    return decodeURIComponent(hash.slice(FRAGMENT.length));
  } catch {
    return "";
  }
}

/**
 * Reads the claims for display and routing only; the API verifies the signature and everything else. Only a couple
 * token carrying the assist claim is taken, so a link cannot be used to sign someone in with an ordinary token.
 */
export function parseAssistToken(token: string): { expiresAt: number } | null {
  try {
    const part = token.split(".")[1];
    if (!part) return null;
    const base64 = part.replace(/-/g, "+").replace(/_/g, "/");
    const claims = JSON.parse(atob(base64 + "=".repeat((4 - (base64.length % 4)) % 4))) as Record<string, unknown>;
    if (claims.role !== "couple" || !claims.assist || typeof claims.assist !== "object") return null;
    if (typeof claims.exp !== "number") return null;
    return { expiresAt: claims.exp * 1000 };
  } catch {
    return null;
  }
}

export function minutesLeft(expiresAt: number, now: number): number {
  return Math.max(0, Math.ceil((expiresAt - now) / 60_000));
}

/** Whether an API failure means the help session is over. Other 403s are single actions an admin may not take. */
export function endsAssist(status: number, message: string | undefined): boolean {
  return status === 401 || (status === 403 && message === "Assist access ended");
}

export function createAssistStore(storage: () => KeyValue | null, clock: () => number = Date.now) {
  const listeners = new Set<() => void>();
  const NONE: AssistState = { status: "none" };
  // The same object is returned until something changes, as useSyncExternalStore requires.
  let state: AssistState | null = null;

  function load(): AssistState {
    try {
      const raw = storage()?.getItem(ASSIST_STORAGE_KEY);
      if (!raw) return NONE;
      const saved = JSON.parse(raw) as { token?: unknown; reason?: unknown };
      if (typeof saved.token === "string") {
        const parsed = parseAssistToken(saved.token);
        if (parsed) return { status: "active", token: saved.token, expiresAt: parsed.expiresAt };
        return { status: "ended", reason: "invalid" };
      }
      return { status: "ended", reason: (saved.reason as AssistEndReason) ?? "ended" };
    } catch {
      return NONE;
    }
  }

  function save(next: AssistState) {
    state = next;
    try {
      if (next.status === "none") storage()?.removeItem(ASSIST_STORAGE_KEY);
      // An ended session keeps only the reason: the token is gone.
      else storage()?.setItem(ASSIST_STORAGE_KEY, JSON.stringify(next.status === "active" ? { token: next.token } : { reason: next.reason }));
    } catch {
      // Storage blocked or full: the state still holds in memory for this page.
    }
    listeners.forEach((listener) => listener());
  }

  function get(): AssistState {
    state ??= load();
    if (state.status === "active" && state.expiresAt <= clock()) save({ status: "ended", reason: "expired" });
    return state;
  }

  return {
    get,
    /**
     * Takes the token out of an editor link and removes it from the address bar, whether or not it is usable.
     * Returns true when the address held an editor link.
     */
    capture(location: { hash: string; pathname: string; search: string }, replaceUrl: (url: string) => void): boolean {
      const token = readAssistFragment(location.hash);
      if (token === null) return false;
      replaceUrl(`${location.pathname}${location.search}`);
      const parsed = parseAssistToken(token);
      save(
        parsed && parsed.expiresAt > clock()
          ? { status: "active", token, expiresAt: parsed.expiresAt }
          : { status: "ended", reason: parsed ? "expired" : "invalid" },
      );
      return true;
    },
    end(reason: AssistEndReason) {
      if (get().status === "active") save({ status: "ended", reason });
    },
    /** Only on an explicit choice to use this tab for an ordinary sign-in. */
    forget() {
      save(NONE);
    },
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => void listeners.delete(listener);
    },
  };
}

export const assistSession = createAssistStore(() => (typeof window === "undefined" ? null : window.sessionStorage));
