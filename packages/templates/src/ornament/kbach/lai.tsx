import type { ReactNode } from "react";

/**
 * Carved-foil kbach: solid leaves with cut lines, spiral curls, ringed rosettes and lobed diamonds, mirrored and
 * dense. Original shapes; floral and geometric only. `fill` paints the foil, `cut` is the ground showing through.
 */
export interface LaiPaint {
  fill: string;
  cut: string;
}

/** A saw-edged leaf standing on (0, 0), 42 high. */
export const LEAF =
  "M0 0C-5-1-11-5-11-12L-7-11C-10-15-11-20-10-24L-6-21C-8-26-6-31-4-33L-3-30C-3-35-1-39 0-43C1-39 3-35 3-30L4-33C6-31 8-26 6-21L10-24C11-20 10-15 7-11L11-12C11-5 5-1 0 0Z";
/** A thick spiral curl leaving (0, 0) up and to the right. */
export const CURL =
  "M0 0C13 0 25-8 25-20C25-29 19-34 12-33C5-32 2-26 4-21C6-16 13-15 15-20C16-23 13-26 11-24C12-22 11-20 9-21C7-22 7-27 11-28C16-30 20-26 19-20C18-11 10-7-1-7Z";

export function Leaf({ paint, transform }: { paint: LaiPaint; transform?: string }) {
  return (
    <g transform={transform}>
      <path d={LEAF} fill={paint.fill} />
      <path d="M0-3C-1-12 1-22 0-33M0-10L-6-16M0-10L6-16M0-19L-5-25M0-19L5-25" fill="none" stroke={paint.cut} strokeWidth="1.1" strokeLinecap="round" />
    </g>
  );
}

export function Curl({ paint, transform }: { paint: LaiPaint; transform?: string }) {
  return (
    <g transform={transform}>
      <path d={CURL} fill={paint.fill} />
      <path d="M3-3C12-4 21-10 22-19" fill="none" stroke={paint.cut} strokeWidth="1" strokeLinecap="round" />
    </g>
  );
}

const PETAL = "M0-4C-5-6-7-12-4-15C-2-15-1-17 0-19C1-17 2-15 4-15C7-12 5-6 0-4Z";

/** Eight pointed petals round a ringed centre; radius 19. */
export function Rosette({ paint, transform }: { paint: LaiPaint; transform?: string }) {
  return (
    <g transform={transform}>
      {[0, 45, 90, 135, 180, 225, 270, 315].map((turn) => (
        <g key={turn} transform={`rotate(${turn})`}>
          <path d={PETAL} fill={paint.fill} />
          <path d="M0-7V-13" stroke={paint.cut} strokeWidth="1" strokeLinecap="round" />
        </g>
      ))}
      <circle r="6" fill={paint.fill} />
      <circle r="3.6" fill="none" stroke={paint.cut} strokeWidth="1.2" />
    </g>
  );
}

/** A diamond whose four sides step inward in a lobe, as around the rosettes in woven bands; radius 50. */
export const LOBED_DIAMOND =
  "M0-50C5-42 12-36 21-35C19-26 26-19 35-21C36-12 42-5 50 0C42 5 36 12 35 21C26 19 19 26 21 35C12 36 5 42 0 50C-5 42-12 36-21 35C-19 26-26 19-35 21C-36 12-42 5-50 0C-42-5-36-12-35-21C-26-19-19-26-21-35C-12-36-5-42 0-50Z";

function Medallion({ paint, transform, center }: { paint: LaiPaint; transform?: string; center?: ReactNode }) {
  return (
    <g transform={transform}>
      <path d={LOBED_DIAMOND} fill={paint.fill} />
      <path d={LOBED_DIAMOND} fill={paint.cut} transform="scale(.82)" />
      <path d={LOBED_DIAMOND} fill="none" stroke={paint.fill} strokeWidth="3" transform="scale(.67)" />
      {center ?? <Rosette paint={paint} transform="scale(1.15)" />}
    </g>
  );
}

const MIRROR = [1, -1] as const;

