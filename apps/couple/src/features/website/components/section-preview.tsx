"use client";

import { memo, useEffect, useRef, useState } from "react";
import {
  LanguageProvider,
  SAMPLE_CONTENT,
  SiteRenderer,
  type CoupleInfo,
  type PartialTheme,
  type SiteRendererTemplate,
} from "@mongkolka/templates";
import type { WebsiteSection } from "../data/schema";
import { buildPreviewContent, type PreviewProfile } from "../lib/build-content";

// Renders one section at a fixed "design" width, then scales that whole box
// down to fit its container — the same containment trick the builder canvas
// uses (a transformed ancestor becomes the
// containing block for the opening gate's `position: fixed`, which is why the
// box also gets an explicit height). The width is
// measured, so it fills a grid cell of any size. Not pixel-perfect, just enough
// to recognize a variant at a glance.
const DESIGN_WIDTH = 1200;
const ASPECT = 10 / 16;

/**
 * The couple's own content for a section. Falls back to shared sample content
 * only when the couple has nothing for it yet (e.g. no gallery photos), so an
 * empty section still previews as something instead of a blank tile.
 */
/** True for null/""/[]/{} and for objects or arrays holding only such values. */
function isEmpty(value: unknown): boolean {
  if (value === null || value === undefined || value === "") return true;
  if (Array.isArray(value)) return value.every(isEmpty);
  if (typeof value === "object") return Object.values(value).every(isEmpty);
  return false;
}

export function previewContentFor(section: WebsiteSection, profile: PreviewProfile) {
  const own = section.content ?? buildPreviewContent(section.section_key, profile);
  return isEmpty(own) ? (SAMPLE_CONTENT[section.section_key] ?? own) : own;
}

export const SectionPreview = memo(function SectionPreview({
  section,
  componentId,
  template,
  themeOverride,
  profile,
}: {
  section: WebsiteSection;
  /** Render this variant instead of the section's own `component_id`. */
  componentId?: string | null;
  template: SiteRendererTemplate;
  themeOverride: PartialTheme | null;
  profile: PreviewProfile;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const couple: CoupleInfo = {
    partner1Name: profile.partner1_name ?? "Partner One",
    partner2Name: profile.partner2_name ?? undefined,
    weddingDate: profile.wedding_date ?? undefined,
  };
  const content = previewContentFor(section, profile);
  const shown = { ...section, enabled: true, content, ...(componentId !== undefined && { component_id: componentId }) };

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="relative w-full overflow-hidden rounded-md border bg-muted"
      style={{ height: width * ASPECT || undefined, aspectRatio: width ? undefined : "16 / 10" }}
    >
      {width > 0 && (
        <div
          className="pointer-events-none absolute left-0 top-0 origin-top-left overflow-hidden"
          style={{ width: DESIGN_WIDTH, height: DESIGN_WIDTH * ASPECT, transform: `scale(${width / DESIGN_WIDTH})` }}
        >
          <LanguageProvider>
            <SiteRenderer
              template={template}
              sections={[shown]}
              themeOverride={themeOverride}
              couple={couple}
              buildContent={() => content}
              guestGreeting="Guest"
              extraProps={(sectionKey) => (sectionKey === "rsvp" ? { onSubmit: async () => {} } : {})}
            />
          </LanguageProvider>
        </div>
      )}
    </div>
  );
});
