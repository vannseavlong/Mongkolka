"use client";

import type { GuestbookWallProps } from "../ink/Guestbook";
import { useLanguage } from "../../i18n";
import { withAlpha } from "../../chrome/gold";
import { zoomProps } from "../../photo-zoom";
import { useSkinOrnaments } from "../khmer/skin-context";
import { mediaFor } from "../skinned/gallery-media";
import { MediaSection } from "../skinned/gallery-section";
import { mediaTones } from "../skinned/gallery-tones";
import { COVENANT_CSS } from "./covenant-styles";
import { memoriesView } from "./memories-logic";
import { WishCard } from "./wish-card";

export interface CovenantMemoriesProps extends Pick<GuestbookWallProps, "theme">, Partial<Omit<GuestbookWallProps, "theme">> {
  /** Where "see all photos" / the upload page lives (a sub-route). Hidden when missing. */
  photosHref?: string;
  /** Where "read all wishes" lives. Hidden when missing. */
  wishesHref?: string;
}

/**
 * "Memories": the latest few photos and wishes our guests shared, then buttons to the full photo page (which also
 * takes uploads) and the full wish wall. Display only: nothing is submitted here. The photos and wishes arrive through
 * the same guestbook data as every other template, so the couple's approval rules already apply.
 */
export function CovenantMemories({ theme, guestbook, photosHref, wishesHref }: CovenantMemoriesProps) {
  const { t, language } = useLanguage();
  const sk = useSkinOrnaments();
  const media = mediaFor(sk);
  const tone = mediaTones(theme);
  const view = memoriesView(guestbook);
  const btn = { ...media.button(theme), textDecoration: "none" };
  const ghost = { ...media.note(theme), borderRadius: 999, color: tone.accent, textDecoration: "none", boxShadow: "none" };

  return (
    <MediaSection theme={theme} id="guestbook" heading={t("covenant.memories.heading")} intro={t("covenant.memories.intro")}>
      <style href="mk-covenant-css" precedence="mk-covenant">
        {COVENANT_CSS}
      </style>
      {view.photos.length > 0 ? (
        <ul className="m-0 mx-auto grid max-w-3xl list-none grid-cols-2 gap-x-4 gap-y-8 p-0 sm:grid-cols-3">
          {view.photos.map((photo, i) => (
            <li key={photo.photo_id}>
              <media.Frame theme={theme} index={i} variant="gallery" aspect="aspect-[4/5]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img {...zoomProps} src={photo.url} alt={photo.uploader_name ?? ""} loading="lazy" decoding="async" referrerPolicy="no-referrer" className="absolute inset-0 h-full w-full object-cover" />
              </media.Frame>
            </li>
          ))}
        </ul>
      ) : (
        <div className="mx-auto flex max-w-sm flex-col items-center gap-3 p-8" style={media.note(theme)}>
          <sk.Crest color={theme.accent_color} ground={theme.bg_color} label="♥" size={64} />
          <p className="m-0 text-base">{t("covenant.memories.empty")}</p>
        </div>
      )}

      {view.wishes.length > 0 && (
        <div className="mx-auto mt-14 max-w-xl">
          <h3 className="m-0 text-xl" style={sk.heading(theme, language)}>
            {t("covenant.memories.wishesHeading")}
          </h3>
          <div className="mt-8 flex flex-col gap-8">
            {view.wishes.map((wish, i) => (
              <WishCard key={wish.wish_id} theme={theme} wish={wish} index={i} />
            ))}
          </div>
        </div>
      )}

      <div className="mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row">
        {photosHref && view.photoTotal > 0 && (
          <a href={photosHref} className="cv-link" style={btn}>
            {t("covenant.memories.seePhotos")}
          </a>
        )}
        {wishesHref && view.wishTotal > 0 && (
          <a href={wishesHref} className="cv-link" style={view.photoTotal > 0 && photosHref ? ghost : btn}>
            {t("covenant.memories.seeWishes")}
          </a>
        )}
        {photosHref && (
          <a href={photosHref} className="cv-link" style={{ ...ghost, border: `1px dashed ${withAlpha(theme.accent_color, 0.7)}` }}>
            {t("covenant.memories.share")}
          </a>
        )}
      </div>
    </MediaSection>
  );
}
