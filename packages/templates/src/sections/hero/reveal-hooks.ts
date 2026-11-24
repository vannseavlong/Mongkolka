"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";
import { nextRevealPhase, type RevealPhase, type RevealTiming } from "./reveal-logic";

/**
 * Drives a reveal hero: waits until it is on screen, then opens by itself after `autoMs` (or when tapped),
 * plays for `openMs`, and ends open. Reduced motion shows the finished hero at once.
 */
export function useReveal(timing: RevealTiming): {
  ref: React.RefObject<HTMLElement | null>;
  phase: RevealPhase;
  open: () => void;
  reduce: boolean;
} {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion() ?? false;
  const inView = useInView(ref, { amount: 0.5, once: true });
  const [phase, setPhase] = useState<RevealPhase>("idle");
  const open = useCallback(() => setPhase((p) => nextRevealPhase(p, "start")), []);
  const effective: RevealPhase = reduce ? "open" : phase;

  useEffect(() => {
    if (reduce || phase !== "idle" || !inView) return;
    const timer = setTimeout(open, timing.autoMs);
    return () => clearTimeout(timer);
  }, [reduce, phase, inView, open, timing.autoMs]);

  useEffect(() => {
    if (phase !== "opening") return;
    const timer = setTimeout(() => setPhase((p) => nextRevealPhase(p, "finished")), timing.openMs);
    return () => clearTimeout(timer);
  }, [phase, timing.openMs]);

  return { ref, phase: effective, open, reduce };
}
