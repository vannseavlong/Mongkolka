"use client";

import type { ReactNode } from "react";
import { sectionAnchorId } from "./dock-items";
import { useReveal } from "./use-reveal";

/**
 * Wrapper around one rendered section when chrome is on: gives the dock and scroll-spy an anchor
 * and fades the section up as it scrolls into view. Not rendered at all when chrome is off, so
 * existing templates keep their exact DOM.
 */
export function ChromeSection({ sectionKey, reveal, children }: { sectionKey: string; reveal: boolean; children: ReactNode }) {
  const { ref, state } = useReveal<HTMLDivElement>(reveal);
  return (
    <div id={sectionAnchorId(sectionKey)} ref={ref} data-mk-section={sectionKey} data-mk-reveal={reveal ? state : undefined}>
      {children}
    </div>
  );
}
