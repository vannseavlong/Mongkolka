"use client";

import { useEffect, useRef } from "react";
import type { CoupleInfo, GalleryContent, Theme } from "../../types";
import { useLanguage } from "../../i18n";
import { GraceLightbox } from "../grace/gallery-lightbox";
import { useSkinOrnaments } from "../khmer/skin-context";
import { fillTemplate, gridClasses, tileClass } from "./gallery-layout";
import { mediaFor } from "./gallery-media";
import { MediaSection } from "./gallery-section";
import { useGallery } from "./gallery-state";

export interface SkinGalleryProps {
  couple?: CoupleInfo;
  theme: Theme;
  content?: GalleryContent;
}

/** One photo tile: the skin's frame around the image, wrapped in a real button that opens the viewer. */
function Tile({ theme, src, index, total, onOpen, onFail, setRef }: {
  theme: Theme;
  src: string;
  index: number;
  total: number;
  onOpen: () => void;
  onFail: () => void;
  setRef: (el: HTMLButtonElement | null) => void;
}) {
  const { t } = useLanguage();
  const sk = useSkinOrnaments();
  const media = mediaFor(sk);
  const imgRef = useRef<HTMLImageElement>(null);
  // The error event can fire before hydration attaches onError; re-check on mount.
  useEffect(() => {
    const el = imgRef.current;
    if (el && el.complete && el.naturalWidth === 0) onFail();
  }, [onFail]);
  const tilt = media.tilt?.(index) ?? 0;
  return (
    <button
      ref={setRef}
      type="button"
      onClick={onOpen}
      aria-label={fillTemplate(t("grace.gallery.openPhoto"), { n: index + 1, total })}
      aria-haspopup="dialog"
      className="sk-tile block w-full cursor-zoom-in bg-transparent p-0"
      style={{ transform: tilt ? `rotate(${tilt}deg)` : undefined }}
    >
      <media.Frame theme={theme} index={index} variant="gallery" aspect={media.aspect}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={imgRef}
          src={src}
          alt={fillTemplate(t("grace.gallery.photoAlt"), { n: index + 1, total })}
          loading="lazy"
          decoding="async"
          onError={onFail}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </media.Frame>
    </button>
  );
}

/**
 * The skin-aware gallery (`gallery_skin`): every skin frames the same photo grid its own way
 * (plates, arches, ovals, blossom frames, polaroids, stickers) and opens the same keyboard-safe viewer.
 * Empty (or all photos broken) renders nothing, like every other gallery.
 */
export function SkinGallery({ theme, content }: SkinGalleryProps) {
  const { t } = useLanguage();
  const g = useGallery(content?.photos);
  if (g.total === 0 && !g.isOpen) return null;
  const { cols, width } = gridClasses(g.total);
  const alt = (n: number, count: number = g.total) => fillTemplate(t("grace.gallery.photoAlt"), { n, total: count });

  return (
    <MediaSection theme={theme} id="gallery" heading={t("section.gallery.heading")}>
      <div className={`mx-auto grid items-start gap-x-5 gap-y-8 pb-6 ${cols} ${width}`}>
        {g.photos.map((src, i) => (
          <div key={src} className={tileClass(i, g.total)}>
            <Tile theme={theme} src={src} index={i} total={g.total} onOpen={() => g.open(src)} onFail={() => g.fail(src)} setRef={g.registerTile(src)} />
          </div>
        ))}
      </div>
      {g.viewerIndex >= 0 && (
        <GraceLightbox
          theme={theme}
          photos={g.viewerPhotos}
          index={g.viewerIndex}
          onIndex={g.setViewerIndex}
          onClose={g.close}
          onBroken={g.fail}
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
    </MediaSection>
  );
}
