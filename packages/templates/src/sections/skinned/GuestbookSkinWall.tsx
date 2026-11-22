"use client";

import { useState } from "react";
import type { GuestbookData, Theme } from "../../types";
import { useLanguage } from "../../i18n";
import { useSkinOrnaments } from "../khmer/skin-context";
import { mediaFor } from "./gallery-media";
import { mediaTones } from "./gallery-tones";
import { aspectFor, buildWall, type WallItem } from "./guestbook-wall-logic";

/** A guest photo in the skin's frame; if the image fails, the frame stays with a soft blank (no broken icon). */
function WallPhoto({ theme, src, alt, index, aspect }: { theme: Theme; src: string; alt: string; index: number; aspect: string }) {
  const sk = useSkinOrnaments();
  const media = mediaFor(sk);
  const [failed, setFailed] = useState(false);
  return (
    <media.Frame theme={theme} index={index} variant="wall" aspect={aspect}>
      {failed ? null : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          onError={() => setFailed(true)}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
    </media.Frame>
  );
}

function Card({ theme, item, index }: { theme: Theme; item: WallItem; index: number }) {
  const { t } = useLanguage();
  const sk = useSkinOrnaments();
  const media = mediaFor(sk);
  const tone = mediaTones(theme);
  const photo = item.photo;
  const message = item.kind === "wish" ? item.wish.message : null;
  const who = item.kind === "wish" ? item.wish.name : item.photo.uploader_name;
  const aspect = photo ? aspectFor(item.kind === "wish" ? item.wish.wish_id : photo.photo_id) : "";
  return (
    <div className={photo ? "p-2.5 sm:p-3" : "p-4 sm:p-5"} style={media.note(theme)}>
      {photo && <WallPhoto theme={theme} src={photo.url} alt={who ? "" : t("grace.guestbook.photoBy")} index={index} aspect={aspect} />}
      {message && <p className={`m-0 whitespace-pre-line break-words text-base leading-relaxed ${photo ? "mt-3" : ""}`}>{message}</p>}
      {who && (
        <p className="m-0 mt-2 break-words text-sm font-medium" style={{ color: tone.accent }}>
          {who}
        </p>
      )}
    </div>
  );
}

/** The wall of what guests shared: wishes with their photos, then loose photos, or a friendly empty note. */
export function SkinGuestbookWall({ theme, data }: { theme: Theme; data?: GuestbookData }) {
  const { t, language } = useLanguage();
  const sk = useSkinOrnaments();
  const media = mediaFor(sk);
  const items = buildWall(data);
  return (
    <div className="mt-16">
      <h3 className="m-0 text-xl" style={sk.heading(theme, language)}>
        {t("grace.guestbook.wallHeading")}
      </h3>
      {items.length > 0 ? (
        <ul className="m-0 mt-8 list-none columns-2 gap-3 p-0 text-left sm:columns-3 sm:gap-5">
          {items.map((item, i) => (
            <li key={item.key} className="mb-3 break-inside-avoid sm:mb-5">
              <Card theme={theme} item={item} index={i} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="mx-auto mt-8 flex max-w-sm flex-col items-center gap-3 p-8" style={media.note(theme)}>
          <sk.Crest color={theme.accent_color} ground={theme.bg_color} label="♥" size={56} />
          <p className="m-0 text-base">{t("grace.guestbook.empty")}</p>
        </div>
      )}
    </div>
  );
}
