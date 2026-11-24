import { useId } from "react";
import { goldStops, withAlpha } from "../../chrome/gold";

/** Original ornament artwork for the Covenant invitation card. Decorative: every SVG is aria-hidden. */

function useGold(color: string, prefix: string) {
  const id = `${prefix}${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const { hi, mid, lo } = goldStops(color);
  const def = (
    <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor={hi} />
      <stop offset="0.5" stopColor={mid} />
      <stop offset="1" stopColor={lo} />
    </linearGradient>
  );
  return { fill: `url(#${id})`, def };
}

/** Top-left flourish corner: a rounded border arc ending in two curls, an inner scroll and two leaves. Mirror it for the other corners. */
export function FlourishCorner({ color, size = 110 }: { color: string; size?: number }) {
  const g = useGold(color, "fc");
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" aria-hidden focusable="false" style={{ display: "block", overflow: "visible" }}>
      <defs>{g.def}</defs>
      <g fill="none" stroke={g.fill} strokeLinecap="round" strokeWidth="2.2">
        <path d="M8 72C8 30 30 8 72 8" />
        <path d="M72 8C88 8 98 17 96 28C94 38 82 38 81 30C80 23 87 20 91 24" />
        <path d="M8 72C8 88 17 98 28 96C38 94 38 82 30 81C23 80 20 87 24 91" />
        <path d="M30 30C44 27 56 33 54 45C52 54 42 54 41 47C40 41 46 39 49 43" strokeWidth="1.8" />
        <path d="M18 18C34 16 40 22 38 28M18 18C16 34 22 40 28 38" strokeWidth="1.2" opacity="0.8" />
      </g>
      <g fill={g.fill}>
        <path d="M44 16C54 8 66 12 68 20C58 24 48 24 44 16Z" />
        <path d="M16 44C8 54 12 66 20 68C24 58 24 48 16 44Z" />
        <circle cx="8" cy="8" r="3.4" />
        <circle cx="100" cy="14" r="1.8" />
        <circle cx="14" cy="100" r="1.8" />
      </g>
    </svg>
  );
}

/** Centre flourish for the middle of an edge (a diamond with mirrored scrolls and fading rules), 240 x 40. Rotate it for the side edges. */
export function FlourishEdge({ color, width = 240 }: { color: string; width?: number }) {
  const g = useGold(color, "fe");
  const half = "M112 20C100 20 96 8 84 8C70 8 66 20 76 22C84 23 84 14 78 14M112 20C102 26 96 34 84 33C72 32 70 24 78 24";
  return (
    <svg width={width} height={(width * 40) / 240} viewBox="0 0 240 40" aria-hidden focusable="false" style={{ display: "block", maxWidth: "100%", overflow: "visible" }}>
      <defs>{g.def}</defs>
      <g fill="none" stroke={g.fill} strokeLinecap="round" strokeWidth="1.8">
        <path d={half} />
        <path d={half} transform="translate(240 0) scale(-1 1)" />
        <path d="M62 20H6M178 20H234" strokeWidth="1.2" />
      </g>
      <path d="M120 10 128 20 120 30 112 20Z" fill={g.fill} />
      <circle cx="6" cy="20" r="2" fill={g.fill} />
      <circle cx="234" cy="20" r="2" fill={g.fill} />
    </svg>
  );
}

/** A butterfly seen from above: four wings with a dotted rim and veins. */
export function Butterfly({ color, size = 96 }: { color: string; size?: number }) {
  const g = useGold(color, "bf");
  const wing = (
    <g>
      <path d="M50 48C42 22 20 6 9 17C0 28 16 46 50 50Z" />
      <path d="M50 52C32 56 12 68 19 83C27 95 43 78 50 54Z" />
    </g>
  );
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden focusable="false" style={{ display: "block", overflow: "visible" }}>
      <defs>{g.def}</defs>
      <g fill="none" stroke={g.fill} strokeWidth="2" strokeLinejoin="round">
        {wing}
        <g transform="translate(100 0) scale(-1 1)">{wing}</g>
        <path d="M50 30V84" strokeWidth="2.6" strokeLinecap="round" />
        <path d="M50 32C46 20 40 14 34 12M50 32C54 20 60 14 66 12" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M46 46C34 34 22 28 14 24M46 54C34 58 26 66 24 76" strokeWidth="0.9" opacity="0.7" />
        <path d="M54 46C66 34 78 28 86 24M54 54C66 58 74 66 76 76" strokeWidth="0.9" opacity="0.7" />
      </g>
      <g fill={g.fill}>
        {[[16, 22], [22, 15], [11, 29], [24, 78], [30, 86], [19, 70]].flatMap(([x, y]) => [<circle key={`l${x}${y}`} cx={x} cy={y} r="1.8" />, <circle key={`r${x}${y}`} cx={100 - x!} cy={y} r="1.8" />])}
      </g>
    </svg>
  );
}

const HEART = "M50 90C8 60 8 22 31 20C42 19 48 26 50 33C52 26 58 19 69 20C92 22 92 60 50 90Z";

/** Two interlocked heart outlines. */
export function Hearts({ color, size = 96 }: { color: string; size?: number }) {
  const g = useGold(color, "ht");
  return (
    <svg width={size} height={size * 0.8} viewBox="0 8 130 90" aria-hidden focusable="false" style={{ display: "block", overflow: "visible" }}>
      <defs>{g.def}</defs>
      <g fill="none" stroke={g.fill} strokeWidth="2.6" strokeLinejoin="round">
        <path d={HEART} transform="translate(0 4) rotate(-10 50 50)" />
        <path d={HEART} transform="translate(32 -2) rotate(12 50 50)" />
      </g>
    </svg>
  );
}

/** Soft white petals overlapping the left edge of the card, as in a bouquet laid against it. */
export function EdgePetals({ height = 520 }: { height?: number }) {
  const petals: Array<[number, number, number, number, number]> = [
    [10, 8, 46, 26, -24], [4, 22, 52, 28, 12], [12, 36, 44, 24, -8], [2, 52, 50, 27, 20],
    [10, 66, 46, 25, -18], [3, 80, 52, 28, 8],
  ];
  return (
    <svg width="60" height={height} viewBox="0 0 60 100" preserveAspectRatio="none" aria-hidden focusable="false" style={{ display: "block", overflow: "visible" }}>
      <defs>
        <radialGradient id="cvpetal" cx="0.7" cy="0.4" r="0.8">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#efe6cf" />
        </radialGradient>
      </defs>
      {petals.map(([x, y, rx, ry, r], i) => (
        <ellipse key={i} cx={x} cy={y} rx={rx / 2} ry={ry / 2} transform={`rotate(${r} ${x} ${y})`} fill="url(#cvpetal)" stroke={withAlpha("#b89b5a", 0.35)} strokeWidth="0.4" />
      ))}
    </svg>
  );
}
