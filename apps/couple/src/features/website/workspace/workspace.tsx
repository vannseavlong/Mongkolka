"use client";

import { useState, type ReactNode } from "react";
import type { PartialTheme } from "@mongkolka/templates";
import { cn } from "@mongkolka/ui/utils";
import type { SectionComponent, SiteLanguage, SiteTemplate, WebsiteSection } from "../data/schema";
import type { PreviewProfile } from "../lib/build-content";
import { ContentPanel } from "./content-panel";
import { listStyleVariants } from "../lib/style-variants";
import { Inspector, type InspectorTab } from "./inspector";
import { SectionDock } from "./section-dock";
import { SectionRail } from "./section-rail";
import { SiteCanvas } from "./site-canvas";
import { useSectionActions } from "./use-section-actions";
import { UploadDock } from "../components/upload-dock";

/** Below xl one pane shows at a time; at xl all of them are on screen. */
type Pane = "sections" | "preview" | "content" | "style" | "colors";
const PANES: { value: Pane; label: string }[] = [
  { value: "sections", label: "Sections" },
  { value: "preview", label: "Preview" },
  { value: "content", label: "Content" },
  { value: "style", label: "Style" },
  { value: "colors", label: "Design" },
];

/**
 * Builder workspace, CapCut-style: sections on the left, the live preview in
 * the middle, the selected section's content form and the site colors on the
 * right, and the section's look (style, images, own colors) in a dock under
 * the preview. Each area scrolls on its own; the page never does.
 */
export function Workspace({
  sections,
  components,
  catalogLoading,
  template,
  themeOverride,
  profile,
  colors,
  onChooseTemplate,
  defaultLanguage,
}: {
  sections: WebsiteSection[];
  components: SectionComponent[];
  catalogLoading: boolean;
  template: SiteTemplate;
  /** Includes unsaved color drafts so the canvas reflects them immediately. */
  themeOverride: PartialTheme | null;
  profile: PreviewProfile;
  /** Site-wide colors / palette editor, shown on the Colors tab. */
  colors: ReactNode;
  onChooseTemplate: () => void;
  defaultLanguage: SiteLanguage;
}) {
  const ordered = [...sections].sort((a, b) => a.display_order - b.display_order);
  const [pickedId, setPickedId] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [pane, setPane] = useState<Pane>("preview");
  const [rightTab, setRightTab] = useState<InspectorTab>("content");
  const { patchSection, move, reordering, pending, announcement } = useSectionActions(ordered);

  // Picking from the list opens its content on small screens; picking inside the
  // preview just selects, so the couple stays where they are.
  const pickFromList = (sectionId: string) => {
    setPickedId(sectionId);
    setRightTab("content");
    setPane("content");
  };
  const pickFromCanvas = (sectionId: string) => {
    setPickedId(sectionId);
    setRightTab("content");
  };
  const choosePane = (value: Pane) => {
    setPane(value);
    if (value === "content" || value === "colors") setRightTab(value);
  };

  // Falls back to the first section until one is picked (or if it was removed).
  const selected = ordered.find((s) => s.section_id === pickedId) ?? ordered[0] ?? null;

  if (!selected) {
    return <p className="p-4 text-sm text-muted-foreground">This website has no sections yet.</p>;
  }

  const rightVisible = pane === "content" || pane === "colors";

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="grid shrink-0 grid-cols-5 gap-1 border-b bg-muted/50 p-1 xl:hidden" role="group" aria-label="Builder view">
        {PANES.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            aria-pressed={pane === value}
            onClick={() => choosePane(value)}
            className={cn(
              "h-9 rounded-md text-xs font-medium transition-colors sm:text-sm",
              pane === value ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-1 grid-rows-[minmax(0,1fr)] xl:grid-cols-[16rem_minmax(0,1fr)_24rem] xl:grid-rows-[minmax(0,1fr)_auto]">
        <aside className={cn("min-h-0 overflow-y-auto border-r p-3 xl:col-start-1 xl:row-start-1", pane !== "sections" && "max-xl:hidden")}>
          <h2 className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Sections</h2>
          <SectionRail
            sections={ordered}
            selectedId={selected.section_id}
            reordering={reordering}
            pending={pending}
            onSelect={pickFromList}
            onMove={move}
            onToggle={(section, enabled) => patchSection(section.section_id, { enabled })}
          />
          <p role="status" aria-live="polite" className="sr-only">
            {announcement}
          </p>
        </aside>

        <section className={cn("min-h-0 min-w-0 bg-muted/40 xl:col-start-2 xl:row-start-1", pane !== "preview" && "max-xl:hidden")}>
          <SiteCanvas
            template={template}
            sections={ordered}
            selectedId={selected.section_id}
            themeOverride={themeOverride}
            profile={profile}
            onSelect={pickFromCanvas}
            templateName={template.name}
            onChooseTemplate={onChooseTemplate}
            defaultLanguage={defaultLanguage}
          />
        </section>

        <aside
          className={cn(
            "min-h-0 min-w-0 border-t bg-background xl:col-span-2 xl:col-start-1 xl:row-start-2",
            collapsed ? "xl:h-auto" : "xl:h-[min(20rem,38svh)]",
            pane !== "style" && "max-xl:hidden",
          )}
        >
          <SectionDock
            collapsed={collapsed}
            onToggleCollapsed={() => setCollapsed((c) => !c)}
            context={{
              section: selected,
              sections: ordered,
              components,
              catalogLoading,
              template,
              themeOverride,
              profile,
              patchSection: (data, failure) => patchSection(selected.section_id, data, failure),
              openContentEditor: () => setRightTab("content"),
            }}
          />
        </aside>

        <aside
          className={cn(
            "min-h-0 min-w-0 border-l bg-background xl:col-start-3 xl:row-span-2 xl:row-start-1",
            !rightVisible && "max-xl:hidden",
          )}
        >
          <Inspector
            tab={rightTab}
            onTabChange={setRightTab}
            content={<ContentPanel section={selected} profile={profile} galleryLayouts={selected.section_key === "gallery" ? listStyleVariants(selected, components, template.default_components).variants.map((v) => ({ id: v.component_id, label: v.name })) : undefined} saveTitle={(title) => patchSection(selected.section_id, { title }, "Could not save the title")} />}
            colors={colors}
          />
        </aside>
      </div>
      <UploadDock />
    </div>
  );
}
