"use client";

import { Fragment, useMemo, useState, type ReactNode } from "react";
import { resolveComponent } from "./registry";
import { GuestProvider } from "./guest-context";
import { ChromeSection } from "./chrome/ChromeSection";
import { SiteChrome } from "./chrome/SiteChrome";
import type { ChromeConfig } from "./chrome/config";
import { useSiteChrome } from "./chrome/use-site-chrome";
import { SkinProvider } from "./sections/khmer/skin-context";
import { skinFromComponents } from "./sections/khmer/skin-resolve";
import { GalleryLinkProvider, GalleryMoreLink } from "./gallery-page";
import { storyContentFor } from "./story-view";
import { useLanguage } from "./i18n";
import { heroContentFor } from "./hero-photo";
import { TextOverridesProvider } from "./i18n";
import { titleOverrides, type SectionTitle } from "./section-titles";
import { applyOpeningOverrides } from "./opening-overrides";
import { useOrientation } from "./use-orientation";
import { resolveTheme } from "./theme";
import type { CoupleInfo, CoverContent, DetailsContent, OpeningContent, PartialTheme, SectionKey, Theme } from "./types";

/** Gallery styles that draw their own "show all" button (it links to the sub-page), so none is added under them. */
const GALLERY_OWN_LINK: ReadonlySet<string> = new Set(["gallery_covenant"]);

export interface SiteRendererSection {
  section_id: string;
  section_key: SectionKey;
  component_id: string | null;
  color_override: PartialTheme | null;
  display_order: number;
  enabled: boolean;
  /** The section's own heading per language; overrides the template's wording. */
  title?: SectionTitle | null;
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
  /** Fired when the guest opens the opening gate (the builder preview uses it to reveal the page). */
  onOpened?: () => void;
  /** Fired when the cover starts fading away and the opening gate appears beneath it (builder preview). */
  onCoverRevealed?: () => void;
  /** Thumbnail mode: the cover keeps playing and never reveals (builder style picker). */
  coverPreview?: boolean;
  /** Where "View all photos" goes (the gallery sub-page). Omit for no button. */
  galleryHref?: string;
  /** Called just before leaving for the gallery sub-page (the site saves the reader's place). */
  onGalleryOpen?: () => void;
  /** Coming back from the gallery sub-page: skip the cover and the opening and go straight to the page. */
  skipIntro?: boolean;
}

/**
 * Resolves and renders a couple's chosen sections in order, gated by their
 * opening component if enabled. Shared by the couple-portal builder preview and
 * the real public site so the two never drift — assumes it's already inside a
 * LanguageProvider (the section components call useLanguage() internally).
 */
export function SiteRenderer(props: SiteRendererProps) {
  const { template, sections, themeOverride, couple, guestGreeting, onCoverRevealed, coverPreview } = props;
  // The cover plays first. The rest of the site (opening gate included) mounts only when it starts to
  // reveal, so nothing underneath animates before the guest can see it.
  const [coverPhase, setCoverPhase] = useState<"play" | "revealing" | "done">(props.skipIntro ? "done" : "play");
  const cover = sections.find((s) => s.section_key === "cover" && s.enabled);
  const Cover = cover ? resolveComponent("cover", cover.component_id, template.default_components.cover) : undefined;
  const holding = !!Cover && coverPhase === "play";
  // The cover shows the same names and date the couple typed in the Opening section.
  const openingContent = sections.find((s) => s.section_key === "opening")?.content as OpeningContent | undefined;
  const introCouple = applyOpeningOverrides(couple, undefined, openingContent).couple;

  // The couple's own section titles replace the template's headings wherever those are drawn.
  const titleKey = JSON.stringify(sections.map((s) => [s.section_key, s.enabled, s.title]));
  // eslint-disable-next-line react-hooks/exhaustive-deps -- keyed by the titles' content so the provider value stays stable
  const overrides = useMemo(() => titleOverrides(sections), [titleKey]);

  return (
    <TextOverridesProvider overrides={overrides}>
      <GalleryLinkProvider link={props.galleryHref ? { href: props.galleryHref, onOpen: props.onGalleryOpen } : null}>
      {!holding && <SiteRendererBody {...props} />}
      {cover && Cover && coverPhase !== "done" && (
        <Cover
          couple={introCouple}
          theme={resolveTheme(template.default_theme, themeOverride, cover.color_override)}
          guestGreeting={guestGreeting}
          preview={coverPreview}
          content={cover.content as CoverContent | undefined}
          onReveal={() => {
            setCoverPhase("revealing");
            onCoverRevealed?.();
          }}
          onDone={() => setCoverPhase("done")}
        />
      )}
      </GalleryLinkProvider>
    </TextOverridesProvider>
  );
}

function SiteRendererBody({
  template,
  sections,
  themeOverride,
  couple,
  buildContent,
  guestGreeting,
  extraProps,
  wrapSection,
  musicSrc,
  onOpened,
  galleryHref,
  skipIntro,
}: SiteRendererProps) {
  const [openingDismissed, setOpeningDismissed] = useState(!!skipIntro);
  const orientation = useOrientation();
  const { language } = useLanguage();

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
  const rest = ordered.filter((s) => s.section_key !== "opening" && s.section_key !== "cover");

  if (opening && !openingDismissed) {
    const theme = resolveTheme(template.default_theme, themeOverride, opening.color_override);
    const Component = resolveComponent("opening", opening.component_id, template.default_components.opening);
    if (!Component) return null;
    const openingContent = (opening.content ?? buildContent("opening")) as OpeningContent | undefined;
    const intro = applyOpeningOverrides(couple, buildContent("details") as DetailsContent | undefined, openingContent);
    const gate = (
      <Component
        couple={intro.couple}
        theme={theme}
        guestGreeting={guestGreeting}
        details={intro.details}
        content={openingContent}
        onOpen={() => {
          setOpeningDismissed(true);
          onOpened?.();
        }}
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
        const content =
          section.section_key === "hero"
            ? heroContentFor(buildContent("hero"), section.content, orientation)
            : section.section_key === "story"
              ? storyContentFor(buildContent("story"), section.content, language)
              : (section.content ?? buildContent(section.section_key));
        const piece = <Component key={section.section_id} couple={couple} theme={theme} content={content} {...extraProps?.(section.section_key)} />;
        // A gallery with photos gets a "View all photos" button to the sub-page, whichever style draws the gallery.
        const ownGalleryButton = section.section_key === "gallery" && GALLERY_OWN_LINK.has(section.component_id ?? template.default_components.gallery ?? "");
        const hasMorePhotos = section.section_key === "gallery" && !!galleryHref && !ownGalleryButton && ((content as { photos?: unknown[] } | null | undefined)?.photos?.length ?? 0) > 0;
        const node = hasMorePhotos ? (
          <Fragment key={section.section_id}>
            {piece}
            <GalleryMoreLink theme={theme} />
          </Fragment>
        ) : (
          piece
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
