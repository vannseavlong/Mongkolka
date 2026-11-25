"use client";

import { useState, type ReactNode } from "react";
import type { GalleryContent, Theme } from "../../types";
import { useLanguage } from "../../i18n";
import { galleryButtonStyle, useGalleryLink } from "../../gallery-page";
import { GraceLightbox } from "../grace/gallery-lightbox";
import { useSkinOrnaments } from "../khmer/skin-context";
import { fillTemplate } from "../skinned/gallery-layout";
import { mediaFor } from "../skinned/gallery-media";
import { MediaSection } from "../skinned/gallery-section";
import { useGallery } from "../skinned/gallery-state";
import { COVENANT_CSS } from "./covenant-styles";
import { homeLimit } from "./gallery-logic";

export interface GalleryApi {
  /** The photos the invitation page shows (already capped by the couple's limit). */
  shown: string[];
  total: number;
  open: (src: string) => void;
  fail: (src: string) => void;
  registerTile: ReturnType<typeof useGallery>["registerTile"];
  alt: (n: number) => string;
  label: (n: number) => string;
}

/**
 * Everything the Covenant gallery layouts share: the section shell, the couple's home-page limit (`maxPhotos`), the
 * "show all" button (the sub-page when the site has one), the viewer, and broken-photo handling. A layout only draws
 * the arrangement of `shown`.
 */
export function CovenantGalleryFrame({ theme, content, defaultLimit, children }: { theme: Theme; content?: GalleryContent; defaultLimit?: number; children: (g: GalleryApi) => ReactNode }) {
  const { t } = useLanguage();
  const sk = useSkinOrnaments();
  const media = mediaFor(sk);
  const g = useGallery(content?.photos);
  const [expanded, setExpanded] = useState(false);
  const link = useGalleryLink();
  if (g.total === 0 && !g.isOpen) return null;

  const limit = homeLimit(content?.maxPhotos, defaultLimit);
  const shown = expanded ? g.photos : g.photos.slice(0, limit);
  const more = g.total - shown.length;
  const alt = (n: number, count: number = g.total) => fillTemplate(t("grace.gallery.photoAlt"), { n, total: count });
  const api: GalleryApi = {
    shown,
    total: g.total,
    open: g.open,
    fail: g.fail,
    registerTile: g.registerTile,
    alt,
    label: (n) => fillTemplate(t("grace.gallery.openPhoto"), { n, total: g.total }),
  };
  const button = galleryButtonStyle(theme, media.button(theme));
  const showAll = fillTemplate(t("covenant.gallery.showAll"), { n: g.total });

  return (
    <MediaSection theme={theme} id="gallery" heading={t("covenant.gallery.heading")} intro={t("covenant.gallery.intro")}>
      <style href="mk-covenant-css" precedence="mk-covenant">
        {COVENANT_CSS}
      </style>
      {children(api)}
      {more > 0 &&
        (link ? (
          // The sub-page shows every photo; same button as every other gallery.
          <a href={link.href} onClick={link.onOpen} className="mt-8" style={button}>
            {showAll}
          </a>
        ) : (
          <button type="button" className="mt-8" style={button} onClick={() => setExpanded(true)}>
            {showAll}
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
