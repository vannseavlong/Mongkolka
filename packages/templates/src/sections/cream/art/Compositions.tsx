import { useId } from "react";
import type { CSSProperties } from "react";
import type { Theme } from "../../../types";
import { creamPalette, type CreamPalette } from "../palette";
import { wreathPlacements } from "../wreath";
import { Bud, FlowerDefs, Leaf, Peony, Rose, Sparkle, Sprig, flowerIds } from "./Flowers";

const useSvgId = (prefix: string) => `${prefix}${useId().replace(/[^a-zA-Z0-9]/g, "")}`;

/** Layout-only wrapper style for a decorative, non-interactive, unselectable layer. */
export const DECOR: CSSProperties = { pointerEvents: "none", userSelect: "none" };

/**
 * The gold-and-blush flower bed that runs along the bottom of the cover card: leaves behind, big
 * peonies and roses in front, buds and gold dust between. 390x170 viewBox, anchored to the bottom.
 */
export function FloralBorder({ theme, style }: { theme: Theme; style?: CSSProperties }) {
  const p = creamPalette(theme);
  const id = useSvgId("fb");
  const f = flowerIds(id);
  return (
    <svg viewBox="0 0 390 170" preserveAspectRatio="xMidYMax meet" aria-hidden focusable="false" style={{ display: "block", width: "100%", height: "auto", ...DECOR, ...style }}>
      <FlowerDefs id={id} p={p} />
      <path d="M0 158C70 146 130 152 195 148C260 144 320 152 390 156" fill="none" stroke={`url(#${f.gold})`} strokeWidth="1" opacity="0.7" />
      <g filter={`url(#${f.wash})`}>
        {/* leaves, back row */}
        {[
          [10, 150, -50, 1], [44, 156, -20, 1.1], [92, 150, -140, 1], [128, 156, -160, 1.1], [168, 150, -40, 1],
          [222, 150, -140, 1], [262, 156, -20, 1.1], [300, 150, -40, 1], [346, 156, -160, 1.1], [380, 150, -130, 1],
          [60, 130, -75, 0.9], [140, 124, -105, 1], [250, 124, -75, 1], [330, 130, -105, 0.9],
        ].map(([x, y, r, s], i) => (
          <Leaf key={i} id={id} p={p} x={x!} y={y!} r={r!} s={s!} />
        ))}
        <Sprig id={id} p={p} d="M0 160C40 120 70 110 110 112" leaves={[{ x: 30, y: 135, r: -60 }, { x: 60, y: 120, r: -30 }, { x: 86, y: 114, r: -80 }]} />
        <Sprig id={id} p={p} d="M390 160C350 120 320 110 280 112" leaves={[{ x: 360, y: 135, r: -120 }, { x: 330, y: 120, r: -150 }, { x: 304, y: 114, r: -100 }]} />
        {/* back-row flowers */}
        <Bud id={id} p={p} x={104} y={118} r={-25} s={0.9} />
        <Bud id={id} p={p} x={286} y={118} r={25} s={0.9} />
        <Rose id={id} p={p} x={26} y={136} s={0.8} />
        <Rose id={id} p={p} x={364} y={136} s={0.8} />
        {/* front peonies and roses */}
        <Peony id={id} p={p} x={72} y={128} r={-12} s={0.95} />
        <Peony id={id} p={p} x={318} y={128} r={14} s={0.95} />
        <Rose id={id} p={p} x={132} y={142} r={20} s={0.95} />
        <Rose id={id} p={p} x={258} y={142} r={-20} s={0.95} />
        <Peony id={id} p={p} x={195} y={128} r={4} s={1.3} />
        <Bud id={id} p={p} x={164} y={146} r={-40} s={0.7} />
        <Bud id={id} p={p} x={226} y={146} r={40} s={0.7} />
      </g>
      {[[40, 100, 0.9], [118, 88, 0.6], [196, 70, 0.8], [272, 90, 0.6], [350, 102, 0.9], [160, 110, 0.5], [234, 108, 0.5]].map(([x, y, s], i) => (
        <Sparkle key={i} x={x!} y={y!} s={s!} color={p.goldHi} />
      ))}
    </svg>
  );
}

