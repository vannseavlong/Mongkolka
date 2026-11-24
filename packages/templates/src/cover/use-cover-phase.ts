"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { coverTiming, nextCoverPhase, type CoverPhase, type CoverTiming } from "./cover-phase";

/**
 * Drives a cover: plays, reveals by itself after `playMs` (or on tap), then reports done.
 * `onReveal` fires once when the reveal starts (the renderer mounts the opening beneath at
 * that moment); `onDone` once when the cover has fully faded and can be removed.
 */
export function useCoverPhase({ onReveal, onDone, preview = false }: { onReveal: () => void; onDone: () => void; preview?: boolean }): {
  phase: CoverPhase;
  timing: CoverTiming;
  reduce: boolean;
  skip: () => void;
} {
  const reduce = useReducedMotion() ?? false;
  const timing = coverTiming(reduce);
  const [phase, setPhase] = useState<CoverPhase>("play");
  const onRevealRef = useRef(onReveal);
  const onDoneRef = useRef(onDone);
  useEffect(() => {
    onRevealRef.current = onReveal;
    onDoneRef.current = onDone;
  });

  useEffect(() => {
    if (preview) return;
    if (phase === "play") {
      const timer = setTimeout(() => setPhase((p) => nextCoverPhase(p, "tick")), timing.playMs);
      return () => clearTimeout(timer);
    }
    if (phase === "reveal") {
      onRevealRef.current();
      const timer = setTimeout(() => setPhase((p) => nextCoverPhase(p, "finished")), timing.revealMs);
      return () => clearTimeout(timer);
    }
    onDoneRef.current();
  }, [phase, preview, timing.playMs, timing.revealMs]);

  return { phase, timing, reduce, skip: () => !preview && setPhase((p) => nextCoverPhase(p, "tap")) };
}
