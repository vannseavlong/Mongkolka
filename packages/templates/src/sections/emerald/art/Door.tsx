import { GoldGradientDef, useSvgId } from "../../khmer/ornaments/Corner";

/** One Art-Deco step of the corner pin-stripe, drawn for the top-left; mirrored into the other three. */
const STEP = "M14 74V40H20V32H28V24H36V18H44V14H74";

export interface DoorProps {
  color: string;
  face: string;
  deep: string;
  /** The seam side carries the pull ring; mirror the right door with CSS. */
}

/**
 * One door leaf, viewBox 200x640: emerald face, double gold pin-stripe, stepped Art-Deco corners,
 * two chamfered panels each holding a kbach lozenge with flame leaves, a kick plate and a pull ring.
 * Original geometry. The seam is on the right edge (x = 200); the right door is mirrored in CSS.
 */
export function Door({ color, face, deep }: DoorProps) {
  const g = useSvgId("ed");
  const gold = `url(#${g})`;
  const panel = (y: number, h: number) => {
    const x = 36;
    const w = 128;
    const c = 16;
    const d = `M${x + c} ${y}H${x + w - c}L${x + w} ${y + c}V${y + h - c}L${x + w - c} ${y + h}H${x + c}L${x} ${y + h - c}V${y + c}Z`;
    const cx = x + w / 2;
    const cy = y + h / 2;
    return (
      <g key={y}>
        <path d={d} fill={deep} fillOpacity="0.75" stroke={gold} strokeWidth="1.6" />
        <path d={d} fill="none" stroke={gold} strokeWidth="0.6" opacity="0.6" transform={`translate(${cx} ${cy}) scale(0.9 0.93) translate(${-cx} ${-cy})`} />
        <path d={`M${cx} ${cy - 46}L${cx + 40} ${cy}L${cx} ${cy + 46}L${cx - 40} ${cy}Z`} fill="none" stroke={gold} strokeWidth="1.3" />
        <path d={`M${cx} ${cy - 30}L${cx + 26} ${cy}L${cx} ${cy + 30}L${cx - 26} ${cy}Z`} fill={gold} fillOpacity="0.18" stroke={gold} strokeWidth="0.7" />
        <path d={`M${cx} ${cy - 16}C${cx - 8} ${cy - 6} ${cx - 8} ${cy + 6} ${cx} ${cy + 16}C${cx + 8} ${cy + 6} ${cx + 8} ${cy - 6} ${cx} ${cy - 16}Z`} fill={gold} />
        <path d={`M${cx - 58} ${cy}C${cx - 52} ${cy - 10} ${cx - 44} ${cy - 10} ${cx - 40} ${cy}C${cx - 44} ${cy + 10} ${cx - 52} ${cy + 10} ${cx - 58} ${cy}Z`} fill="none" stroke={gold} strokeWidth="0.9" />
        <path d={`M${cx + 58} ${cy}C${cx + 52} ${cy - 10} ${cx + 44} ${cy - 10} ${cx + 40} ${cy}C${cx + 44} ${cy + 10} ${cx + 52} ${cy + 10} ${cx + 58} ${cy}Z`} fill="none" stroke={gold} strokeWidth="0.9" />
        <circle cx={cx} cy={y + 12} r="2" fill={gold} />
        <circle cx={cx} cy={y + h - 12} r="2" fill={gold} />
      </g>
    );
  };
  return (
    <svg viewBox="0 0 200 640" width="100%" height="100%" preserveAspectRatio="none" aria-hidden focusable="false" style={{ display: "block" }}>
      <defs>
        <GoldGradientDef id={g} color={color} />
        <linearGradient id={`${g}f`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={deep} />
          <stop offset="0.7" stopColor={face} />
          <stop offset="1" stopColor={face} stopOpacity="0.92" />
        </linearGradient>
      </defs>
      <rect width="200" height="640" fill={`url(#${g}f)`} />
      <rect x="6" y="6" width="188" height="628" fill="none" stroke={gold} strokeWidth="2.6" />
      <rect x="12" y="12" width="176" height="616" fill="none" stroke={gold} strokeWidth="0.8" opacity="0.7" />
      <g fill="none" stroke={gold} strokeWidth="1.5" strokeLinejoin="miter">
        <path d={STEP} />
        <path d={STEP} transform="translate(0 640) scale(1 -1)" />
        <path d={STEP} transform="translate(200 0) scale(-1 1)" />
        <path d={STEP} transform="translate(200 640) scale(-1 -1)" />
      </g>
      {panel(66, 236)}
      {panel(322, 236)}
      <g stroke={gold} fill="none">
        <path d="M24 578H176" strokeWidth="1.4" />
        <path d="M24 586H176" strokeWidth="0.6" opacity="0.7" />
        <path d="M24 604H176" strokeWidth="0.9" />
      </g>
      <rect x="193" y="0" width="7" height="640" fill={gold} opacity="0.85" />
      <g>
        <rect x="160" y="300" width="24" height="40" rx="12" fill={deep} stroke={gold} strokeWidth="1.2" />
        <circle cx="172" cy="320" r="7" fill="none" stroke={gold} strokeWidth="2" />
        <circle cx="172" cy="320" r="2.6" fill={gold} />
      </g>
    </svg>
  );
}
