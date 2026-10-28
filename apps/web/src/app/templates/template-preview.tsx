"use client";

import {
  LanguageProvider,
  SAMPLE_CONTENT,
  SAMPLE_COUPLE,
  SiteRenderer,
  SECTION_KEYS,
  type SiteRendererSection,
  type SiteRendererTemplate,
} from "@mongkolka/templates";

const SAMPLE_SECTIONS: SiteRendererSection[] = SECTION_KEYS.map((key, index) => ({
  section_id: key,
  section_key: key,
  component_id: null,
  color_override: null,
  display_order: index,
  enabled: true,
}));

export function TemplatePreview({
  template,
  fullPage = false,
}: {
  template: SiteRendererTemplate;
  fullPage?: boolean;
}) {
  const site = (
    <SiteRenderer
      template={template}
      sections={SAMPLE_SECTIONS}
      couple={SAMPLE_COUPLE}
      buildContent={(sectionKey) => SAMPLE_CONTENT[sectionKey] ?? {}}
      guestGreeting="Guest"
      extraProps={(sectionKey) => (sectionKey === "rsvp" ? { onSubmit: async () => {} } : {})}
    />
  );

  // fullPage: the subdomain preview renders the site as a real page (no frame).
  if (fullPage) return <LanguageProvider>{site}</LanguageProvider>;

  return (
    <LanguageProvider>
      <div className="relative h-160 overflow-hidden rounded-xl border" style={{ transform: "translateZ(0)" }}>
        <div className="h-full overflow-y-auto">{site}</div>
      </div>
    </LanguageProvider>
  );
}
