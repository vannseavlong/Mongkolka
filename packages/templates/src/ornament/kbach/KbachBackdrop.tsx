import { DiamondWeave, FlameCorner } from "./motifs";

/** The middle stays calm so cards and text read on a clean ground; the pattern shows towards the sides. */
const EDGE_FADE = "radial-gradient(ellipse 55% 75% at 50% 50%, transparent 35%, #000 100%)";

const LAYER = { position: "fixed", top: 0, left: 0, right: 0, height: "100lvh", overflow: "hidden", pointerEvents: "none" } as const;

/** Above the content and the dock (50), below the cover, language switch (60) and photo viewer (100). */
const CORNER_Z = 55;

/**
 * Page decoration that stays still while the content scrolls over it. Render it once, through `KbachPage`,
 * with section backgrounds that let it show through. A fixed layer is used
 * because `background-attachment: fixed` does not work on iOS. Height is the large viewport, so the pattern
 * does not jump when a phone's toolbar hides. Strength is set with CSS variables. The pattern sits behind the
 * content and the corners in front of it; neither takes taps.
 */
export function KbachBackdrop({ color, gold }: { color: string; gold: string }) {
  const corner = { position: "absolute", width: "clamp(76px, 16vw, 210px)", opacity: "var(--kbach-corner, 0.55)" } as const;
  return (
    <>
      <div aria-hidden style={{ ...LAYER, zIndex: -1 }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(80% 45% at 50% 0%, rgba(255, 224, 170, var(--kbach-light, 0.22)), transparent 70%)" }} />
        <DiamondWeave color={color} style={{ position: "absolute", inset: 0, opacity: "var(--kbach-lattice, 0.07)", maskImage: EDGE_FADE, WebkitMaskImage: EDGE_FADE }} />
      </div>
      <div aria-hidden style={{ ...LAYER, zIndex: CORNER_Z }}>
        <FlameCorner color={gold} style={{ ...corner, left: 0, top: 0 }} />
        <FlameCorner color={gold} style={{ ...corner, right: 0, bottom: 0, transform: "rotate(180deg)" }} />
      </div>
    </>
  );
}
