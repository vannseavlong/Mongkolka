"use client";

import {
  LanguageProvider,
  LanguageToggle,
  SAMPLE_CONTENT,
  SAMPLE_COUPLE,
  SAMPLE_GUESTBOOK,
  SAMPLE_GUESTBOOK_ACTIONS,
  sampleGuestbookSubmit,
  SiteRenderer,
  SECTION_KEYS,
  type SectionKey,
  type SiteRendererSection,
  type SiteRendererTemplate,
} from "@mongkolka/templates";

type DefaultSections = { section_key: SectionKey; enabled: boolean }[];

const ALL_SECTIONS: DefaultSections = SECTION_KEYS.map((key) => ({ section_key: key, enabled: true }));

/**
 * Sections to preview: the template's own `default_sections` (ordered, with on/off) when the
 * API supplies it and it is a usable list, otherwise every section in the standard order.
 */
function previewSections(defaults: unknown): SiteRendererSection[] {
  const known = new Set<string>(SECTION_KEYS);
  const list =
    Array.isArray(defaults) && defaults.length > 0
      ? (defaults as DefaultSections).filter((d) => d && known.has(d.section_key))
      : ALL_SECTIONS;
  return list.map((d, index) => ({
    section_id: d.section_key,
    section_key: d.section_key,
    component_id: null,
    color_override: null,
    display_order: index,
    enabled: d.enabled !== false,
  }));
}

export function TemplatePreview({
  template,
  fullPage = false,
  initialLanguage = "en",
  guestGreeting = "Guest",
  brandUrl,
}: {
  template: SiteRendererTemplate & { default_sections?: unknown };
  fullPage?: boolean;
  initialLanguage?: "en" | "kh";
  /** From `?to=` / `?name=` on the preview page; falls back to a generic "Guest". */
  guestGreeting?: string;
  /** Main-site URL for the footer credit link (undefined = plain text). */
  brandUrl?: string;
}) {
  const site = (
    <SiteRenderer
      template={template}
      sections={previewSections(template.default_sections)}
      couple={SAMPLE_COUPLE}
      buildContent={(sectionKey) => SAMPLE_CONTENT[sectionKey] ?? {}}
      guestGreeting={guestGreeting}
      extraProps={(sectionKey) => {
        // Sample data only: nothing is sent anywhere from a template preview.
        if (sectionKey === "rsvp") return { onSubmit: async () => {} };
        if (sectionKey === "guestbook") {
          return { guestbook: SAMPLE_GUESTBOOK, actions: SAMPLE_GUESTBOOK_ACTIONS, onSubmit: sampleGuestbookSubmit };
        }
        if (sectionKey === "footer") return { brandUrl };
        return {};
      }}
    />
  );

  // fullPage: the subdomain preview renders the site as a real page (no frame).
  if (fullPage) {
    return (
      <LanguageProvider initialLanguage={initialLanguage}>
        <LanguageToggle theme={{ text_color: template.default_theme.text_color }} />
        {site}
      </LanguageProvider>
    );
  }

  return (
    <LanguageProvider initialLanguage={initialLanguage}>
      <div className="relative h-160 overflow-hidden rounded-xl border" style={{ transform: "translateZ(0)" }}>
        <div className="h-full overflow-y-auto">{site}</div>
      </div>
    </LanguageProvider>
  );
}
