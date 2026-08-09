"use client";

import { LanguageProvider, SiteRenderer, type CoupleInfo, type Theme } from "@mongkolka/templates";
import type { SiteTemplate, WebsiteSection } from "../data/schema";
import { buildPreviewContent, type PreviewProfile } from "../lib/build-content";

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

  return (
    <LanguageProvider>
      <div
        className="relative h-160 overflow-hidden rounded-lg border"
        style={{ transform: "translateZ(0)" }}
      >
        <div className="h-full overflow-y-auto">
          <SiteRenderer
            template={template}
            sections={sections}
            themeOverride={themeOverride}
            couple={couple}
            buildContent={(sectionKey) => buildPreviewContent(sectionKey, profile)}
            guestGreeting="Guest"
            extraProps={(sectionKey) =>
              sectionKey === "rsvp" ? { onSubmit: async () => {} } : {}
            }
          />
        </div>
      </div>
    </LanguageProvider>
  );
}
