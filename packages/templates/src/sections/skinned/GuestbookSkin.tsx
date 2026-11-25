"use client";

import { Calendar, MapPin, Share2 } from "lucide-react";
import type { GuestbookWallProps } from "../ink/Guestbook";
import { useLanguage } from "../../i18n";
import { useGuest } from "../../guest-context";
import { useSkinOrnaments } from "../khmer/skin-context";
import { mediaFor } from "./gallery-media";
import { MediaSection } from "./gallery-section";
import { mediaTones } from "./gallery-tones";
import { SkinCard } from "./guestbook-card";
import { useGuestbookActions } from "./guestbook-actions";
import { useGuestbookForm } from "./guestbook-form";
import { SkinGuestbookForm } from "./GuestbookSkinForm";
import { SkinGuestbookWall } from "./GuestbookSkinWall";

/**
 * The skin-aware guestbook (`guestbook_skin`): the same guest photo + wish flow, wall and actions
 * as the Grace guestbook (same props, same submit contract, pending/approved outcome), dressed in
 * the active skin's card, fields, button, photo frames and notes.
 */
export function SkinGuestbook({ couple, theme, guestbook, actions, onSubmit, photosHref, wishesHref }: GuestbookWallProps & { photosHref?: string; wishesHref?: string }) {
  const { t, language } = useLanguage();
  const { name: invitedName } = useGuest();
  const sk = useSkinOrnaments();
  const media = mediaFor(sk);
  const tone = mediaTones(theme);
  const form = useGuestbookForm(invitedName, onSubmit);
  const act = useGuestbookActions(couple, actions);
  const seeAllHref = wishesHref ?? photosHref;

  const buttons = [
    actions?.mapsUrl && { key: "maps", icon: MapPin, label: t("grace.guestbook.directions"), onClick: act.openMaps },
    actions?.calendar && { key: "cal", icon: Calendar, label: t("grace.guestbook.calendar"), onClick: act.addToCalendar },
    { key: "share", icon: Share2, label: t("grace.guestbook.share"), onClick: act.share },
  ].filter(Boolean) as { key: string; icon: typeof MapPin; label: string; onClick: () => void }[];

  return (
    <MediaSection theme={theme} id="guestbook" heading={t("grace.guestbook.heading")} intro={t("grace.guestbook.subheading")}>
      <SkinCard theme={theme}>
        <SkinGuestbookForm theme={theme} form={form} more={seeAllHref ? { href: seeAllHref, label: t("grace.guestbook.seeAll") } : undefined} />
      </SkinCard>

      {/* With a sub-page, every wish and photo lives there; without one (previews) the wall stays in the section. */}
      {!seeAllHref && <SkinGuestbookWall theme={theme} data={guestbook} />}

      <div className="mt-14">
        <p className="m-0 text-base" style={{ color: tone.accent }}>
          {t("grace.guestbook.actionsHeading")}
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          {buttons.map(({ key, icon: Icon, label, onClick }) => (
            <button
              key={key}
              type="button"
              onClick={onClick}
              className="sk-btn flex min-h-12 items-center gap-2 px-5 text-base"
              style={{ ...media.note(theme), borderRadius: 999, boxShadow: "none" }}
            >
              <Icon className="size-4" style={{ color: tone.accent }} aria-hidden />
              {label}
            </button>
          ))}
        </div>
        <p role="status" aria-live="polite" className="m-0 mt-3 min-h-6 text-base" style={{ color: tone.accent }} data-lang={language}>
          {act.copied ? t("grace.guestbook.copied") : ""}
        </p>
        {act.manualLink && (
          <div className="mx-auto mt-2 max-w-sm text-left">
            <label htmlFor="sk-gb-link" className="mb-1.5 block text-base">
              {t("grace.guestbook.copyManual")}
            </label>
            <input id="sk-gb-link" readOnly value={act.manualLink} onFocus={(e) => e.currentTarget.select()} className="sk-field" style={media.field(theme)} />
          </div>
        )}
      </div>
    </MediaSection>
  );
}
