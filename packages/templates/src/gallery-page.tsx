"use client";

import { createContext, useContext, type CSSProperties, type ReactNode } from "react";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "./i18n";
import { styleKey } from "./style-key";
import { KHMER_BODY_FONT } from "./chrome/fonts";
import { goldGradient, withAlpha } from "./chrome/gold";
import { GraceLightbox } from "./sections/grace/gallery-lightbox";
import { useSkinOrnaments } from "./sections/khmer/skin-context";
import { mediaFor } from "./sections/skinned/gallery-media";
import { fillTemplate } from "./sections/skinned/gallery-layout";
import { useGallery } from "./sections/skinned/gallery-state";
import { SCRIPT_FONT_STACK } from "./gallery-page-fonts";
import type { CoupleInfo, Theme } from "./types";

/** Where "view all photos" goes, and what to do just before leaving (the site saves its scroll position there). */
export interface GalleryLink {
  href: string;
  onOpen?: () => void;
}

const GalleryLinkContext = createContext<GalleryLink | null>(null);
export const GalleryLinkProvider = ({ link, children }: { link: GalleryLink | null; children: ReactNode }) => (
  <GalleryLinkContext.Provider value={link}>{children}</GalleryLinkContext.Provider>
);
export const useGalleryLink = (): GalleryLink | null => useContext(GalleryLinkContext);

/** Index of the next/previous photo, wrapping around; the same index when there is nothing to move to. */
export function stepPhoto(index: number, count: number, direction: 1 | -1): number {
  if (count <= 0) return 0;
  return (index + direction + count) % count;
}

/** The one pill button every gallery uses for "view all": the skin's own button look, with a fixed shape. */
export function galleryButtonStyle(theme: Theme, base: CSSProperties): CSSProperties {
  return {
    ...base,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    minHeight: 48,
    padding: "0 1.75rem",
    borderRadius: 999,
    border: 0,
    fontWeight: 600,
    textDecoration: "none",
    cursor: "pointer",
  };
}

/** The "View all photos" button shown under a site's gallery. */
export function GalleryMoreLink({ theme }: { theme: Theme }) {
  const { t } = useLanguage();
  const link = useGalleryLink();
  const sk = useSkinOrnaments();
  if (!link) return null;
  return (
    <div className="flex justify-center px-4 pb-14 pt-2" style={{ backgroundColor: theme.bg_color }}>
      <a href={link.href} onClick={link.onOpen} style={galleryButtonStyle(theme, mediaFor(sk).button(theme))}>
        {t("section.gallery.viewAll")}
        <ChevronRight className="size-4" aria-hidden />
      </a>
    </div>
  );
}

const PAGE_CSS = `
@keyframes gp-in{from{opacity:0;transform:translateY(14px) scale(.98)}to{opacity:1;transform:none}}
.gp-tile{opacity:0;animation:gp-in .7s cubic-bezier(.22,1,.36,1) both;animation-delay:calc(var(--i) * 45ms);transition:transform .35s ease,box-shadow .35s ease}
.gp-tile:hover{transform:translateY(-3px)}
.gp-tile img{transition:transform .6s ease}
.gp-tile:hover img{transform:scale(1.04)}
@media (prefers-reduced-motion:reduce){.gp-tile{animation:none;opacity:1}.gp-tile,.gp-tile img{transition:none}}
`;

