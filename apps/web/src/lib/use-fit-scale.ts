"use client";

import { useEffect, useRef, useState } from "react";

/** Scale that fits a `baseWidth`-px wide design into the element's current width. */
export function useFitScale<T extends HTMLElement>(baseWidth: number) {
  const ref = useRef<T>(null);
  const [scale, setScale] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setScale(el.clientWidth / baseWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [baseWidth]);
  return { ref, scale };
}
