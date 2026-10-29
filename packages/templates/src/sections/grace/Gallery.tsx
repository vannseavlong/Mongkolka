"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { GraceSection, GoldDivider, FoilText, Reveal, gracePalette, nameFont } from "./shared";
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
  const [failed, setFailed] = useState<ReadonlySet<string>>(() => new Set());
  const [open, setOpen] = useState<number | null>(null);
  const tileRefs = useRef<Map<number, HTMLButtonElement>>(new Map());
  const returnTo = useRef<number>(0);

  const photos = Array.from(new Set((content?.photos ?? []).filter((s) => typeof s === "string" && s.trim() !== ""))).filter(
    (s) => !failed.has(s),
  );
  const total = photos.length;

  const fail = useCallback((src: string) => setFailed((prev) => (prev.has(src) ? prev : new Set(prev).add(src))), []);

  const close = useCallback(() => {
    setOpen((cur) => {
      if (cur != null) returnTo.current = cur;
      return null;
    });
  }, []);

  // Return focus to the tile of the photo that was last shown.
  const wasOpen = useRef(false);
  useEffect(() => {
    if (open != null) {
      wasOpen.current = true;
      return;
    }
    if (wasOpen.current) {
      wasOpen.current = false;
      const el = tileRefs.current.get(returnTo.current) ?? tileRefs.current.get(0);
      el?.focus();
    }
  }, [open]);

  if (total === 0) return null;

  const alt = (n: number) => fillTemplate(t("grace.gallery.photoAlt"), { n, total });
  const widthClass = total === 1 ? "max-w-[15rem]" : total === 2 ? "max-w-xl" : "max-w-5xl";
  const colsClass = total === 1 ? "grid-cols-1" : total === 2 ? "grid-cols-2" : "grid-cols-2 lg:grid-cols-3";
  const current = open != null ? Math.min(open, total - 1) : null;

  return (
    <GraceSection theme={theme} id="gallery" className="text-center">
      <Reveal>
        <h2 className="text-4xl sm:text-5xl" style={{ fontFamily: nameFont(language), lineHeight: 1.25 }}>
          <FoilText theme={theme}>{t("grace.gallery.heading")}</FoilText>
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
                if (el) tileRefs.current.set(i, el);
                else tileRefs.current.delete(i);
              }}
              onOpen={() => setOpen(i)}
              onFail={() => fail(src)}
            />
          </Reveal>
        ))}
      </div>

      {current != null && (
        <GraceLightbox
          theme={theme}
          photos={photos}
          index={current}
          onIndex={setOpen}
          onClose={close}
          labels={{
            viewer: t("grace.gallery.viewer"),
            close: t("grace.gallery.close"),
            prev: t("grace.gallery.prev"),
            next: t("grace.gallery.next"),
            alt,
          }}
        />
      )}
    </GraceSection>
  );
}
