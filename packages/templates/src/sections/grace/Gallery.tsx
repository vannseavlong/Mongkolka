"use client";

// STUB: replaced by Web-grace-gallery-details
import { GraceSection, Cross, gracePalette } from "./shared";
import { useLanguage } from "../../i18n";
import type { GalleryContent, Theme } from "../../types";

export interface GraceGalleryProps {
  theme: Theme;
  content?: GalleryContent;
}

export function GraceGallery({ theme, content }: GraceGalleryProps) {
  const { t } = useLanguage();
  const p = gracePalette(theme);
  return (
    <GraceSection theme={theme} id="gallery" className="text-center">
      <Cross stroke={p.accent} className="mx-auto h-10 w-auto" />
      <h2 className="mt-4 text-2xl" style={{ color: p.accent }}>{t("grace.gallery.stub")}</h2>
      <p className="mt-3">{content?.photos?.length ?? 0}</p>
    </GraceSection>
  );
}
