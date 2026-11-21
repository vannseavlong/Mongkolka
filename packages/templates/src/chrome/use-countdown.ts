"use client";

import { useEffect, useState } from "react";
import { getCountdown, isCountdownLive, type Countdown } from "./countdown";

/**
 * Live countdown to `targetIso` (ISO with an offset, e.g. "2026-05-29T17:00:00+07:00").
 * Returns null on the server and first client render (the clock is not known yet), so markup
 * matches during hydration. Ticks once a second only while there is something left to count, and
 * re-syncs when the tab becomes visible again.
 */
export function useCountdown(targetIso: string | null | undefined): Countdown | null {
  const [value, setValue] = useState<Countdown | null>(null);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | undefined;
    const tick = () => {
      const next = getCountdown(targetIso, Date.now());
      setValue(next);
      if (!isCountdownLive(next.status) && timer) {
        clearInterval(timer);
        timer = undefined;
      }
    };
    const start = () => {
      tick();
      if (!timer && document.visibilityState !== "hidden") timer = setInterval(tick, 1000);
    };
    const onVisibility = () => {
      if (document.visibilityState === "hidden") {
        if (timer) clearInterval(timer);
        timer = undefined;
      } else {
        start();
      }
    };
    start();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      if (timer) clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [targetIso]);

  return value;
}
