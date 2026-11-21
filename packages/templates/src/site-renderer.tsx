"use client";

import { Fragment, useState, type ReactNode } from "react";
import { resolveComponent } from "./registry";
import { GuestProvider } from "./guest-context";
import { ChromeSection } from "./chrome/ChromeSection";
import { SiteChrome } from "./chrome/SiteChrome";
import type { ChromeConfig } from "./chrome/config";
import { useSiteChrome } from "./chrome/use-site-chrome";
import { SkinProvider } from "./sections/khmer/skin-context";
import { skinFromComponents } from "./sections/khmer/skin-resolve";
import { resolveTheme } from "./theme";
import type { CoupleInfo, PartialTheme, SectionKey, Theme } from "./types";

export interface SiteRendererSection {
  section_id: string;
  section_key: SectionKey;
  component_id: string | null;
  color_override: PartialTheme | null;
  display_order: number;
  enabled: boolean;
  /**
   * The section's own stored `website_sections.content` JSON (gallery's
   * `photos`, registry's `links`, timeline's `chapters`, rsvp's
   * `customMessage`/`deadline`, music's `playlistUrl`). `hero`/`story`/`details`
   * have no canonical home here — they're derived by the consumer's
   * `buildContent()` instead, which the render loop below falls back to
   * whenever this is null/undefined.
   */
  content?: unknown | null;
}

export interface SiteRendererTemplate {
  default_theme: Theme;
  default_components: Partial<Record<SectionKey, string>>;
  /**
   * Optional shared chrome (music toggle, bottom dock, ambient particles, scroll reveals). Absent
   * or empty = the template renders exactly as before. Ignored in the builder canvas (see
   * `wrapSection`). Shape and defaults: ./chrome/config.ts.
   */
  chrome?: ChromeConfig | null;
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
  /**
   * Wraps each rendered non-opening section, e.g. so the builder canvas can
   * anchor, outline and scroll to one. Omit on the public site (no extra DOM).
   */
  wrapSection?: (section: SiteRendererSection, node: ReactNode) => ReactNode;
  /**
   * Audio file for the background-music toggle (https or site-relative). Wins over the couple's
   * music-section link and the template default. Chrome is skipped when `wrapSection` is set,
   * because fixed overlays would escape the builder canvas.
   */
  musicSrc?: string | null;
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
  wrapSection,
  musicSrc,
}: SiteRendererProps) {
  const [openingDismissed, setOpeningDismissed] = useState(false);

  const musicSection = sections.find((s) => s.section_key === "music" && s.enabled);
  const musicContent = musicSection
    ? ((musicSection.content ?? buildContent("music")) as { playlistUrl?: string } | null | undefined)
    : undefined;
  const chrome = useSiteChrome({
    config: wrapSection ? null : template.chrome,
    musicSrc,
    musicSectionUrl: musicContent?.playlistUrl,
  });

  const skin = skinFromComponents(template.default_components);
  const ordered = [...sections].filter((s) => s.enabled).sort((a, b) => a.display_order - b.display_order);
  const opening = ordered.find((s) => s.section_key === "opening");
  const rest = ordered.filter((s) => s.section_key !== "opening");

  if (opening && !openingDismissed) {
    const theme = resolveTheme(template.default_theme, themeOverride, opening.color_override);
    const Component = resolveComponent("opening", opening.component_id, template.default_components.opening);
    if (!Component) return null;
    const gate = (
      <Component
        couple={couple}
        theme={theme}
        guestGreeting={guestGreeting}
        onOpen={() => setOpeningDismissed(true)}
      />
    );
    // `display: contents` keeps the gate's layout untouched; the wrapper only listens for the tap.
    return chrome.resolved?.music ? (
      <div style={{ display: "contents" }} onClickCapture={chrome.primeMusicOnTap}>
        {gate}
      </div>
    ) : (
      gate
    );
  }

  return (
    <GuestProvider name={guestGreeting}>
      <SkinProvider skin={skin}>
      {rest.map((section) => {
        const theme = resolveTheme(template.default_theme, themeOverride, section.color_override);
        const Component = resolveComponent(
          section.section_key,
          section.component_id,
          template.default_components[section.section_key],
        );
        if (!Component) return null;
        const node = (
          <Component
            key={section.section_id}
            couple={couple}
            theme={theme}
            content={section.content ?? buildContent(section.section_key)}
            {...extraProps?.(section.section_key)}
          />
        );
        if (chrome.resolved) {
          return (
            <ChromeSection key={section.section_id} sectionKey={section.section_key} reveal={chrome.resolved.reveal}>
              {node}
            </ChromeSection>
          );
        }
        return wrapSection ? <Fragment key={section.section_id}>{wrapSection(section, node)}</Fragment> : node;
      })}
      </SkinProvider>
      {chrome.resolved && (
        <SiteChrome
          resolved={chrome.resolved}
          theme={resolveTheme(template.default_theme, themeOverride, null)}
          sections={rest}
          music={chrome.music}
        />
      )}
    </GuestProvider>
  );
}
