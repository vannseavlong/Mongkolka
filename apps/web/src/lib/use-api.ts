"use client";

import { useEffect, useState } from "react";
import { API_URL } from "./api";

export type ApiState<T> =
  | { status: "loading" }
  | { status: "ready"; data: T }
  | { status: "not-found" }
  | { status: "error" };

/**
 * Client-side GET against the public API. The web app is a static export, so every page that
 * shows live data loads it in the browser. `path` null means "not ready yet" (stays loading).
 */
export function useApi<T>(path: string | null): ApiState<T> {
  const [result, setResult] = useState<{ path: string; state: ApiState<T> } | null>(null);

  useEffect(() => {
    if (!path) return;
    let cancelled = false;
    fetch(`${API_URL}${path}`)
      .then(async (res) => {
        if (cancelled) return;
        if (res.status === 404) return setResult({ path, state: { status: "not-found" } });
        if (!res.ok) return setResult({ path, state: { status: "error" } });
        setResult({ path, state: { status: "ready", data: (await res.json()) as T } });
      })
      .catch(() => !cancelled && setResult({ path, state: { status: "error" } }));
    return () => {
      cancelled = true;
    };
  }, [path]);

  return result && result.path === path ? result.state : { status: "loading" };
}
