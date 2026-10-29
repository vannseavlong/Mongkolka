"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { GraceSection, GoldDivider, Reveal, gracePalette, nameFont } from "./shared";
import { GraceLightbox, fillTemplate } from "./gallery-lightbox";
import { useLanguage } from "../../i18n";
import type { CoupleInfo, GalleryContent, Theme } from "../../types";

export interface GraceGalleryProps {
  couple?: CoupleInfo;
  theme: Theme;
  content?: GalleryContent;
}

/** Gentle stagger: every second tile drops on phones, the middle column on desktop (full class literals for Tailwind). */
function staggerClass(i: number, total: number): string {
  if (total === 1) return "";
  if (total === 2) return i % 2 === 1 ? "mt-6" : "";
  const phone = i % 2 === 1 ? "mt-6 lg:mt-0" : "";
  const desk = i % 3 === 1 ? "lg:mt-10" : "";
  return `${phone} ${desk}`.trim();
}

const EMPTY: ReadonlySet<string> = new Set();

function Tile({
  theme,
  src,
  alt,
  openLabel,
  setRef,
  onOpen,
  onFail,
}: {
  theme: Theme;
  src: string;
  alt: string;
  openLabel: string;
  setRef: (el: HTMLButtonElement | null) => void;
  onOpen: () => void;
  onFail: () => void;
}) {
  const p = gracePalette(theme);
  const imgRef = useRef<HTMLImageElement>(null);
  // The error event can fire before hydration attaches onError; re-check on mount.
  useEffect(() => {
    const el = imgRef.current;
    if (el && el.complete && el.naturalWidth === 0) onFail();
  }, [onFail]);
  const arch = "rounded-t-[999px]";
  return (
    <button
      ref={setRef}
      type="button"
      onClick={onOpen}
      aria-label={openLabel}
      aria-haspopup="dialog"
      className={`${arch} group block w-full cursor-zoom-in p-[1.5px] outline-offset-4 focus-visible:outline-2`}
      style={{ backgroundColor: p.accent, backgroundImage: p.foilGradient, outlineColor: p.accent }}
    >
      <span className={`${arch} block p-1`} style={{ backgroundColor: p.card }}>
        <span className={`${arch} relative block aspect-[3/4] w-full overflow-hidden`} style={{ backgroundColor: p.blush }}>
          <img
            ref={imgRef}
            src={src}
            alt={alt}
            loading="lazy"
            decoding="async"
            onError={onFail}
            className="absolute inset-0 h-full w-full object-cover motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:scale-105"
          />
        </span>
      </span>
    </button>
  );
}

export function GraceGallery({ theme, content }: GraceGalleryProps) {
  const { t, language } = useLanguage();
  const p = gracePalette(theme);
  const raw = Array.isArray(content?.photos) ? content.photos : [];
  const all = Array.from(new Set(raw.filter((s): s is string => typeof s === "string").map((s) => s.trim()).filter(Boolean)));
  const listKey = all.join("\n");
  // Failed URLs are remembered per photo list: a new list starts fresh.
  const [failedState, setFailedState] = useState<{ key: string; set: ReadonlySet<string> }>({ key: listKey, set: new Set() });
  const failed = failedState.key === listKey ? failedState.set : EMPTY;
  const [openSrc, setOpenSrc] = useState<string | null>(null);
  const tileRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const returnTo = useRef<string | null>(null);

  const photos = all.filter((s) => !failed.has(s));
  const total = photos.length;

  const fail = useCallback(
    (src: string) =>
      setFailedState((prev) => {
        const base = prev.key === listKey ? prev.set : EMPTY;
        return base.has(src) ? prev : { key: listKey, set: new Set(base).add(src) };
      }),
    [listKey],
  );

  const close = useCallback(() => {
    setOpenSrc((cur) => {
      if (cur != null) returnTo.current = cur;
      return null;
    });
  }, []);

  // Return focus to the tile of the photo that was last shown (first tile if that one was hidden).
  const wasOpen = useRef(false);
  useEffect(() => {
    if (openSrc != null) {
      wasOpen.current = true;
      return;
    }
    if (wasOpen.current) {
      wasOpen.current = false;
      const el = (returnTo.current ? tileRefs.current.get(returnTo.current) : undefined) ?? tileRefs.current.values().next().value;
      el?.focus();
    }
  }, [openSrc]);

  // Close the viewer if its photo is gone from the list (content changed).
  useEffect(() => {
    if (openSrc != null && !all.includes(openSrc)) setOpenSrc(null);
  }, [openSrc, listKey]);

  if (total === 0 && openSrc == null) return null;

  const alt = (n: number, count: number = total) => fillTemplate(t("grace.gallery.photoAlt"), { n, total: count });
  const widthClass = total === 1 ? "max-w-[15rem]" : total === 2 ? "max-w-xl" : "max-w-5xl";
  const colsClass = total === 1 ? "grid-cols-1" : total === 2 ? "grid-cols-2" : "grid-cols-2 lg:grid-cols-3";
  // The viewer keeps a photo that failed while it was open, so it never silently swaps pictures.
  const viewerPhotos = all.filter((s) => !failed.has(s) || s === openSrc);
  const viewerIndex = openSrc != null ? viewerPhotos.indexOf(openSrc) : -1;

  return (
    <GraceSection theme={theme} id="gallery" className="text-center">
      <Reveal>
        <h2 className="text-4xl sm:text-5xl" style={{ fontFamily: nameFont(language), lineHeight: 1.25, color: p.accent }}>
          {t("grace.gallery.heading")}
        </h2>
        <GoldDivider theme={theme} className="mt-5" />
      </Reveal>

      <div className={`mx-auto mt-12 grid items-start gap-x-4 gap-y-6 pb-8 sm:gap-x-6 sm:gap-y-8 ${colsClass} ${widthClass}`}>
        {photos.map((src, i) => (
          <Reveal key={src} delay={(i % 3) * 0.08} className={staggerClass(i, total)}>
            <Tile
              theme={theme}
              src={src}
              alt={alt(i + 1)}
              openLabel={fillTemplate(t("grace.gallery.openPhoto"), { n: i + 1, total })}
              setRef={(el) => {
                if (el) tileRefs.current.set(src, el);
                else tileRefs.current.delete(src);
              }}
              onOpen={() => setOpenSrc(src)}
              onFail={() => fail(src)}
            />
          </Reveal>
        ))}
      </div>

      {viewerIndex >= 0 && (
        <GraceLightbox
          theme={theme}
          photos={viewerPhotos}
          index={viewerIndex}
          onIndex={(i) => setOpenSrc(viewerPhotos[i] ?? null)}
          onClose={close}
          onBroken={fail}
          labels={{
            viewer: t("grace.gallery.viewer"),
            close: t("grace.gallery.close"),
            prev: t("grace.gallery.prev"),
            next: t("grace.gallery.next"),
            unavailable: t("grace.gallery.unavailable"),
            alt: (n, count) => alt(n, count),
          }}
        />
      )}
    </GraceSection>
  );
}
