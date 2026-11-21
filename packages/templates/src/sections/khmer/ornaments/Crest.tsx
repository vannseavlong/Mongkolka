import { goldStops } from "../../../chrome/gold";
import type { CrestProps } from "../skin-ornament-types";
import { GoldGradientDef, useSvgId } from "./Corner";

const PETALS = Array.from({ length: 16 }, (_, i) => i * 22.5);

/** Original gold crest: a ring of sixteen flame petals around a double circle holding the monogram. */
export function KbachCrest({ color, ground, label, size = 112 }: CrestProps) {
  const g = useSvgId("kr");
  const { lo } = goldStops(color);
  const long = Array.from(label).length > 5;
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" role="img" aria-label={label} style={{ display: "block", overflow: "visible" }}>
      <defs>
        <GoldGradientDef id={g} color={color} />
        <radialGradient id={`${g}b`} cx="0.5" cy="0.4" r="0.7">
          <stop offset="0" stopColor={ground} stopOpacity="0.55" />
          <stop offset="1" stopColor={ground} stopOpacity="1" />
        </radialGradient>
      </defs>
      <g>
        {PETALS.map((a) => (
          <path key={a} d="M60 4C56.5 11 56.5 17 60 22C63.5 17 63.5 11 60 4Z" fill={`url(#${g})`} transform={`rotate(${a} 60 60)`} />
        ))}
      </g>
      <circle cx="60" cy="60" r="41" fill={`url(#${g}b)`} stroke={`url(#${g})`} strokeWidth="2.2" />
      <circle cx="60" cy="60" r="36" fill="none" stroke={`url(#${g})`} strokeWidth="0.8" opacity="0.8" />
      <circle cx="60" cy="60" r="30.5" fill="none" stroke={`url(#${g})`} strokeWidth="0.5" strokeDasharray="1.5 3" opacity="0.7" />
      <path d="M60 24 56.5 28 60 32 63.5 28ZM60 96 56.5 92 60 88 63.5 92Z" fill={`url(#${g})`} />
      <text
        x="60"
        y={long ? 67 : 70}
        textAnchor="middle"
        fontSize={long ? 21 : 29}
        fill={`url(#${g})`}
        stroke={lo}
        strokeWidth="0.15"
        style={{ fontFamily: 'var(--font-script), "Great Vibes", cursive' }}
      >
        {label}
      </text>
    </svg>
  );
}