/** Monogram badge: a double ring held in a diamond of leaves, with rosettes. The label sits on the open centre. */
export function LaiBadge({ paint }: { paint: LaiPaint }) {
  return (
    <g>
      {/* Crown and foot clusters give the diamond its points. */}
      {[0, 180].map((turn) => (
        <g key={turn} transform={`rotate(${turn})`}>
          <Leaf paint={paint} transform="translate(0 -47) scale(.82)" />
          {MIRROR.map((s) => (
            <g key={s} transform={`scale(${s} 1)`}>
              <Leaf paint={paint} transform="translate(9 -46) rotate(34) scale(.62)" />
              <Leaf paint={paint} transform="translate(20 -42) rotate(62) scale(.5)" />
              <Curl paint={paint} transform="translate(31 -33) rotate(22) scale(.55)" />
            </g>
          ))}
        </g>
      ))}
      {[90, -90].map((turn) => (
        <g key={turn} transform={`rotate(${turn})`}>
          <Leaf paint={paint} transform="translate(0 -47) scale(.62)" />
          {MIRROR.map((s) => (
            <Leaf key={s} paint={paint} transform={`scale(${s} 1) translate(9 -45) rotate(46) scale(.46)`} />
          ))}
        </g>
      ))}
      <circle r="47" fill={paint.fill} />
      <circle r="44" fill={paint.cut} />
      {Array.from({ length: 36 }, (_, i) => (
        <circle key={i} cy="-40.6" r="1.7" fill={paint.fill} transform={`rotate(${i * 10})`} />
      ))}
      <circle r="36.5" fill="none" stroke={paint.fill} strokeWidth="1.6" />
      <Rosette paint={paint} transform="translate(0 46) scale(.55)" />
      <Rosette paint={paint} transform="translate(0 -46) scale(.42)" />
    </g>
  );
}

/** Heading divider: a lobed medallion with a vine of curls and leaves running out to a hook on each side. */
export function LaiDivider({ paint, center }: { paint: LaiPaint; /** Drawn in the middle in place of the rosette (radius about 28). */ center?: ReactNode }) {
  return (
    <g>
      {MIRROR.map((s) => (
        <g key={s} transform={`scale(${s} 1)`}>
          <Leaf paint={paint} transform="translate(19 0) rotate(90) scale(.8)" />
          <Curl paint={paint} transform="translate(26 -2) scale(.62)" />
          <Curl paint={paint} transform="translate(26 2) scale(.62 -.62)" />
          <Leaf paint={paint} transform="translate(48 0) rotate(90) scale(.66)" />
          <Curl paint={paint} transform="translate(56 -1) scale(.45)" />
          <Curl paint={paint} transform="translate(56 1) scale(.45 -.45)" />
          <Leaf paint={paint} transform="translate(72 0) rotate(90) scale(.5)" />
          <Curl paint={paint} transform="translate(88 1) scale(.34)" />
        </g>
      ))}
      <Medallion paint={paint} transform="scale(.42)" center={center} />
    </g>
  );
}

/** Top-left corner: a rosette with curls and leaves along both edges, ending in a hook. Drawn in a 170 box. */
export function LaiCorner({ paint }: { paint: LaiPaint }) {
  const arm = (
    <g>
      <Leaf paint={paint} transform="translate(34 24) rotate(90) scale(.95)" />
      <Curl paint={paint} transform="translate(44 26) rotate(8) scale(.85)" />
      <Curl paint={paint} transform="translate(58 22) scale(.7 -.7)" />
      <Leaf paint={paint} transform="translate(72 19) rotate(97) scale(.82)" />
      <Curl paint={paint} transform="translate(86 20) rotate(6) scale(.55)" />
      <Leaf paint={paint} transform="translate(104 15) rotate(92) scale(.62)" />
      <Curl paint={paint} transform="translate(122 17) scale(.4)" />
      <path d="M22 5H138C146 5 150 8 150 12C150 16 143 16 143 12C143 10 141 9 137 9H22Z" fill={paint.fill} />
    </g>
  );
  return (
    <g>
      {arm}
      <g transform="matrix(0 1 1 0 0 0)">{arm}</g>
      <Leaf paint={paint} transform="translate(32 32) rotate(135)" />
      <Rosette paint={paint} transform="translate(24 24) scale(1.2)" />
    </g>
  );
}

/** One repeat of the upright band (80 wide, 140 tall): a medallion, then a mirrored vine on one stem to the next. */
export function LaiBandTile({ paint }: { paint: LaiPaint }) {
  return (
    <g>
      <path d="M38.4 0H41.6V140H38.4Z" fill={paint.fill} />
      {MIRROR.map((s) => (
        <g key={s} transform={`translate(40 0) scale(${s} 1)`}>
          <Curl paint={paint} transform="translate(2 68) scale(1.05 .95)" />
          <Leaf paint={paint} transform="translate(18 58) rotate(62) scale(.55)" />
          <Leaf paint={paint} transform="translate(3 86) rotate(70) scale(.9)" />
          <Curl paint={paint} transform="translate(2 94) scale(1.15 -.95)" />
          <Leaf paint={paint} transform="translate(22 106) rotate(108) scale(.55)" />
          <Leaf paint={paint} transform="translate(3 126) rotate(46) scale(.66)" />
          <Curl paint={paint} transform="translate(20 134) rotate(18) scale(.55)" />
        </g>
      ))}
      <Leaf paint={paint} transform="translate(40 88) scale(.78)" />
      <Leaf paint={paint} transform="translate(40 94) rotate(180) scale(.6)" />
      <Rosette paint={paint} transform="translate(40 90) scale(.62)" />
      <Medallion paint={paint} transform="translate(40 24) scale(.62)" />
    </g>
  );
}
