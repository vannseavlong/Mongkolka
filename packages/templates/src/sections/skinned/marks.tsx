import type { MarkProps } from "./skin-ui-types";
import { mixHex, withAlpha } from "../../chrome/gold";

/** Six small original signature marks, one per skin. Decorative (aria-hidden); all SVG. */

export function LozengeMark({ color, size = 44 }: MarkProps) {
  const lo = mixHex(color, "#3a2400", 70);
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden focusable="false">
      <path d="M24 3 45 24 24 45 3 24Z" fill="none" stroke={color} strokeWidth="1.6" />
      <path d="M24 10 38 24 24 38 10 24Z" fill={withAlpha(color, 0.18)} stroke={lo} strokeWidth="1" />
      <path d="M24 17 31 24 24 31 17 24Z" fill={color} />
      <path d="M24 0v3M24 45v3M0 24h3M45 24h3" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export function RoseMark({ color, size = 48 }: MarkProps) {
  const leaf = "#8fa77c";
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden focusable="false">
      <path d="M24 30C16 30 8 36 5 44 15 44 22 40 24 34Z" fill={leaf} opacity=".85" />
      <path d="M24 30C32 30 40 36 43 44 33 44 26 40 24 34Z" fill={leaf} opacity=".85" />
      <circle cx="24" cy="20" r="13" fill={withAlpha(color, 0.2)} stroke={color} strokeWidth="1.3" />
      <path d="M24 20c0-4 5-4 5 0s-8 4-8-1 9-7 11-1" fill="none" stroke={color} strokeWidth="1.3" strokeLinecap="round" />
      <path d="M13 17c3-5 8-7 12-6M35 24c-2 5-7 8-12 7" fill="none" stroke={withAlpha(color, 0.7)} strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

export function PeonyMark({ color, size = 48 }: MarkProps) {
  const petal = mixHex(color, "#f2c4c4", 38);
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden focusable="false">
      {[0, 60, 120, 180, 240, 300].map((r) => (
        <ellipse key={r} cx="24" cy="12" rx="7" ry="11" fill={withAlpha(petal, 0.75)} stroke={withAlpha(color, 0.55)} strokeWidth="0.8" transform={`rotate(${r} 24 24)`} />
      ))}
      <circle cx="24" cy="24" r="8" fill={withAlpha(petal, 0.95)} stroke={color} strokeWidth="1" />
      <circle cx="24" cy="24" r="3.2" fill={color} />
    </svg>
  );
}

export function BlossomMark({ color, size = 48 }: MarkProps) {
  const petal = mixHex(color, "#ffd6e4", 40);
  const pts = [0, 72, 144, 216, 288];
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden focusable="false">
      {pts.map((r) => (
        <path key={r} d="M24 24C16 20 17 6 24 5 31 6 32 20 24 24Z" fill={withAlpha(petal, 0.9)} stroke={withAlpha(color, 0.6)} strokeWidth="0.8" transform={`rotate(${r} 24 24)`} />
      ))}
      <circle cx="24" cy="24" r="3.4" fill="#e8c46a" />
      {pts.map((r) => (
        <path key={`s${r}`} d="M24 24 24 15" stroke="#e8c46a" strokeWidth="0.9" strokeLinecap="round" transform={`rotate(${r + 36} 24 24)`} />
      ))}
    </svg>
  );
}

export function HydrangeaMark({ color, size = 48 }: MarkProps) {
  const floret = (cx: number, cy: number, k: string) => (
    <g key={k} transform={`translate(${cx} ${cy})`}>
      {[0, 90, 180, 270].map((r) => (
        <circle key={r} cx="0" cy="-4.6" r="4.2" fill={withAlpha(color, 0.3)} stroke={withAlpha(color, 0.75)} strokeWidth="0.8" transform={`rotate(${r})`} />
      ))}
      <circle r="1.6" fill="#fff" />
    </g>
  );
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden focusable="false">
      <path d="M24 46C22 38 14 34 6 36 10 42 18 46 24 46Z" fill="#8fb59a" opacity=".85" />
      <path d="M24 46C26 38 34 34 42 36 38 42 30 46 24 46Z" fill="#8fb59a" opacity=".85" />
      {floret(24, 12, "a")}
      {floret(14, 22, "b")}
      {floret(34, 22, "c")}
      {floret(24, 31, "d")}
    </svg>
  );
}

export function StarHeartMark({ color, size = 48 }: MarkProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden focusable="false">
      <path d="M24 41C10 31 6 24 6 17A9 9 0 0 1 24 13 9 9 0 0 1 42 17C42 24 38 31 24 41Z" fill={color} stroke="#fff" strokeWidth="2.4" strokeLinejoin="round" />
      <path d="M24 17l2.6 5.3 5.8.8-4.2 4.1 1 5.8L24 30.3l-5.2 2.7 1-5.8-4.2-4.1 5.8-.8Z" fill="#ffe08a" stroke="#fff" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  );
}
