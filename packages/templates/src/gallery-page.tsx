"use client";

import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useLanguage } from "./i18n";
import { SCRIPT_FONT_STACK } from "./gallery-page-fonts";
import type { CoupleInfo, Theme } from "./types";

/** Index of the next/previous photo, wrapping around; the same index when there is nothing to move to. */
export function stepPhoto(index: number, count: number, direction: 1 | -1): number {
  if (count <= 0) return 0;
  return (index + direction + count) % count;
}

/** The "View all photos" button shown under a site's gallery. */
export function GalleryMoreLink({ href, theme }: { href: string; theme: Theme }) {
  const { t } = useLanguage();
  return (
    <div className="flex justify-center px-4 pb-14 pt-2" style={{ backgroundColor: theme.bg_color }}>
      <a
        href={href}
        className="inline-flex items-center gap-2 rounded-full border px-6 py-3 text-sm font-medium transition-colors hover:opacity-80"
        style={{ borderColor: theme.accent_color, color: theme.text_color }}
      >
        {t("section.gallery.viewAll")}
        <ChevronRight className="size-4" aria-hidden style={{ color: theme.accent_color }} />
      </a>
    </div>
  );
}

/** The sub-page with every gallery photo: a grid you can open one by one, with the couple's own title. */
export function GalleryAllPage({ theme, couple, photos, backHref }: { theme: Theme; couple: CoupleInfo; photos: string[]; backHref: string }) {
  const { t } = useLanguage();
  const [open, setOpen] = useState<number | null>(null);
  const step = useCallback((dir: 1 | -1) => setOpen((i) => (i === null ? i : stepPhoto(i, photos.length, dir))), [photos.length]);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      else if (e.key === "ArrowRight") step(1);
      else if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, step]);

  return (
    <main className="min-h-screen px-4 pb-20 pt-6 sm:px-8" style={{ backgroundColor: theme.bg_color, color: theme.text_color }}>
      <div className="mx-auto max-w-6xl">
        <a href={backHref} className="inline-flex items-center gap-2 text-sm opacity-80 transition-opacity hover:opacity-100">
          <ArrowLeft className="size-4" aria-hidden /> {t("gallery.page.back")}
        </a>
        <header className="my-8 text-center">
          <h1 className="m-0 text-3xl font-medium tracking-wide sm:text-4xl" style={{ fontFamily: SCRIPT_FONT_STACK, color: theme.accent_color }}>
            {t("section.gallery.heading")}
          </h1>
          <p className="m-0 mt-2 text-sm opacity-70">{couple.partner2Name ? `${couple.partner1Name} & ${couple.partner2Name}` : couple.partner1Name}</p>
        </header>

        {photos.length === 0 ? (
          <p className="text-center opacity-70">{t("gallery.page.empty")}</p>
        ) : (
          <ul className="m-0 list-none columns-2 gap-3 p-0 sm:columns-3 lg:columns-4">
            {photos.map((url, i) => (
              <li key={`${url}-${i}`} className="mb-3 break-inside-avoid">
                <button type="button" onClick={() => setOpen(i)} className="block w-full overflow-hidden rounded-md focus-visible:outline-2 focus-visible:outline-offset-2" style={{ outlineColor: theme.accent_color }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt="" loading="lazy" className="block w-full transition-transform duration-500 hover:scale-[1.03]" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {open !== null && photos[open] && (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-[70] flex items-center justify-center bg-black/90 p-4" onClick={() => setOpen(null)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photos[open]} alt="" className="max-h-full max-w-full object-contain" onClick={(e) => e.stopPropagation()} />
          <button type="button" aria-label={t("gallery.page.close")} onClick={() => setOpen(null)} className="absolute right-4 top-4 rounded-full bg-white/15 p-2 text-white hover:bg-white/25">
            <X className="size-5" />
          </button>
          {photos.length > 1 && (
            <>
              <button
                type="button"
                aria-label={t("gallery.page.prev")}
                onClick={(e) => {
                  e.stopPropagation();
                  step(-1);
                }}
                className="absolute left-3 rounded-full bg-white/15 p-2 text-white hover:bg-white/25"
              >
                <ChevronLeft className="size-6" />
              </button>
              <button
                type="button"
                aria-label={t("gallery.page.next")}
                onClick={(e) => {
                  e.stopPropagation();
                  step(1);
                }}
                className="absolute right-3 rounded-full bg-white/15 p-2 text-white hover:bg-white/25"
              >
                <ChevronRight className="size-6" />
              </button>
            </>
          )}
        </div>
      )}
    </main>
  );
}
