"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { nextPhase, timelineFor, type OpeningPhase } from "./opening-logic";

function subscribeReduced(cb: () => void): () => void {
  if (typeof window === "undefined" || !window.matchMedia) return () => undefined;
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribeReduced,
    () => (typeof window !== "undefined" && !!window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches),
    () => false,
  );
}

/** Drives the door opening: `tap()` starts it, `onOpen` fires once at the end of the timeline. */
export function useOpening(onOpen: () => void): { phase: OpeningPhase; tap: () => void; reduced: boolean } {
  const reduced = usePrefersReducedMotion();
  const [phase, setPhase] = useState<OpeningPhase>("closed");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onOpenRef = useRef(onOpen);
  onOpenRef.current = onOpen;

  const tap = useCallback(() => {
    setPhase((p) => nextPhase(p, "tap"));
  }, []);

  useEffect(() => {
    if (phase !== "opening") return;
    timer.current = setTimeout(() => {
      setPhase((p) => nextPhase(p, "finished"));
      onOpenRef.current();
    }, timelineFor(reduced).totalMs);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [phase, reduced]);

  return { phase, tap, reduced };
}
