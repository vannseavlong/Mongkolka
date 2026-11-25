"use client";

import { useState } from "react";
import type { GalleryContent, Theme } from "../../types";
import { useLanguage } from "../../i18n";
import { withAlpha } from "../../chrome/gold";
import { GraceLightbox } from "../grace/gallery-lightbox";
import { fillTemplate } from "../skinned/gallery-layout";
import { MediaSection } from "../skinned/gallery-section";
import { useGallery } from "../skinned/gallery-state";
import { mediaFor } from "../skinned/gallery-media";
import { useSkinOrnaments } from "../khmer/skin-context";
import { COVENANT_CSS } from "./covenant-styles";
import { galleryButtonStyle, useGalleryLink } from "../../gallery-page";
import { hiddenCount, mosaicCell, mosaicGrid, visibleCount } from "./gallery-logic";

export interface CovenantGalleryProps {
  theme: Theme;
  content?: GalleryContent;
}

/**
 * Covenant gallery ("កម្រងរូបភាព"): a mosaic with a large feature photo, soft gold-ringed tiles, and a
 * "show all" button once there are more than a handful. Same viewer, same broken-photo handling as every gallery.
 */
export function CovenantGallery({ theme, content }: CovenantGalleryProps) {
  const { t } = useLanguage();
  const sk = useSkinOrnaments();
  const media = mediaFor(sk);
  const g = useGallery(content?.photos);
  const [expanded, setExpanded] = useState(false);
  const link = useGalleryLink();
  if (g.total === 0 && !g.isOpen) return null;

  const shown = g.photos.slice(0, visibleCount(g.total, expanded));
  const more = hiddenCount(g.total, expanded);
  const alt = (n: number, count: number = g.total) => fillTemplate(t("grace.gallery.photoAlt"), { n, total: count });
  const ring = withAlpha(theme.accent_color, 0.55);

  return (
    <MediaSection theme={theme} id="gallery" heading={t("covenant.gallery.heading")} intro={t("covenant.gallery.intro")}>
      <style href="mk-covenant-css" precedence="mk-covenant">
        {COVENANT_CSS}
      </style>
      <div className={`${shown.length > 4 ? "cv-mosaic " : ""}mx-auto grid gap-2.5 sm:gap-3 ${mosaicGrid(shown.length)}`}>
        {shown.map((src, i) => (
          <button
            key={src}
            ref={g.registerTile(src)}
            type="button"
            onClick={() => g.open(src)}
            aria-label={fillTemplate(t("grace.gallery.openPhoto"), { n: i + 1, total: g.total })}
            aria-haspopup="dialog"
            className={`cv-tile ${mosaicCell(i, shown.length)}`}
            style={{ boxShadow: `0 0 0 1px ${ring}, 0 14px 26px -16px ${withAlpha(theme.accent_color, 0.6)}` }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt={alt(i + 1)} loading="lazy" decoding="async" onError={() => g.fail(src)} />
          </button>
        ))}
      </div>
      {more > 0 &&
        (link ? (
          // The sub-page shows every photo; same button as every other gallery.
          <a href={link.href} onClick={link.onOpen} className="mt-8" style={galleryButtonStyle(theme, media.button(theme))}>
            {fillTemplate(t("covenant.gallery.showAll"), { n: g.total })}
          </a>
        ) : (
          <button type="button" className="mt-8" style={galleryButtonStyle(theme, media.button(theme))} onClick={() => setExpanded(true)}>
            {fillTemplate(t("covenant.gallery.showAll"), { n: g.total })}
          </button>
        ))}
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
