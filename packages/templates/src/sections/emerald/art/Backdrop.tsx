import { GoldGradientDef, KbachCorner, useSvgId } from "../../khmer/ornaments/Corner";
import { withAlpha } from "../../../chrome/gold";
import { latticeDataUri } from "../palette";

/** Spire towers as [centre x, height] on a 400x80 strip; the strip stretches to the stage width. */
const SPIRES: Array<[number, number]> = [[34, 36], [92, 54], [148, 40], [200, 72], [252, 40], [308, 54], [366, 36]];

export function skylinePath(): string {
  const base = 80;
  let d = `M0 ${base}`;
  for (const [cx, h] of SPIRES) {
    const w = 15;
    d += `L${cx - w} ${base}L${cx - w} ${base - h * 0.5}L${cx - w + 4} ${base - h * 0.5}L${cx - w + 4} ${base - h * 0.74}Q${cx - 3} ${base - h * 0.84} ${cx} ${base - h}Q${cx + 3} ${base - h * 0.84} ${cx + w - 4} ${base - h * 0.74}L${cx + w - 4} ${base - h * 0.5}L${cx + w} ${base - h * 0.5}L${cx + w} ${base}`;
  }
  return `${d}L400 ${base}Z`;
}

/** A row of original tiered lotus-bud spires along the bottom, deep emerald with a gold edge. */
export function Skyline({ color, deep }: { color: string; deep: string }) {
  const g = useSvgId("sk");
  return (
    <svg viewBox="0 0 400 80" preserveAspectRatio="none" aria-hidden focusable="false" style={{ display: "block", width: "100%", height: "clamp(46px,9vw,84px)" }}>
      <defs>
        <GoldGradientDef id={g} color={color} />
      </defs>
      <path d={skylinePath()} fill={deep} stroke={`url(#${g})`} strokeWidth="1.2" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

/**
 * The layered ground of the opening and the hero: emerald glow, kbach lattice, vignette, a double
 * gold pin-stripe on four sides and kbach corners. Absolutely positioned; content sits above it.
 */
export function EmeraldBackdrop({ accent, ground, deep, corners = true, bottomCorners = true }: { accent: string; ground: string; deep: string; corners?: boolean; bottomCorners?: boolean }) {
  const line = accent;
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: `radial-gradient(120% 70% at 50% 18%, ${ground}, ${deep} 82%)` }}>
      <div className="absolute inset-0" style={{ backgroundImage: latticeDataUri(accent, 0.09), backgroundSize: "56px 56px", opacity: 0.9 }} />
      <div className="absolute inset-0" style={{ background: `radial-gradient(90% 60% at 50% 0%, ${withAlpha(accent, 0.13)}, transparent 65%), radial-gradient(130% 90% at 50% 50%, transparent 55%, ${deep} 100%)` }} />
      <div className="absolute" style={{ inset: 10, border: `1px solid ${line}`, opacity: 0.8 }} />
      <div className="absolute" style={{ inset: 15, border: `1px solid ${line}`, opacity: 0.4 }} />
      {corners && (
        <>
          <div className="absolute" style={{ top: 6, left: 6 }}><KbachCorner color={accent} size={60} /></div>
          <div className="absolute" style={{ top: 6, right: 6, transform: "scaleX(-1)" }}><KbachCorner color={accent} size={60} /></div>
          {bottomCorners && (
            <>
              <div className="absolute" style={{ bottom: 6, left: 6, transform: "scaleY(-1)" }}><KbachCorner color={accent} size={60} /></div>
              <div className="absolute" style={{ bottom: 6, right: 6, transform: "scale(-1,-1)" }}><KbachCorner color={accent} size={60} /></div>
            </>
          )}
        </>
      )}
    </div>
  );
}
