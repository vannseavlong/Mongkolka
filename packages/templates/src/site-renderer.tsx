"use client";

import { useState } from "react";
import { resolveComponent } from "./registry";
import { resolveTheme } from "./theme";
import type { CoupleInfo, PartialTheme, SectionKey, Theme } from "./types";

export interface SiteRendererSection {
  section_id: string;
  section_key: SectionKey;
  component_id: string | null;
  color_override: PartialTheme | null;
  display_order: number;
  enabled: boolean;
}

export interface SiteRendererTemplate {
  default_theme: Theme;
  default_components: Partial<Record<SectionKey, string>>;
}

export interface SiteRendererProps {
  template: SiteRendererTemplate;
  sections: SiteRendererSection[];
  themeOverride?: PartialTheme | null;
  couple: CoupleInfo;
  buildContent: (sectionKey: SectionKey) => unknown;
  guestGreeting?: string;
  /**
   * Per-section props beyond the generic {couple, theme, content} shape — e.g.
   * `rsvp`'s component takes a required `onSubmit` callback instead of `couple`.
   * Extra keys returned for a section not actually accepted by its component are
   * simply ignored by React.
   */
  extraProps?: (sectionKey: SectionKey) => Record<string, unknown>;
}

/**
 * Resolves and renders a couple's chosen sections in order, gated by their
 * opening component if enabled. Shared by the couple-portal builder preview and
 * the real public site so the two never drift — assumes it's already inside a
 * LanguageProvider (the section components call useLanguage() internally).
 */
export function SiteRenderer({
  template,
  sections,
  themeOverride,
  couple,
  buildContent,
  guestGreeting,
  extraProps,
}: SiteRendererProps) {
  const [openingDismissed, setOpeningDismissed] = useState(false);

  const ordered = [...sections].filter((s) => s.enabled).sort((a, b) => a.display_order - b.display_order);
  const opening = ordered.find((s) => s.section_key === "opening");
  const rest = ordered.filter((s) => s.section_key !== "opening");

  if (opening && !openingDismissed) {
    const theme = resolveTheme(template.default_theme, themeOverride, opening.color_override);
    const Component = resolveComponent("opening", opening.component_id, template.default_components.opening);
    if (!Component) return null;
    return (
      <Component
        couple={couple}
        theme={theme}
        guestGreeting={guestGreeting}
        onOpen={() => setOpeningDismissed(true)}
      />
    );
  }

  return (
    <>
      {rest.map((section) => {
        const theme = resolveTheme(template.default_theme, themeOverride, section.color_override);
        const Component = resolveComponent(
          section.section_key,
          section.component_id,
          template.default_components[section.section_key],
        );
        if (!Component) return null;
        return (
          <Component
            key={section.section_id}
            couple={couple}
            theme={theme}
            content={buildContent(section.section_key)}
            {...extraProps?.(section.section_key)}
          />
        );
      })}
    </>
  );
}
