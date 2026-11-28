"use client";

import { useRef, type ReactNode } from "react";
import type { SiteDecor } from "../../site-decor";
import { KbachBackdrop } from "./KbachBackdrop";
import { useClearGrounds } from "./use-clear-grounds";

const GOLD = "#b8892e";

// Covenant: section grounds and tints become see-through so the page runs unbroken from one section to the next;
// photo screens (hero, intro stages) keep theirs.
const SEAMLESS_CSS = `.mk-seamless section:not(.cv-hero):not(.cv-stage){background-color:transparent!important;background-image:none!important}`;
const CLEAR_CSS = `.mk-kbach [data-mk-clear]{background-color:transparent!important;background-image:none!important}`;

/**
 * The page ground with the chosen pattern and corners. `isolation` keeps the pattern (z-index -1) above this ground
 * and below everything on the page, without changing how popups and the dock stack. With nothing to draw the wrapper
 * has no box; it stays in the tree so changing the design in the builder does not remount the site.
 */
export function KbachPage({ ground, accent, decor, seamless, children }: { ground: string; accent: string; decor: SiteDecor; seamless: boolean; children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const drawn = !!decor.pattern || decor.corners;
  const boxed = drawn || seamless;
  useClearGrounds(root, ground, !!decor.pattern && !seamless);
  return (
    <div
      ref={root}
      className={boxed ? `mk-kbach${seamless ? " mk-seamless" : ""}` : undefined}
      style={boxed ? { position: "relative", isolation: "isolate", minHeight: "100svh", backgroundColor: ground } : { display: "contents" }}
    >
      {boxed && (
        <style href="mk-kbach-css" precedence="mk-kbach">
          {SEAMLESS_CSS + CLEAR_CSS}
        </style>
      )}
      {drawn && <KbachBackdrop color={accent} gold={GOLD} pattern={decor.pattern} corners={decor.corners} />}
      {children}
    </div>
  );
}
