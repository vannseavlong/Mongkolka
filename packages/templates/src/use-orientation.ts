"use client";

import { useSyncExternalStore } from "react";
import type { Orientation } from "./hero-photo";

const QUERY = "(orientation: portrait)";

function subscribe(callback: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

/** The viewer's screen orientation, live. Portrait on the server (most guests are on a phone). */
export function useOrientation(): Orientation {
  return useSyncExternalStore(
    subscribe,
    () => (window.matchMedia(QUERY).matches ? "portrait" : "landscape"),
    () => "portrait",
  );
}
