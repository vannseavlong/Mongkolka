"use client";

import { useEffect, useRef, useState } from "react";
import { shouldDeferReveal } from "./reveal";

export type RevealState = "visible" | "pending" | "in";

/**
 * Fade-and-rise on first scroll into view. Server markup is always "visible" (nothing is hidden
 * without JavaScript); after mount, sections below the fold become "pending" and flip to "in"
 * once. Sections already on screen, and everything under reduced motion, are never hidden.
 */
export function useReveal<T extends HTMLElement>(enabled: boolean) {
  const ref = useRef<T>(null);
  const [state, setState] = useState<RevealState>("visible");

  useEffect(() => {
    const el = ref.current;
    if (!enabled || !el || typeof IntersectionObserver === "undefined") return;
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    if (!shouldDeferReveal(el.getBoundingClientRect().top, window.innerHeight, reduced)) return;

    setState("pending");
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setState("in");
          observer.disconnect();
        }
      },
      { threshold: 0.06, rootMargin: "0px 0px -6% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [enabled]);

  return { ref, state };
}
