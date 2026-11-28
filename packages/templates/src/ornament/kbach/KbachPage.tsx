import type { ReactNode } from "react";
import { KbachBackdrop } from "./KbachBackdrop";

const GOLD = "#b8892e";

// Section grounds and tints become see-through so the fixed pattern runs unbroken from one section to the next;
// photo screens (hero, intro stages) keep theirs.
const CSS = `.mk-kbach section:not(.cv-hero):not(.cv-stage){background-color:transparent!important;background-image:none!important}`;

/**
 * The page ground with the fixed Khmer pattern. `isolation` keeps the layer (z-index -1) above this ground and
 * below everything on the page, without changing how popups and the dock stack.
 */
export function KbachPage({ ground, accent, children }: { ground: string; accent: string; children: ReactNode }) {
  return (
    <div className="mk-kbach" style={{ position: "relative", isolation: "isolate", minHeight: "100svh", backgroundColor: ground }}>
      <style href="mk-kbach-css" precedence="mk-kbach">
        {CSS}
      </style>
      <KbachBackdrop color={accent} gold={GOLD} />
      {children}
    </div>
  );
}
