"use client";

import { useState } from "react";
import {
  LanguageProvider,
  resolveComponent,
  resolveTheme,
  type CoupleInfo,
  type SectionKey,
  type Theme,
} from "@mongkolka/templates";
import type { SiteTemplate, WebsiteSection } from "../data/schema";

interface PreviewProfile {
  partner1_name: string | null;
  partner2_name: string | null;
  wedding_date: string | null;
  love_story: string | null;
  cover_photo_url: string | null;
  ceremony_time: string | null;
  ceremony_venue: string | null;
  ceremony_address: string | null;
  reception_time: string | null;
  reception_venue: string | null;
  reception_address: string | null;
  dress_code: string | null;
}

function buildContent(sectionKey: SectionKey, profile: PreviewProfile) {
  switch (sectionKey) {
    case "hero":
      return { coverPhotoUrl: profile.cover_photo_url ?? undefined };
    case "story":
      return { loveStory: profile.love_story ?? undefined };
    case "details":
      return {
        ceremonyTime: profile.ceremony_time ?? undefined,
        ceremonyVenue: profile.ceremony_venue ?? undefined,
        ceremonyAddress: profile.ceremony_address ?? undefined,
        receptionTime: profile.reception_time ?? undefined,
        receptionVenue: profile.reception_venue ?? undefined,
        receptionAddress: profile.reception_address ?? undefined,
        dressCode: profile.dress_code ?? undefined,
      };
    default:
      return {};
  }
}

export function WebsitePreview({
  template,
  sections,
  themeOverride,
  profile,
}: {
  template: SiteTemplate | null;
  sections: WebsiteSection[];
  themeOverride: Partial<Theme> | null;
  profile: PreviewProfile;
}) {
  const [openingDismissed, setOpeningDismissed] = useState(false);

  if (!template) {
    return (
      <div className="flex h-96 items-center justify-center rounded-lg border text-muted-foreground">
        Choose a template to see your preview
      </div>
    );
  }

  const couple: CoupleInfo = {
    partner1Name: profile.partner1_name ?? "Partner One",
    partner2Name: profile.partner2_name ?? undefined,
    weddingDate: profile.wedding_date ?? undefined,
  };

  const ordered = [...sections]
    .filter((s) => s.enabled)
    .sort((a, b) => a.display_order - b.display_order);

  const opening = ordered.find((s) => s.section_key === "opening");
  const rest = ordered.filter((s) => s.section_key !== "opening");

  return (
    <LanguageProvider>
      <div
        className="relative h-160 overflow-hidden rounded-lg border"
        style={{ transform: "translateZ(0)" }}
      >
        <div className="h-full overflow-y-auto">
          {opening && !openingDismissed
            ? (() => {
                const theme = resolveTheme(
                  template.default_theme,
                  themeOverride,
                  opening.color_override,
                );
                const Component = resolveComponent(
                  "opening",
                  opening.component_id,
                  template.default_components.opening,
                );
                if (!Component) return null;
                return (
                  <Component
                    couple={couple}
                    theme={theme}
                    guestGreeting="Guest"
                    onOpen={() => setOpeningDismissed(true)}
                  />
                );
              })()
            : rest.map((section) => {
                const theme = resolveTheme(template.default_theme, themeOverride, section.color_override);
                const Component = resolveComponent(
                  section.section_key,
                  section.component_id,
                  template.default_components[section.section_key],
                );
                if (!Component) return null;
                const content = buildContent(section.section_key, profile);
                return (
                  <Component key={section.section_id} couple={couple} theme={theme} content={content} />
                );
              })}
        </div>
      </div>
    </LanguageProvider>
  );
}
