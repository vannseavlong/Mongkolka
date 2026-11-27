"use client";

import {
  LanguageProvider,
  SiteRenderer,
  sampleContentFor,
  sampleCoupleFor,
  skinFromComponents,
  type SiteRendererSection,
} from "@mongkolka/templates";
import { useFitScale } from "@/lib/use-fit-scale";
import { useInView } from "@/lib/use-in-view";
import type { SiteTemplateSummary } from "./types";

// The design is laid out at a desktop width, then scaled down to the card.
const BASE_WIDTH = 1280;
const BASE_HEIGHT = 800;

/** What a guest sees first: the cover when the template has one, otherwise the hero. */
function firstLook(template: SiteTemplateSummary): SiteRendererSection[] {
  const key = template.default_components.cover ? "cover" : "hero";
  return [{ section_id: key, section_key: key, component_id: null, color_override: null, display_order: 0, enabled: true }];
}

/**
 * A small, non-interactive live preview of a template's first screen with sample couple data.
 * It mounts only once scrolled near the viewport; until then (and without JS) the card shows the
 * template's background colour and "Aa" sample.
 */
export function TemplateThumb({ template, className = "" }: { template: SiteTemplateSummary; className?: string }) {
  const { ref: viewRef, seen } = useInView<HTMLDivElement>();
  const { ref: fitRef, scale } = useFitScale<HTMLDivElement>(BASE_WIDTH);
  const skin = skinFromComponents(template.default_components);
  const sample = sampleContentFor(skin);
  const theme = template.default_theme;

  return (
    <div
      ref={(node) => {
        viewRef.current = node;
        fitRef.current = node;
      }}
      className={`relative aspect-[8/5] w-full overflow-hidden ${className}`}
      style={{ backgroundColor: theme.bg_color }}
    >
      <span
        className="absolute inset-0 flex items-center justify-center text-5xl"
        style={{ color: theme.accent_color, fontFamily: theme.font_style }}
        aria-hidden
      >
        Aa
      </span>
      {seen && scale > 0 && (
        <div
          aria-hidden
          inert
          className="pointer-events-none absolute top-0 left-0 origin-top-left overflow-hidden select-none"
          style={{
            width: BASE_WIDTH,
            height: BASE_HEIGHT,
            transform: `scale(${scale})`,
            backgroundColor: theme.bg_color,
          }}
        >
          <LanguageProvider initialLanguage="en">
            <SiteRenderer
              template={{ default_theme: theme, default_components: template.default_components }}
              sections={firstLook(template)}
              couple={sampleCoupleFor(skin)}
              buildContent={(sectionKey) => sample[sectionKey] ?? {}}
              coverPreview
              // wrapSection also switches off the shared chrome (music, dock, particles), which would escape the card.
              wrapSection={(_section, node) => node}
            />
          </LanguageProvider>
        </div>
      )}
    </div>
  );
}
