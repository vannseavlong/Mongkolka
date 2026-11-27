import type { ReactNode } from "react";
import { KbachBackdrop } from "./KbachBackdrop";
import { petalPath } from "./geometry";

const GOLD = "#b8892e";

/** Sections that get the lotus border along their top edge. */
const BANDED = ["invitation", "map", "guestbook"];

const BAND_IMAGE = `url("data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='30' height='28'><g fill='none' stroke='${GOLD}'><path transform='matrix(1 0 0 -1 0 28)' d='${petalPath(15, 23, 24, 20)}${petalPath(15, 23, 13, 13)}${petalPath(0, 23, 9, 11)}${petalPath(30, 23, 9, 11)}M0 24.5H30M0 27.5H30'/></g></svg>`,
)}")`;

// Section grounds become see-through so the fixed pattern shows; photo screens (hero, intro stages) keep theirs.
const CSS = `.mk-kbach section:not(.cv-hero):not(.cv-stage){background-color:transparent!important}
.mk-kbach .cv-verse{background-image:none}
${BANDED.map((id) => `.mk-kbach section#${id}`).join(",")}{position:relative}
${BANDED.map((id) => `.mk-kbach section#${id}::before`).join(",")}{content:"";position:absolute;top:0;left:0;right:0;height:28px;background:${BAND_IMAGE} repeat-x;opacity:.45;pointer-events:none}`;

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
