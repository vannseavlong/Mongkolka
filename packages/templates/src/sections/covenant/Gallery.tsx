"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { GalleryContent, Theme } from "../../types";
import { withAlpha } from "../../chrome/gold";
import { useLanguage } from "../../i18n";
import { activeColumn, columnRatios, inColumns, mosaicCell, mosaicGrid } from "./gallery-logic";
import { CovenantGalleryFrame, type GalleryApi } from "./gallery-parts";
import { LazyImage } from "./lazy-image";

export interface CovenantGalleryProps {
  theme: Theme;
  content?: GalleryContent;
}

const ring = (theme: Theme) => `0 0 0 1px ${withAlpha(theme.accent_color, 0.55)}, 0 14px 26px -16px ${withAlpha(theme.accent_color, 0.6)}`;
const vars = (theme: Theme) => ({ "--cv-ink": theme.accent_color, "--cv-line": withAlpha(theme.accent_color, 0.55) }) as React.CSSProperties;

/** One photo as a button that opens the viewer. `children` is the picture (a LazyImage). */
function Tile({ g, src, i, className, style, children }: { g: GalleryApi; src: string; i: number; className: string; style?: React.CSSProperties; children: React.ReactNode }) {
  return (
    <button ref={g.registerTile(src)} type="button" onClick={() => g.open(src)} aria-label={g.label(i + 1)} aria-haspopup="dialog" className={className} style={style}>
      {children}
    </button>
  );
}

/** Mosaic: a large feature photo and soft gold-ringed tiles. */
function Mosaic({ theme, g }: { theme: Theme; g: GalleryApi }) {
  return (
    <div className={`${g.shown.length > 4 ? "cv-mosaic " : ""}mx-auto grid gap-2.5 sm:gap-3 ${mosaicGrid(g.shown.length)}`} style={vars(theme)}>
      {g.shown.map((src, i) => (
        <Tile key={src} g={g} src={src} i={i} className={`cv-tile ${mosaicCell(i, g.shown.length)}`} style={{ boxShadow: ring(theme) }}>
          <LazyImage fill src={src} alt={g.alt(i + 1)} tint={theme.accent_color} eager={i < 3} onFail={() => g.fail(src)} />
        </Tile>
      ))}
    </div>
  );
}

/**
 * Flow: masonry columns (a tall photo over a square one, then the other way round) that slide sideways like a carousel.
 * Swipe, drag the bar, or use the arrows; columns snap into place.
 */
function Flow({ theme, g }: { theme: Theme; g: GalleryApi }) {
  const { t } = useLanguage();
  const scroller = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const cols = inColumns(g.shown, 2);
  const pitch = useCallback(() => {
    const first = scroller.current?.firstElementChild as HTMLElement | null;
    return first ? first.offsetWidth + 12 : 0;
  }, []);
  const onScroll = useCallback(() => {
    const el = scroller.current;
    if (el) setActive(activeColumn(el.scrollLeft, pitch(), cols.length));
  }, [cols.length, pitch]);
  const go = (dir: 1 | -1) => scroller.current?.scrollBy({ left: dir * pitch(), behavior: "smooth" });
  useEffect(() => setActive(0), [g.shown.length]);
  const pct = cols.length > 1 ? Math.round(((active + 1) / cols.length) * 100) : 100;

  return (
    <div className="mx-auto max-w-5xl" style={vars(theme)}>
      <div ref={scroller} className="cv-flow" onScroll={onScroll} role="group" aria-roledescription="carousel" aria-label={t("covenant.gallery.heading")}>
        {cols.map((col, c) => {
          const ratios = columnRatios(c, col.length);
          return (
            <div key={col[0]} className="cv-flow-col">
              {col.map((src, k) => {
                const i = c * 2 + k;
                return (
                  <Tile key={src} g={g} src={src} i={i} className="cv-tile" style={{ boxShadow: ring(theme), aspectRatio: ratios[k] }}>
                    <LazyImage fill src={src} alt={g.alt(i + 1)} tint={theme.accent_color} eager={c < 2} onFail={() => g.fail(src)} />
                  </Tile>
                );
              })}
            </div>
          );
        })}
      </div>
      {cols.length > 1 && (
        <div className="mx-auto mt-2 flex max-w-sm items-center gap-4 px-4">
          <button type="button" className="cv-nav" onClick={() => go(-1)} disabled={active === 0} aria-label={t("grace.gallery.prev")}>
            <ChevronLeft className="size-5" aria-hidden />
          </button>
          <div className="cv-bar flex-1" aria-hidden>
            <i style={{ width: `${pct}%` }} />
          </div>
          <button type="button" className="cv-nav" onClick={() => go(1)} disabled={active >= cols.length - 1} aria-label={t("grace.gallery.next")}>
            <ChevronRight className="size-5" aria-hidden />
          </button>
        </div>
      )}
    </div>
  );
}

