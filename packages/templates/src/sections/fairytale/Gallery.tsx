"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useLanguage } from "../../i18n";
import type { CoupleInfo, GalleryContent, Theme } from "../../types";
import { KHMER_BODY_FONT } from "../../chrome/fonts";
import { withAlpha } from "../../chrome/gold";
import { GraceLightbox, fillTemplate } from "../grace/gallery-lightbox";
import { Daisy, HydrangeaSticker, Rose } from "./art";
import { Backdrop } from "./Backdrop";
import { FairytaleStyles } from "./FairytaleStyles";
import { cleanPhotos, gridClasses, staggerClass } from "./gallery-logic";
import { fairytalePalette, polaroidTilt, stickerFor, type StickerCorner, type StickerKind } from "./fairytale-logic";
import { FAIRYTALE_ORNAMENTS, VineDivider } from "./ornaments";

export interface FairytaleGalleryProps {
  couple?: CoupleInfo;
  theme: Theme;
  content?: GalleryContent;
}

const CORNER_POS: Record<StickerCorner, string> = {
  tl: "-left-3 -top-4",
  tr: "-right-3 -top-4",
  bl: "-bottom-3 -left-3",
  br: "-bottom-3 -right-3",
};

function Sticker({ kind, blooms }: { kind: StickerKind; blooms: string[] }) {
  if (kind === "rose") return <Rose size={46} />;
  if (kind === "daisy") return <Daisy size={42} />;
  return <HydrangeaSticker size={50} blooms={blooms} />;
}

const EMPTY: ReadonlySet<string> = new Set();

/** Photos as polaroids: slightly tilted white cards on the sky scene, each with a flower sticker; tap to enlarge. */
export function FairytaleGallery({ theme, content }: FairytaleGalleryProps) {
  const { t, language } = useLanguage();
  const p = fairytalePalette(theme);
  const all = cleanPhotos(content?.photos);
  const listKey = all.join("\n");
  const [failedState, setFailedState] = useState<{ key: string; set: ReadonlySet<string> }>({ key: listKey, set: EMPTY });
  const failed = failedState.key === listKey ? failedState.set : EMPTY;
  const [openSrc, setOpenSrc] = useState<string | null>(null);
  const tileRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const returnTo = useRef<string | null>(null);
  const wasOpen = useRef(false);

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

  useEffect(() => {
    if (openSrc != null) {
      wasOpen.current = true;
      return;
    }
    if (wasOpen.current) {
      wasOpen.current = false;
      (returnTo.current ? tileRefs.current.get(returnTo.current) : undefined)?.focus();
    }
  }, [openSrc]);

  useEffect(() => {
    if (openSrc != null && !all.includes(openSrc)) setOpenSrc(null);
  }, [openSrc, listKey, all]);

  if (total === 0 && openSrc == null) return null;

  const alt = (n: number, count: number = total) => fillTemplate(t("grace.gallery.photoAlt"), { n, total: count });
  const { cols, width } = gridClasses(total);
  const viewerPhotos = all.filter((s) => !failed.has(s) || s === openSrc);
  const viewerIndex = openSrc != null ? viewerPhotos.indexOf(openSrc) : -1;
  const sk = FAIRYTALE_ORNAMENTS;

  return (
    <section id="gallery" data-mk-lang={language} className="relative overflow-hidden px-4 py-16 text-center sm:px-6" style={{ color: p.ink, fontFamily: KHMER_BODY_FONT, backgroundColor: p.sky }}>
      <FairytaleStyles />
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <Backdrop color={p.royal} ground={p.sky} />
      </div>
      <div className="relative">
        <h2 className="m-0 text-xl sm:text-2xl" style={sk.heading(theme, language)}>
          {t("section.gallery.heading")}
        </h2>
        <div className="mb-10 mt-3">
          <VineDivider color={p.royal} />
        </div>

        <div className={`mx-auto grid items-start gap-x-5 gap-y-9 pb-8 ${cols} ${width}`}>
          {photos.map((src, i) => {
            const { kind, corner } = stickerFor(i);
            return (
              <div key={src} className={staggerClass(i, total)} style={{ transform: `rotate(${polaroidTilt(i)}deg)` }}>
                <button
                  ref={(el) => {
                    if (el) tileRefs.current.set(src, el);
                    else tileRefs.current.delete(src);
                  }}
                  type="button"
                  onClick={() => setOpenSrc(src)}
                  aria-label={fillTemplate(t("grace.gallery.openPhoto"), { n: i + 1, total })}
                  aria-haspopup="dialog"
                  className="group relative block w-full cursor-zoom-in bg-white px-2 pb-9 pt-2 outline-offset-4 focus-visible:outline-2 motion-safe:transition-transform motion-safe:duration-300 motion-safe:hover:-translate-y-1 motion-safe:hover:rotate-0"
                  style={{ outlineColor: p.royal, boxShadow: `0 14px 26px -12px ${withAlpha(p.royal, 0.6)}, 0 0 0 1px ${withAlpha(p.royal, 0.12)}` }}
                >
                  <span className="relative block aspect-[4/5] w-full overflow-hidden" style={{ backgroundColor: p.skyLight }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={src}
                      alt={alt(i + 1)}
                      loading="lazy"
                      decoding="async"
                      onError={() => fail(src)}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  </span>
                  <span aria-hidden className="absolute inset-x-0 bottom-2 block text-center text-[0.7rem] tracking-[0.3em]" style={{ color: p.royal, opacity: 0.6 }}>
                    ♡ ♡ ♡
                  </span>
                  <span aria-hidden className={`pointer-events-none absolute ${CORNER_POS[corner]}`} style={{ transform: `rotate(${(i % 3) * 12 - 10}deg)`, filter: "drop-shadow(0 3px 3px rgba(23,45,100,.25))" }}>
                    <Sticker kind={kind} blooms={p.blooms} />
                  </span>
                </button>
              </div>
            );
          })}
        </div>
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
    </section>
  );
}
