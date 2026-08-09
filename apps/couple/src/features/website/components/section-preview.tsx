"use client";

import {
  LanguageProvider,
  SiteRenderer,
  type CoupleInfo,
  type PartialTheme,
  type SiteRendererTemplate,
} from "@mongkolka/templates";
import type { WebsiteSection } from "../data/schema";
import { buildPreviewContent, type PreviewProfile } from "../lib/build-content";

// Renders the section at a fixed "design" width, then scales that whole box
// down to fit a small swatch — the same containment trick website-preview.tsx
// uses for the full-page preview (a transformed ancestor becomes the
// containing block for the opening gate's `position: fixed`), just applied at
// row scale instead of page scale. Not meant to be pixel-perfect, just enough
// for a couple to recognize what a row looks like without scrolling the full
// preview pane.
const DESIGN_WIDTH = 1200;
const SWATCH_WIDTH = 128; // w-32
const SWATCH_HEIGHT = 80; // h-20
const SCALE = SWATCH_WIDTH / DESIGN_WIDTH;

export function SectionPreview({
  section,
  template,
  themeOverride,
  profile,
}: {
  section: WebsiteSection;
  template: SiteRendererTemplate;
  themeOverride: PartialTheme | null;
  profile: PreviewProfile;
}) {
  const couple: CoupleInfo = {
    partner1Name: profile.partner1_name ?? "Partner One",
    partner2Name: profile.partner2_name ?? undefined,
    weddingDate: profile.wedding_date ?? undefined,
  };

  return (
    <div
      className="relative shrink-0 overflow-hidden rounded-md border bg-muted"
      style={{ width: SWATCH_WIDTH, height: SWATCH_HEIGHT }}
    >
      <div
        className="pointer-events-none absolute left-0 top-0 origin-top-left"
        style={{ width: DESIGN_WIDTH, transform: `scale(${SCALE})` }}
      >
        <LanguageProvider>
          <SiteRenderer
            template={template}
            sections={[section]}
            themeOverride={themeOverride}
            couple={couple}
            buildContent={(sectionKey) => buildPreviewContent(sectionKey, profile)}
            guestGreeting="Guest"
            extraProps={(sectionKey) => (sectionKey === "rsvp" ? { onSubmit: async () => {} } : {})}
          />
        </LanguageProvider>
      </div>
    </div>
  );
}
