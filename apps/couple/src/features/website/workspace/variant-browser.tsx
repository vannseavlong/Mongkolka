"use client";

import { Check } from "lucide-react";
import { sectionRegistry, skinFromComponents, variantsForSkin } from "@mongkolka/templates";
import { Badge } from "@mongkolka/ui/badge";
import { Skeleton } from "@mongkolka/ui/skeleton";
import { cn } from "@mongkolka/ui/utils";
import type { SectionComponent, WebsiteSectionKey } from "../data/schema";
import { sectionLabel } from "./section-labels";
import { SectionPreview } from "../components/section-preview";
import type { SectionPanelContext } from "./panel-tabs/types";

/** Display stand-in for a registered style that has no catalog row: "opening_card_covenant" -> "Card covenant". */
function fallbackVariant(sectionKey: WebsiteSectionKey, componentId: string): Omit<SectionComponent, "status"> {
  const words = componentId.replace(new RegExp(`^${sectionKey}_?`), "").split("_").filter(Boolean).join(" ");
  const name = words ? words.charAt(0).toUpperCase() + words.slice(1) : componentId;
  return {
    component_id: componentId,
    section: sectionKey,
    name,
    preview_bg_color: null,
    preview_text_color: null,
    preview_accent_color: null,
    font_style: null,
  };
}

/**
 * Every active variant of one section, each rendered with the couple's own
 * data. Clicking one applies it (optimistic, rolls back on failure).
 */
export function VariantBrowser({ context }: { context: SectionPanelContext }) {
  const { section, components, catalogLoading, template, themeOverride, profile, patchSection } = context;
  const registered = sectionRegistry[section.section_key];
  const defaultId = template.default_components[section.section_key] ?? null;

  // What the canvas actually renders today (mirrors resolveComponent's fallback).
  const currentId =
    (section.component_id && registered[section.component_id] && section.component_id) ||
    (defaultId && registered[defaultId] && defaultId) ||
    Object.keys(registered)[0];

  // Two styles always stay in the list: the one in use, and the one the template ships with (so the
  // couple can always go back to the original design after trying another). Everything else must be an
  // active catalog row that has a component and fits this template's skin (no mixing another skin's ornaments in).
  const keep = [defaultId, currentId].filter((id, i, all): id is string => !!id && !!registered[id] && all.indexOf(id) === i);
  const candidates = components.filter(
    (c) => c.section === section.section_key && registered[c.component_id] && (c.status === "active" || keep.includes(c.component_id)),
  );
  const fits = new Set(variantsForSkin(candidates, skinFromComponents(template.default_components)).map((c) => c.component_id));
  const listed = candidates.filter((c) => fits.has(c.component_id) || keep.includes(c.component_id));
  // The live catalog may have no row for a kept style (e.g. a template launched before its rows were
  // seeded or while they are inactive). It is shown from the registry id instead of silently missing.
  const missing: SectionComponent[] = keep
    .filter((id) => !listed.some((c) => c.component_id === id))
    .map((id) => ({ ...fallbackVariant(section.section_key, id), status: "active" as const }));
  const variants: SectionComponent[] = [...missing, ...listed];

  if (catalogLoading) {
    return (
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2" aria-busy="true" aria-label="Loading styles">
        {[0, 1, 2, 3].map((i) => (
          <Skeleton key={i} className="aspect-16/10 w-full rounded-md" />
        ))}
      </div>
    );
  }

  if (variants.length === 0) {
    return <p className="text-sm text-muted-foreground">No styles are available for this section yet.</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      {variants.length === 1 && (
        <p className="text-sm text-muted-foreground">This section has one style for now. More are coming.</p>
      )}
      <ul className="grid grid-cols-2 gap-3 md:grid-cols-4 2xl:grid-cols-6" aria-label={`${sectionLabel(section.section_key)} styles`}>
        {variants.map((variant) => {
          const isCurrent = variant.component_id === currentId;
          const isDefault = variant.component_id === defaultId;
          return (
            <li
              key={variant.component_id}
              className={cn(
                "relative flex w-full flex-col gap-2 rounded-lg border p-2 text-left transition-colors",
                isCurrent ? "border-primary ring-2 ring-primary/30" : "hover:border-foreground/40",
              )}
            >
              {/* The preview renders real template markup (which has its own
                  buttons), so it must sit beside the card's button, not inside it. */}
              <SectionPreview
                section={section}
                componentId={variant.component_id}
                template={template}
                themeOverride={themeOverride}
                profile={profile}
              />
              <span className="flex flex-wrap items-center gap-1.5 px-0.5">
                <button
                  type="button"
                  aria-pressed={isCurrent}
                  // aria-disabled, not disabled, so focus and aria-pressed survive.
                  aria-disabled={isCurrent}
                  onClick={() =>
                    !isCurrent &&
                    // Choosing the template's own default stores null so the
                    // section keeps following the template if it changes.
                    patchSection(
                      { component_id: isDefault ? null : variant.component_id },
                      `Could not switch to ${variant.name}`,
                    )
                  }
                  // The ::after stretches the hit area over the whole card.
                  className={cn(
                    "text-sm font-medium after:absolute after:inset-0 after:rounded-lg focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-ring",
                    isCurrent && "cursor-default after:cursor-default",
                  )}
                >
                  {variant.name}
                </button>
                {isCurrent && (
                  <Badge>
                    <Check className="size-3" /> Current
                  </Badge>
                )}
                {isDefault && <Badge variant="secondary">Template default</Badge>}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
