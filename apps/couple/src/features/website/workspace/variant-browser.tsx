"use client";

import { Check } from "lucide-react";
import { sectionRegistry } from "@mongkolka/templates";
import { Badge } from "@mongkolka/ui/badge";
import { Skeleton } from "@mongkolka/ui/skeleton";
import { cn } from "@mongkolka/ui/utils";
import { SectionPreview } from "../components/section-preview";
import type { SectionPanelContext } from "./panel-tabs/types";

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

  // Active catalog rows that actually have a component; the current one is kept
  // even if it was since deactivated so the couple can see what they have.
  const variants = components.filter(
    (c) => c.section === section.section_key && registered[c.component_id] && (c.status === "active" || c.component_id === currentId),
  );

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
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2" aria-label={`${section.section_key} styles`}>
        {variants.map((variant) => {
          const isCurrent = variant.component_id === currentId;
          const isDefault = variant.component_id === defaultId;
          return (
            <li key={variant.component_id}>
              <button
                type="button"
                aria-pressed={isCurrent}
                disabled={isCurrent}
                onClick={() =>
                  // Choosing the template's own default stores null so the
                  // section keeps following the template if it changes.
                  patchSection(
                    { component_id: isDefault ? null : variant.component_id },
                    `Could not switch to ${variant.name}`,
                  )
                }
                className={cn(
                  "flex w-full flex-col gap-2 rounded-lg border p-2 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                  isCurrent ? "border-primary ring-2 ring-primary/30" : "hover:border-foreground/40",
                )}
              >
                <SectionPreview
                  section={section}
                  componentId={variant.component_id}
                  template={template}
                  themeOverride={themeOverride}
                  profile={profile}
                />
                <span className="flex flex-wrap items-center gap-1.5 px-0.5">
                  <span className="text-sm font-medium">{variant.name}</span>
                  {isCurrent && (
                    <Badge>
                      <Check className="size-3" /> Current
                    </Badge>
                  )}
                  {isDefault && <Badge variant="secondary">Template default</Badge>}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
