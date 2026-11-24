"use client";

import { useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";

/**
 * The static export builds each dynamic route once with the placeholder param "_" and Firebase
 * rewrites every real URL to that shell, so the real value is read from the browser path.
 * `segments` are the leading static segments to skip, e.g. ["marketplace"] for /marketplace/<id>.
 * Returns undefined while the path is not yet the real one (build placeholder).
 */
export function useRouteParam(skip: string[] = []): string | undefined {
  const routed = usePathname() ?? "";
  // Under `next dev` the dev rewrites in next.config.ts serve the "_" shell, and usePathname() may report the shell
  // path; the browser's own path is the real URL. null while rendering on the server, so there is no hydration mismatch.
  const browserPath = useSyncExternalStore(
    () => () => {},
    () => window.location.pathname,
    () => null,
  );
  const pathname = browserPath ?? routed;
  const parts = pathname.split("/").filter(Boolean);
  const value = parts[skip.length];
  if (!value || value === "_") return undefined;
  try {
    return decodeURIComponent(value);
  } catch {
    return undefined; // malformed %-escape: treated as not found
  }
}
