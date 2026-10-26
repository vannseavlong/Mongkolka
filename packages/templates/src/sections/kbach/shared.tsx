"use client";

import { useId, type CSSProperties, type ReactNode } from "react";
import { mix } from "../ink/shared";

/*
 * Shared ornament for the "Khmer Kbach" pack. All artwork here is drawn from
 * scratch as plain SVG, inspired by the general vocabulary of Khmer ornament
 * (lotus, flame-leaf scrolls, tiered pointed arches) and stroked in currentColor-
 * style props so the couple's accent color recolors every motif.
 */

/** Metallic foil text: a light-to-dark vertical gradient derived from the accent color. */
export function foilGradient(accent: string): string {
  return `linear-gradient(180deg, ${mix("#ffffff", 45)} -20%, ${accent} 42%, color-mix(in srgb, ${accent} 68%, #000) 100%)`;
}

export function foilTextStyle(accent: string): CSSProperties {
  return {
    backgroundImage: foilGradient(accent),
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    WebkitTextFillColor: "transparent",
    color: "transparent",
  };
}

export function FoilText({
  accent,
  children,
  className = "",
}: {
  accent: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span className={className} style={foilTextStyle(accent)}>
      {children}
    </span>
  );
}

const PETAL = "M0 0C-13-10-16-30 0-54C16-30 13-10 0 0Z";

/** A fanned lotus: seven petals, tallest in the middle, on a small crescent base. */
export function Lotus({ color, className = "", style }: { color: string; className?: string; style?: CSSProperties }) {
  const petals = [-72, 72, -48, 48, -24, 24, 0];
  return (
    <svg
      aria-hidden
      viewBox="-64 -62 128 76"
      className={className}
      style={style}
      fill="none"
      stroke={color}
      strokeWidth="1.4"
      strokeLinejoin="round"
    >
      {petals.map((angle) => (
        <path
          key={angle}
          d={PETAL}
          transform={`rotate(${angle})`}
          fill={color}
          fillOpacity={angle === 0 ? 0.28 : 0.12}
        />
      ))}
      <path d="M-36 6Q0 18 36 6" />
      <path d="M-22 11Q0 20 22 11" strokeOpacity="0.6" />
    </svg>
  );
}

/** Repeating border: a flowing vine with diamond buds between two rules. */
export function KbachStrip({
  color,
  className = "",
  flip = false,
}: {
  color: string;
  className?: string;
  flip?: boolean;
}) {
  const id = useId().replace(/:/g, "");
  return (
    <svg aria-hidden className={`block h-5 w-full ${className}`} style={flip ? { transform: "scaleY(-1)" } : undefined}>
      <defs>
        <pattern id={id} width="64" height="20" patternUnits="userSpaceOnUse">
          <path d="M0 10C10 -1 22 -1 32 10S54 21 64 10" fill="none" stroke={color} strokeWidth="1.2" />
          <path d="M32 4.5l4 5.5-4 5.5-4-5.5z" fill={color} />
          <path d="M16 3.2c1.6 1 1.6 2.6 0 3.6-1.6-1-1.6-2.6 0-3.6zM48 13.2c1.6 1 1.6 2.6 0 3.6-1.6-1-1.6-2.6 0-3.6z" fill={color} fillOpacity="0.75" />
        </pattern>
      </defs>
      <rect width="100%" height="1" y="0" fill={color} fillOpacity="0.55" />
      <rect width="100%" height="1" y="19" fill={color} fillOpacity="0.55" />
      <rect width="100%" height="20" fill={`url(#${id})`} />
    </svg>
  );
}

const FLAME = "M0 0C7-14 7-36 0-54C-7-36-7-14 0 0Z";

/** A quarter-fan corner piece, drawn into the top-left; rotate/flip for other corners. */
export function KbachCorner({ color, className = "", style }: { color: string; className?: string; style?: CSSProperties }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 90 90"
      className={className}
      style={style}
      fill="none"
      stroke={color}
      strokeWidth="1.2"
    >
      <path d="M0 78A78 78 0 0 0 78 0" strokeOpacity="0.9" />
      <path d="M0 62A62 62 0 0 0 62 0" strokeOpacity="0.6" />
      {[18, 36, 54, 72].map((angle) => (
        <path
          key={angle}
          d={FLAME}
          transform={`translate(0 0) rotate(${angle + 4}) scale(1.05)`}
          fill={color}
          fillOpacity="0.16"
        />
      ))}
      <circle cx="9" cy="9" r="3" fill={color} />
    </svg>
  );
}

/** Centered divider: lotus flanked by tapering vines. */
export function KbachDivider({ color, className = "" }: { color: string; className?: string }) {
  return (
    <div aria-hidden className={`mx-auto flex w-64 items-center gap-3 ${className}`}>
      <svg viewBox="0 0 100 10" className="h-2.5 flex-1" fill="none" stroke={color} strokeWidth="1">
        <path d="M0 5C20 -2 40 12 60 5S85 2 100 5" />
      </svg>
      <Lotus color={color} className="h-6 w-9 shrink-0" />
      <svg viewBox="0 0 100 10" className="h-2.5 flex-1 -scale-x-100" fill="none" stroke={color} strokeWidth="1">
        <path d="M0 5C20 -2 40 12 60 5S85 2 100 5" />
      </svg>
    </div>
  );
}

/** Pointed (ogee) arch outline paths in a 300x400 box, outer and inner tiers. */
export const ARCH_OUTER = "M6 400V176C6 112 100 96 150 8C200 96 294 112 294 176V400";
export const ARCH_INNER = "M24 400V182C24 126 112 110 150 38C188 110 276 126 276 182V400";
/** Same silhouette as ARCH_OUTER, closed and normalized to 0-1 for objectBoundingBox clipping. */
export const ARCH_CLIP = "M0.02 1V0.44C0.02 0.28 0.33 0.24 0.5 0.02C0.67 0.24 0.98 0.28 0.98 0.44V1Z";

/** A photo (or lotus, if none) inside a pointed arch with a double foil outline. */
export function ArchFrame({
  src,
  alt = "",
  foil,
  className = "",
}: {
  src?: string;
  alt?: string;
  foil: string;
  className?: string;
}) {
  const id = useId().replace(/:/g, "");
  return (
    <div className={`relative aspect-[3/4] ${className}`}>
      <svg width="0" height="0" className="absolute" aria-hidden>
        <defs>
          <clipPath id={id} clipPathUnits="objectBoundingBox">
            <path d={ARCH_CLIP} />
          </clipPath>
        </defs>
      </svg>
      <div className="absolute inset-0" style={{ clipPath: `url(#${id})` }}>
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt={alt} className="size-full object-cover" decoding="async" />
        ) : (
          <div className="flex size-full items-end justify-center pb-10" style={{ backgroundColor: mix(foil, 14) }}>
            <Lotus color={foil} className="w-3/4" />
          </div>
        )}
      </div>
      <svg aria-hidden viewBox="0 0 300 400" className="pointer-events-none absolute inset-0 size-full overflow-visible" fill="none">
        <path d={ARCH_OUTER} stroke={foil} strokeWidth="2" />
        <path d={ARCH_INNER} stroke={foil} strokeWidth="1" strokeOpacity="0.7" />
        <path d="M150 8c-9-9-6-19 0-28 6 9 9 19 0 28z" fill={foil} stroke="none" />
      </svg>
    </div>
  );
}