/** The sub-page with every gallery photo: the site's own background, a masonry of framed tiles and the site's photo viewer. */
export function GalleryAllPage({
  theme,
  couple,
  photos,
  backHref,
  onBack,
}: {
  theme: Theme;
  couple: CoupleInfo;
  photos: string[];
  backHref: string;
  /** Called just before going back to the invitation (the site uses it to restore the reader's place). */
  onBack?: () => void;
}) {
  const { t, language } = useLanguage();
  const sk = useSkinOrnaments();
  const media = mediaFor(sk);
  const g = useGallery(photos);
  const ring = withAlpha(theme.accent_color, 0.5);
  const names = couple.partner2Name ? `${couple.partner1Name} & ${couple.partner2Name}` : couple.partner1Name;
  const alt = (n: number, count: number = g.total) => fillTemplate(t("grace.gallery.photoAlt"), { n, total: count });
  const kh = language === "kh";

  return (
    <main
      data-mk-lang={language}
      className="min-h-screen px-4 pb-24 sm:px-8"
      style={{
        color: theme.text_color,
        fontFamily: media.fontFamily ?? KHMER_BODY_FONT,
        backgroundColor: theme.bg_color,
        backgroundImage: `radial-gradient(120% 50% at 50% 0%, ${withAlpha(theme.accent_color, 0.14)}, transparent 70%), radial-gradient(100% 40% at 50% 100%, ${withAlpha(theme.accent_color, 0.08)}, transparent 70%)`,
      }}
    >
      <style href={styleKey("mk-gallery-page-css", PAGE_CSS)} precedence="mk-gallery-page">
        {PAGE_CSS}
      </style>
      <div className="mx-auto max-w-6xl">
        <div className="sticky top-0 z-10 -mx-4 flex items-center px-4 py-3 backdrop-blur-md sm:-mx-8 sm:px-8" style={{ backgroundColor: withAlpha(theme.bg_color, 0.78) }}>
          <a
            href={backHref}
            onClick={onBack}
            aria-label={t("gallery.page.back")}
            title={t("gallery.page.back")}
            className="inline-flex size-11 items-center justify-center rounded-full border transition-colors hover:opacity-80"
            style={{ borderColor: ring, color: theme.text_color, backgroundColor: withAlpha("#ffffff", 0.55) }}
          >
            <ArrowLeft className="size-5" aria-hidden />
          </a>
        </div>

        <header className="px-2 pb-10 pt-8 text-center">
          <h1 className="m-0 text-4xl font-medium leading-tight sm:text-5xl" style={{ fontFamily: kh ? undefined : SCRIPT_FONT_STACK, color: theme.accent_color }}>
            {t("section.gallery.heading")}
          </h1>
          <div aria-hidden className="mx-auto mt-5 flex w-52 items-center gap-3">
            <i className="h-px flex-1" style={{ backgroundImage: `linear-gradient(90deg, transparent, ${theme.accent_color})` }} />
            <b className="size-2 rotate-45" style={{ backgroundImage: goldGradient(theme.accent_color) }} />
            <i className="h-px flex-1" style={{ backgroundImage: `linear-gradient(270deg, transparent, ${theme.accent_color})` }} />
          </div>
          <p className="m-0 mt-4 text-sm uppercase opacity-70" style={{ letterSpacing: kh ? "0.04em" : "0.24em" }}>
            {names} · {fillTemplate(t("gallery.page.count"), { n: g.total })}
          </p>
        </header>

        {g.total === 0 ? (
          <p className="py-16 text-center opacity-70">{t("gallery.page.empty")}</p>
        ) : (
          <ul className="m-0 list-none columns-2 gap-3 p-0 sm:columns-3 sm:gap-4 lg:columns-4">
            {g.photos.map((src, i) => (
              <li key={src} className="mb-3 break-inside-avoid sm:mb-4">
                <button
                  ref={g.registerTile(src)}
                  type="button"
                  onClick={() => g.open(src)}
                  aria-label={fillTemplate(t("grace.gallery.openPhoto"), { n: i + 1, total: g.total })}
                  aria-haspopup="dialog"
                  className="gp-tile block w-full overflow-hidden rounded-xl p-0 focus-visible:outline-2 focus-visible:outline-offset-2"
                  style={{ ["--i" as string]: Math.min(i, 14), boxShadow: `0 0 0 1px ${ring}, 0 16px 28px -18px ${withAlpha(theme.accent_color, 0.65)}`, outlineColor: theme.accent_color, border: 0, background: "none" }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt={alt(i + 1)} loading="lazy" decoding="async" onError={() => g.fail(src)} className="block w-full" />
                </button>
              </li>
            ))}
          </ul>
        )}
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
    </main>
  );
}