/** Spotlight: one large photo with a strip of thumbnails; tap a thumbnail to swap, tap the photo to open it full screen. */
function Spotlight({ theme, g }: { theme: Theme; g: GalleryApi }) {
  const { t } = useLanguage();
  const [cur, setCur] = useState(0);
  const index = Math.min(cur, g.shown.length - 1);
  const src = g.shown[index]!;
  const step = (d: 1 | -1) => setCur((index + d + g.shown.length) % g.shown.length);
  return (
    <div className="mx-auto max-w-md" style={vars(theme)}>
      <div className="relative">
        <Tile key={src} g={g} src={src} i={index} className="cv-tile cv-feature w-full" style={{ boxShadow: ring(theme), aspectRatio: "4 / 5" }}>
          <LazyImage fill src={src} alt={g.alt(index + 1)} tint={theme.accent_color} eager onFail={() => g.fail(src)} />
        </Tile>
        {g.shown.length > 1 && (
          <>
            <button type="button" className="cv-nav absolute left-2 top-1/2 -translate-y-1/2" onClick={() => step(-1)} aria-label={t("grace.gallery.prev")}>
              <ChevronLeft className="size-5" aria-hidden />
            </button>
            <button type="button" className="cv-nav absolute right-2 top-1/2 -translate-y-1/2" onClick={() => step(1)} aria-label={t("grace.gallery.next")}>
              <ChevronRight className="size-5" aria-hidden />
            </button>
          </>
        )}
      </div>
      {g.shown.length > 1 && (
        <div className="mt-4 flex gap-2 overflow-x-auto px-1 pb-3 pt-1" style={{ scrollbarWidth: "none" }}>
          {g.shown.map((s, i) => (
            <button key={s} type="button" className="cv-thumb" aria-current={i === index} aria-label={g.label(i + 1)} onClick={() => setCur(i)}>
              <LazyImage src={s} alt="" tint={theme.accent_color} ratio="1 / 1" eager={i < 6} onFail={() => g.fail(s)} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/** Polaroids: white-bordered prints, each tilted a little, two across. */
function Polaroids({ theme, g }: { theme: Theme; g: GalleryApi }) {
  const tilts = [-2.2, 1.6, -1.2, 2.4, -1.8, 1.1];
  return (
    <ul className="m-0 mx-auto grid max-w-3xl list-none grid-cols-2 gap-x-4 gap-y-7 p-0 sm:grid-cols-3" style={vars(theme)}>
      {g.shown.map((src, i) => (
        <li key={src} className={i % 2 ? "mt-6" : ""}>
          <Tile g={g} src={src} i={i} className="cv-polaroid" style={{ transform: `rotate(${tilts[i % tilts.length]}deg)`, outline: `1px solid ${withAlpha(theme.accent_color, 0.25)}` }}>
            <LazyImage src={src} alt={g.alt(i + 1)} tint={theme.accent_color} ratio="4 / 5" eager={i < 4} onFail={() => g.fail(src)} />
          </Tile>
        </li>
      ))}
    </ul>
  );
}

export const CovenantGallery = ({ theme, content }: CovenantGalleryProps) => (
  <CovenantGalleryFrame theme={theme} content={content}>{(g) => <Mosaic theme={theme} g={g} />}</CovenantGalleryFrame>
);
export const CovenantGalleryFlow = ({ theme, content }: CovenantGalleryProps) => (
  <CovenantGalleryFrame theme={theme} content={content} defaultLimit={8}>{(g) => <Flow theme={theme} g={g} />}</CovenantGalleryFrame>
);
export const CovenantGallerySpotlight = ({ theme, content }: CovenantGalleryProps) => (
  <CovenantGalleryFrame theme={theme} content={content} defaultLimit={8}>{(g) => <Spotlight theme={theme} g={g} />}</CovenantGalleryFrame>
);
export const CovenantGalleryPolaroid = ({ theme, content }: CovenantGalleryProps) => (
  <CovenantGalleryFrame theme={theme} content={content} defaultLimit={6}>{(g) => <Polaroids theme={theme} g={g} />}</CovenantGalleryFrame>
);
