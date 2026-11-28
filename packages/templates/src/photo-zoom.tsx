"use client";

import { useState, type KeyboardEvent, type MouseEvent, type ReactNode } from "react";
import { useLanguage } from "./i18n";
import { GraceLightbox, fillTemplate } from "./sections/grace/gallery-lightbox";
import type { Theme } from "./types";

/** Spread on an <img> to make it open full screen. `PhotoZoom` must be above it. */
export const zoomProps = { "data-zoom": true, tabIndex: 0, role: "button", style: { cursor: "zoom-in" } } as const;

/**
 * Opens any `data-zoom` photo inside it in the full-screen viewer; swiping moves through the photos of the same section
 * (or `data-zoom-group`). A click another handler already cancelled (the builder selecting a section, a carousel card
 * coming forward) opens nothing.
 */
export function PhotoZoom({ theme, children }: { theme: Theme; children: ReactNode }) {
  const { t } = useLanguage();
  const [open, setOpen] = useState<{ photos: string[]; index: number } | null>(null);

  function show(e: MouseEvent | KeyboardEvent) {
    const img = e.target as HTMLElement;
    if (e.defaultPrevented || !(img instanceof HTMLImageElement) || !img.hasAttribute("data-zoom")) return;
    const group = img.closest("[data-zoom-group]") ?? img.closest("section") ?? e.currentTarget;
    const photos = [...new Set(Array.from(group.querySelectorAll("img[data-zoom]"), (el) => el.getAttribute("src") ?? ""))].filter(Boolean);
    const index = photos.indexOf(img.getAttribute("src") ?? "");
    if (index < 0) return;
    e.preventDefault();
    setOpen({ photos, index });
  }

  return (
    <div style={{ display: "contents" }} onClick={show} onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && show(e)}>
      {children}
      {open && (
        <GraceLightbox
          theme={theme}
          photos={open.photos}
          index={open.index}
          onIndex={(index) => setOpen({ ...open, index })}
          onClose={() => setOpen(null)}
          labels={{
            viewer: t("grace.gallery.viewer"),
            close: t("grace.gallery.close"),
            prev: t("grace.gallery.prev"),
            next: t("grace.gallery.next"),
            unavailable: t("grace.gallery.unavailable"),
            alt: (n, total) => fillTemplate(t("grace.gallery.photoAlt"), { n, total }),
          }}
        />
      )}
    </div>
  );
}
