import { GoldGradientDef, useSvgId } from "../../khmer/ornaments/Corner";

const ARCH = "M0 176C0 104 112 72 200 10C288 72 400 104 400 176";

/**
 * The pointed temple arch that crowns the doors (overlay, viewBox 400x640): deep spandrels in the
 * top corners, a double gold arch line, a lintel jewel and a stepped plinth. Never rotates; the doors
 * swing behind it.
 */
export function GateFrame({ color, deep }: { color: string; deep: string }) {
  const g = useSvgId("gf");
  const gold = `url(#${g})`;
  return (
    <svg viewBox="0 0 400 640" width="100%" height="100%" preserveAspectRatio="none" aria-hidden focusable="false" style={{ display: "block", position: "absolute", inset: 0, pointerEvents: "none" }}>
      <defs>
        <GoldGradientDef id={g} color={color} />
      </defs>
      <path d={ARCH} fill="none" stroke={gold} strokeWidth="3.4" />
      <path d={ARCH} fill="none" stroke={gold} strokeWidth="1" opacity="0.8" transform="translate(200 20) scale(0.93 0.9) translate(-200 -10)" />
      <path d={ARCH} fill="none" stroke={gold} strokeWidth="0.7" opacity="0.5" transform="translate(200 34) scale(0.86 0.82) translate(-200 -10)" />
      <path d="M200 0L208 10 200 20 192 10Z" fill={gold} />
      <g fill="none" stroke={gold} strokeWidth="1">
        <path d="M30 40C40 52 64 60 86 52" />
        <path d="M370 40C360 52 336 60 314 52" />
        <path d="M18 78C34 92 66 98 92 84" opacity="0.7" />
        <path d="M382 78C366 92 334 98 308 84" opacity="0.7" />
      </g>
      <g fill={gold}>
        <circle cx="30" cy="40" r="2.6" />
        <circle cx="370" cy="40" r="2.6" />
      </g>
      <path d="M0 640V624H10V616H390V624H400V640Z" fill={deep} stroke={gold} strokeWidth="1.6" />
      <path d="M12 628H388" stroke={gold} strokeWidth="0.8" opacity="0.8" />
    </svg>
  );
}