/**
 * A branch of blossom that hangs from a top corner (top-left; mirror it with scaleX(-1) for the
 * right). 170x190 viewBox.
 */
export function HangingFlorals({ theme, style }: { theme: Theme; style?: CSSProperties }) {
  const p = creamPalette(theme);
  const id = useSvgId("hf");
  const f = flowerIds(id);
  return (
    <svg viewBox="0 0 170 190" aria-hidden focusable="false" style={{ display: "block", width: "100%", height: "auto", ...DECOR, ...style }}>
      <FlowerDefs id={id} p={p} />
      <g filter={`url(#${f.wash})`}>
        <Sprig
          id={id}
          p={p}
          d="M-4 18C40 22 80 40 118 78"
          leaves={[
            { x: 26, y: 22, r: 40, s: 0.9 }, { x: 40, y: 27, r: -20, s: 0.8 }, { x: 62, y: 36, r: 50, s: 0.9 },
            { x: 78, y: 46, r: -10, s: 0.8 }, { x: 98, y: 62, r: 60, s: 0.8 }, { x: 112, y: 74, r: 0, s: 0.7 },
          ]}
        />
        <Sprig id={id} p={p} d="M20 22C18 52 24 84 40 116" leaves={[{ x: 19, y: 50, r: 130, s: 0.8 }, { x: 22, y: 76, r: 40, s: 0.8 }, { x: 30, y: 100, r: 120, s: 0.7 }]} />
        <Peony id={id} p={p} x={46} y={36} r={-20} s={0.95} />
        <Rose id={id} p={p} x={96} y={66} r={10} s={0.85} />
        <Rose id={id} p={p} x={26} y={92} r={-10} s={0.6} />
        <Bud id={id} p={p} x={134} y={96} r={150} s={0.8} />
        <Bud id={id} p={p} x={44} y={124} r={170} s={0.8} />
        <Peony id={id} p={p} x={8} y={14} r={0} s={0.55} />
      </g>
      <Sparkle x={70} y={92} s={0.8} color={p.goldHi} />
      <Sparkle x={126} y={44} s={0.6} color={p.goldHi} />
      <Sparkle x={14} y={140} s={0.6} color={p.goldHi} />
    </svg>
  );
}

export const WREATH_BOX = { w: 360, h: 440, cx: 180, cy: 220, rx: 126, ry: 170 } as const;
export const PHOTO_OVAL = { rx: 106, ry: 150 } as const;

/**
 * The floral oval arch around the hero photo: a heavy garland of peonies, roses, buds and leaves on an
 * ellipse (fuller at the bottom, lighter at the crown), two gold rings round the photo window, and a
 * small lotus finial on top. The photo itself is HTML placed over the window by Hero.tsx.
 */
export function OvalWreath({ theme, style }: { theme: Theme; style?: CSSProperties }) {
  const p: CreamPalette = creamPalette(theme);
  const id = useSvgId("ow");
  const f = flowerIds(id);
  const { w, h, cx, cy, rx, ry } = WREATH_BOX;
  const items = wreathPlacements(cx, cy, rx, ry, 18, 11);
  return (
    <svg viewBox={`0 0 ${w} ${h}`} aria-hidden focusable="false" style={{ display: "block", width: "100%", height: "100%", overflow: "visible", ...DECOR, ...style }}>
      <FlowerDefs id={id} p={p} />
      <ellipse cx={cx} cy={cy} rx={PHOTO_OVAL.rx + 9} ry={PHOTO_OVAL.ry + 9} fill="none" stroke={`url(#${f.gold})`} strokeWidth="2.2" />
      <ellipse cx={cx} cy={cy} rx={PHOTO_OVAL.rx + 16} ry={PHOTO_OVAL.ry + 16} fill="none" stroke={`url(#${f.gold})`} strokeWidth="0.8" opacity="0.6" />
      <g filter={`url(#${f.wash})`}>
        {items
          .filter((i) => i.kind === "leaf")
          .map((i, n) => (
            <Leaf key={`l${n}`} id={id} p={p} x={i.x} y={i.y} r={i.rot} s={i.scale} />
          ))}
        {items
          .filter((i) => i.kind !== "leaf")
          .map((i, n) =>
            i.kind === "peony" ? (
              <Peony key={`f${n}`} id={id} p={p} x={i.x} y={i.y} r={i.rot} s={i.scale} />
            ) : i.kind === "rose" ? (
              <Rose key={`f${n}`} id={id} p={p} x={i.x} y={i.y} r={i.rot} s={i.scale} />
            ) : (
              <Bud key={`f${n}`} id={id} p={p} x={i.x} y={i.y} r={i.rot} s={i.scale} />
            ),
          )}
      </g>
      {/* Lotus finial crowning the arch */}
      <g transform={`translate(${cx} ${cy - ry - 22})`} fill={`url(#${f.gold})`}>
        <path d="M0 -14C-5 -8 -5 -2 0 3C5 -2 5 -8 0 -14Z" />
        <path d="M0 3C-9 2 -14 -3 -14 -8C-7 -7 -2 -3 0 3Z" opacity="0.9" />
        <path d="M0 3C9 2 14 -3 14 -8C7 -7 2 -3 0 3Z" opacity="0.9" />
      </g>
      {[[60, 80, 0.9], [300, 90, 0.8], [40, 300, 0.7], [320, 310, 0.8], [180, 20, 0.7], [90, 410, 0.6], [270, 412, 0.6]].map(([x, y, s], i) => (
        <Sparkle key={i} x={x!} y={y!} s={s!} color={p.goldHi} />
      ))}
    </svg>
  );
}

