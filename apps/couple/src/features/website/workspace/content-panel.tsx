"use client";

import { hasSectionTitle } from "@mongkolka/templates";
import type { WebsiteSection } from "../data/schema";
import { SectionTitleFields } from "../components/section-title-fields";
import { HeroBannerAssets } from "../components/hero-banner-assets";
import { ProfileSectionForm } from "../components/profile-section-form";
import { GuestbookContentForm } from "../components/guestbook-content-form";
import { StoryContentForm } from "../components/story-content-form";
import { SectionContentForm } from "../components/section-content-forms";
import type { PreviewProfile } from "../lib/build-content";
import { isProfileSection } from "../lib/profile-section-fields";
import { canEditSection } from "../lib/section-editors";
import { sectionLabel } from "./section-labels";

/** Inline content editor for the selected section (no dialog). Remounts per section. */
export function ContentPanel({
  section,
  profile,
  saveTitle,
  galleryLayouts,
  styleId,
}: {
  section: WebsiteSection;
  profile: PreviewProfile;
  /** Saves this section's own heading (null = back to the template's wording). */
  saveTitle: (title: { kh?: string; en?: string } | null) => Promise<boolean>;
  /** The styles a gallery can stack (the same list as the Style tab). */
  galleryLayouts?: { id: string; label: string }[];
  /** The style drawing this section, saved or inherited from the template. */
  styleId: string;
}) {
  const name = sectionLabel(section.section_key);
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-lg font-semibold">{name}</h2>
      </div>
      {hasSectionTitle(section.section_key) && <SectionTitleFields key={`title-${section.section_id}`} section={section} onSave={saveTitle} />}
      {!canEditSection(section.section_key) ? (
        <p className="text-sm text-muted-foreground">
          Nothing to edit in this section. Change how it looks in the Style tab below.
        </p>
      ) : isProfileSection(section.section_key) ? (
        <>
          {section.section_key === "hero" && (
            <section aria-label="Hero banners" className="flex flex-col gap-2">
              <h3 className="text-sm font-semibold">Hero banners</h3>
              <HeroBannerAssets key={`banners-${section.section_id}`} section={section} profile={profile} />
            </section>
          )}
          <ProfileSectionForm key={`profile-${section.section_id}`} sectionKey={section.section_key} profile={profile} onSaved={() => {}} />
        </>
      ) : section.section_key === "guestbook" ? (
        <GuestbookContentForm key={`guestbook-${section.section_id}`} section={section} styleId={styleId} onSaved={() => {}} />
      ) : section.section_key === "story" ? (
        <StoryContentForm key={`story-${section.section_id}`} section={section} profile={profile} onSaved={() => {}} />
      ) : (
        <SectionContentForm key={`content-${section.section_id}`} section={section} onSaved={() => {}} galleryLayouts={galleryLayouts} />
      )}
    </div>
  );
}
