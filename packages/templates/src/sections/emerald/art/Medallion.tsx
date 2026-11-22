import { goldStops } from "../../../chrome/gold";
import { GoldGradientDef, useSvgId } from "../../khmer/ornaments/Corner";
import { starPoints } from "../palette";

const FLAMES = Array.from({ length: 24 }, (_, i) => i * 15);
const LOTUS = Array.from({ length: 12 }, (_, i) => i * 30 + 15);
const STAR = starPoints(100, 100, 56, 38, 8);

export interface MedallionProps {
  color: string;
  ground: string;
  /** Monogram in the centre disc; empty shows a small lotus instead. */
  label?: string;
  size?: number;
  /** Slow counter-rotating rings (CSS classes from EMERALD_CSS). */
  spin?: boolean;
  glow?: boolean;
}

/**
 * Original gold medallion: a ring of 24 flame petals, a counter-turning ring of 12 lotus petals,
 * an eight-point star and a monogram disc. Drawn from scratch (it is not the national emblem and
 * does not copy the reference). The two outer rings turn in opposite directions when `spin`.
 */
export function Medallion({ color, ground, label, size = 200, spin = false, glow = true }: MedallionProps) {
  const g = useSvgId("em");
  const { hi, lo } = goldStops(color);
  const text = label?.trim() ?? "";
  const long = Array.from(text).length > 5;
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" role={text ? "img" : undefined} aria-label={text || undefined} aria-hidden={text ? undefined : true} focusable="false" style={{ display: "block", overflow: "visible" }}>
      <defs>
        <GoldGradientDef id={g} color={color} />
        <radialGradient id={`${g}g`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor={hi} stopOpacity="0.5" />
          <stop offset="0.6" stopColor={color} stopOpacity="0.14" />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${g}d`} cx="0.5" cy="0.38" r="0.75">
          <stop offset="0" stopColor={ground} stopOpacity="0.6" />
          <stop offset="1" stopColor={ground} />
        </radialGradient>
      </defs>
      {glow && <circle cx="100" cy="100" r="118" fill={`url(#${g}g)`} />}
      <g className={spin ? "em-spin" : undefined} style={{ transformOrigin: "100px 100px" }}>
        {FLAMES.map((a) => (
          <path key={a} d="M100 3C93 20 93 34 100 48C107 34 107 20 100 3Z" fill={`url(#${g})`} transform={`rotate(${a} 100 100)`} />
        ))}
      </g>
      <g className={spin ? "em-spin-rev" : undefined} style={{ transformOrigin: "100px 100px" }}>
        {LOTUS.map((a) => (
          <path key={a} d="M100 28C88 42 88 60 100 72C112 60 112 42 100 28Z" fill={ground} fillOpacity="0.5" stroke={`url(#${g})`} strokeWidth="1.1" transform={`rotate(${a} 100 100)`} />
        ))}
      </g>
      <circle cx="100" cy="100" r="72" fill="none" stroke={`url(#${g})`} strokeWidth="1.6" />
      <circle cx="100" cy="100" r="68" fill="none" stroke={`url(#${g})`} strokeWidth="0.6" strokeDasharray="1.5 3.5" />
      <polygon points={STAR} fill="none" stroke={`url(#${g})`} strokeWidth="1.2" strokeLinejoin="round" />
      <polygon points={starPoints(100, 100, 44, 30, 8)} fill={`url(#${g})`} fillOpacity="0.16" stroke={`url(#${g})`} strokeWidth="0.6" />
      <circle cx="100" cy="100" r="33" fill={`url(#${g}d)`} stroke={`url(#${g})`} strokeWidth="2.2" />
      <circle cx="100" cy="100" r="28" fill="none" stroke={`url(#${g})`} strokeWidth="0.6" strokeDasharray="1 2.6" />
      {[0, 90, 180, 270].map((a) => (
        <path key={a} d="M100 24 96.5 28.5 100 33 103.5 28.5Z" fill={`url(#${g})`} transform={`rotate(${a} 100 100)`} />
      ))}
      {text ? (
        <text
          x="100"
          y={long ? 106 : 109}
          textAnchor="middle"
          fontSize={long ? 19 : 26}
          fill={`url(#${g})`}
          stroke={lo}
          strokeWidth="0.15"
          style={{ fontFamily: 'var(--font-script), "Great Vibes", cursive' }}
        >
          {text}
        </text>
      ) : (
        <g fill="none" stroke={`url(#${g})`} strokeWidth="1.4" strokeLinejoin="round">
          <path d="M100 82C92 90 92 102 100 112C108 102 108 90 100 82Z" />
          <path d="M100 112C88 110 82 102 82 94C90 96 96 102 100 112ZM100 112C112 110 118 102 118 94C110 96 104 102 100 112Z" />
        </g>
      )}
    </svg>
  );
}
