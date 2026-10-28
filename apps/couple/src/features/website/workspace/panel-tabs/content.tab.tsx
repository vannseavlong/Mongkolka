"use client";

import { Pencil } from "lucide-react";
import { useApiQuery } from "@/lib/use-api-query";
import type { WebsiteSettings } from "../../data/schema";
import { resolveTheme } from "@mongkolka/templates";
import { Button } from "@mongkolka/ui/button";
import { SectionColorPopover } from "../../components/section-color-popover";
import { CONTENT_EDITABLE_SECTIONS } from "../../components/section-content-dialog";
import type { SectionPanelTab } from "./types";

export const tab: SectionPanelTab = {
  id: "content",
  label: "Content",
  order: 20,
  Component: ({ context }) => {
    const { section, template, themeOverride, openContentEditor } = context;
    // What this section resolves to with no override of its own, used to
    // pre-fill the color popover.
    // Uses the SAVED site theme (not the unsaved draft) so the popover prunes
    // against the same baseline as the Colors tab.
    const { data: settingsData } = useApiQuery<{ settings: WebsiteSettings }>("/couple/api/website/settings");
    const saved = settingsData ? (settingsData.settings.theme_override ?? null) : themeOverride;
    const effectiveTheme = resolveTheme(template.default_theme, saved, null);
    return (
      <div className="flex flex-col items-start gap-4">
        {CONTENT_EDITABLE_SECTIONS.includes(section.section_key) ? (
          <Button variant="outline" onClick={openContentEditor}>
            <Pencil className="size-4" /> Edit content
          </Button>
        ) : (
          <p className="text-sm text-muted-foreground">
            This section uses your profile details. Edit them on the Profile page.
          </p>
        )}
        <SectionColorPopover section={section} effectiveTheme={effectiveTheme} />
      </div>
    );
  },
};
