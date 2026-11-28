"use client";

import type { GuestbookWallProps } from "../ink/Guestbook";
import { useLanguage } from "../../i18n";
import { useGuest } from "../../guest-context";
import { MediaSection } from "./gallery-section";
import { SkinCard } from "./guestbook-card";
import { useGuestbookForm } from "./guestbook-form";
import { SkinGuestbookForm } from "./GuestbookSkinForm";
import { SkinGuestbookWall } from "./GuestbookSkinWall";

/**
 * The skin-aware guestbook (`guestbook_skin`): the same guest photo + wish flow and wall as the Grace
 * guestbook (same submit contract, pending/approved outcome), dressed in the active skin's card, fields,
 * button, photo frames and notes. No directions / calendar / share row.
 */
export function SkinGuestbook({ theme, guestbook, onSubmit, photosHref, wishesHref }: GuestbookWallProps & { photosHref?: string; wishesHref?: string }) {
  const { t } = useLanguage();
  const { name: invitedName } = useGuest();
  const form = useGuestbookForm(invitedName, onSubmit);
  const seeAllHref = wishesHref ?? photosHref;

  return (
    <MediaSection theme={theme} id="guestbook" heading={t("grace.guestbook.heading")} intro={t("grace.guestbook.subheading")}>
      <SkinCard theme={theme}>
        <SkinGuestbookForm theme={theme} form={form} more={seeAllHref ? { href: seeAllHref, label: t("grace.guestbook.seeAll") } : undefined} />
      </SkinCard>

      {/* With a sub-page, every wish and photo lives there; without one (previews) the wall stays in the section. */}
      {!seeAllHref && <SkinGuestbookWall theme={theme} data={guestbook} />}
    </MediaSection>
  );
}
