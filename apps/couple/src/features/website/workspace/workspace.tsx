"use client";

import { useState } from "react";
import type { PartialTheme } from "@mongkolka/templates";
import { cn } from "@mongkolka/ui/utils";
import type { SectionComponent, SiteTemplate, WebsiteSection } from "../data/schema";
import type { PreviewProfile } from "../lib/build-content";
import { SectionContentDialog } from "../components/section-content-dialog";
import { SectionPanel } from "./section-panel";
import { SectionRail } from "./section-rail";
import { SiteCanvas } from "./site-canvas";
import { useSectionActions } from "./use-section-actions";

/**
 * Builder workspace: section rail + live canvas + section panel.
 * xl: three columns. lg: rail over panel on the left, canvas on the right.
 * Below lg: a Sections / Preview toggle shows one at a time.
 */
export function Workspace({
  sections,
  components,
  catalogLoading,
  template,
  themeOverride,
  profile,
}: {
  sections: WebsiteSection[];
  components: SectionComponent[];
  catalogLoading: boolean;
  template: SiteTemplate;
  /** Includes unsaved color drafts so the canvas reflects them immediately. */
  themeOverride: PartialTheme | null;
  profile: PreviewProfile;
}) {
  const ordered = [...sections].sort((a, b) => a.display_order - b.display_order);
  const [pickedId, setPickedId] = useState<string | null>(null);
  const [editing, setEditing] = useState<WebsiteSection | null>(null);
  const [pane, setPane] = useState<"sections" | "preview">("sections");
  const { patchSection, move, reordering } = useSectionActions(ordered);

  // Falls back to the first section until one is picked (or if it was removed).
  const selected = ordered.find((s) => s.section_id === pickedId) ?? ordered[0] ?? null;

  if (!selected) {
    return <p className="text-sm text-muted-foreground">This website has no sections yet.</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-1 rounded-lg bg-muted p-1 lg:hidden" role="group" aria-label="Builder view">
        {(["sections", "preview"] as const).map((value) => (
          <button
            key={value}
            type="button"
            aria-pressed={pane === value}
            onClick={() => setPane(value)}
            className={cn(
              "h-9 rounded-md text-sm font-medium capitalize transition-colors",
              pane === value ? "bg-background shadow-sm" : "text-muted-foreground",
            )}
          >
            {value}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[22rem_minmax(0,1fr)] xl:grid-cols-[14rem_minmax(0,1fr)_26rem]">
        <div className={cn("min-w-0 lg:col-start-1 lg:row-start-1", pane === "preview" && "max-lg:hidden")}>
          <SectionRail
            sections={ordered}
            selectedId={selected.section_id}
            reordering={reordering}
            onSelect={setPickedId}
            onMove={move}
            onToggle={(section, enabled) => patchSection(section.section_id, { enabled })}
          />
        </div>

        <div
          className={cn(
            "min-w-0 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-start xl:row-span-1 xl:sticky xl:top-20",
            pane === "sections" && "max-lg:hidden",
          )}
        >
          <SiteCanvas
            template={template}
            sections={ordered}
            selectedId={selected.section_id}
            themeOverride={themeOverride}
            profile={profile}
            onSelect={setPickedId}
          />
        </div>

        <div
          className={cn(
            "min-w-0 lg:col-start-1 lg:row-start-2 xl:col-start-3 xl:row-start-1",
            pane === "preview" && "max-lg:hidden",
          )}
        >
          <SectionPanel
            // Remount per section so tab-local state never leaks between sections.
            key={selected.section_id}
            context={{
              section: selected,
              sections: ordered,
              components,
              catalogLoading,
              template,
              themeOverride,
              profile,
              patchSection: (data, failure) => patchSection(selected.section_id, data, failure),
              openContentEditor: () => setEditing(selected),
            }}
          />
        </div>
      </div>

      <SectionContentDialog
        section={editing}
        onOpenChange={(open) => {
          if (!open) setEditing(null);
        }}
      />
    </div>
  );
}
