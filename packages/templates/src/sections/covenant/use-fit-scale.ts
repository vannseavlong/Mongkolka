"use client";

import { useLayoutEffect, useRef, useState, type RefObject } from "react";
import { fitScale } from "./intro-logic";

/**
 * Keeps `content` inside `box` without scrolling: returns a scale (<= 1) to apply to the content, re-measured when
 * either element resizes (rotation, language change, fonts arriving). The content's own layout height is not affected
 * by transforms, so the measurement stays stable.
 */
export function useFitScale<B extends HTMLElement, C extends HTMLElement>(): { boxRef: RefObject<B | null>; contentRef: RefObject<C | null>; scale: number } {
  const boxRef = useRef<B>(null);
  const contentRef = useRef<C>(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const box = boxRef.current;
    const content = contentRef.current;
    if (!box || !content) return;
    const measure = () => {
      const cs = getComputedStyle(box);
      const avail = box.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
      setScale(fitScale(avail, content.offsetHeight));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(box);
    ro.observe(content);
    return () => ro.disconnect();
  }, []);

  return { boxRef, contentRef, scale };
}