/**
 * Soft watercolour wash plus a small floral cluster in two corners, placed behind a shared section.
 * Registered as the skin's `Backdrop`; cards sit on top, so the blooms frame the card on every side.
 */
export function SectionBackdrop({ theme }: { theme: Theme }) {
  const p = creamPalette(theme);
  const id = useSvgId("sb");
  const f = flowerIds(id);
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden" style={DECOR}>
      <div
        className="absolute inset-0"
        style={{
          // Fade the washes out at the top and bottom edge so neighbouring sections join without a seam.
          WebkitMaskImage: "linear-gradient(to bottom, transparent, #000 16%, #000 84%, transparent)",
          maskImage: "linear-gradient(to bottom, transparent, #000 16%, #000 84%, transparent)",
          backgroundImage:
            `radial-gradient(60% 38% at 100% 4%, ${p.blush}66, transparent 70%),` +
            `radial-gradient(55% 34% at 0% 98%, ${p.champagne}99, transparent 70%),` +
            `radial-gradient(40% 30% at 0% 40%, ${p.sage}2e, transparent 70%)`,
        }}
      />
      <svg viewBox="0 0 170 190" className="absolute -top-2 -left-3 w-[34vw] max-w-[190px]" style={{ ...DECOR, opacity: 0.95 }}>
        <FlowerDefs id={id} p={p} />
        <g filter={`url(#${f.wash})`}>
          <Sprig id={id} p={p} d="M-4 18C40 22 80 40 118 78" leaves={[{ x: 26, y: 22, r: 40 }, { x: 54, y: 32, r: 50 }, { x: 84, y: 50, r: 55 }, { x: 108, y: 70, r: 20 }]} />
          <Peony id={id} p={p} x={44} y={34} r={-20} s={0.9} />
          <Rose id={id} p={p} x={94} y={64} r={10} s={0.75} />
          <Bud id={id} p={p} x={130} y={94} r={150} s={0.7} />
        </g>
      </svg>
      <svg viewBox="0 0 170 190" className="absolute -right-3 -bottom-2 w-[34vw] max-w-[190px]" style={{ ...DECOR, transform: "scale(-1,-1)", opacity: 0.95 }}>
        <FlowerDefs id={`${id}b`} p={p} />
        <g filter={`url(#${flowerIds(`${id}b`).wash})`}>
          <Sprig id={`${id}b`} p={p} d="M-4 18C40 22 80 40 118 78" leaves={[{ x: 26, y: 22, r: 40 }, { x: 54, y: 32, r: 50 }, { x: 84, y: 50, r: 55 }, { x: 108, y: 70, r: 20 }]} />
          <Peony id={`${id}b`} p={p} x={44} y={34} r={-20} s={0.9} />
          <Rose id={`${id}b`} p={p} x={94} y={64} r={10} s={0.75} />
        </g>
      </svg>
    </div>
  );
}
