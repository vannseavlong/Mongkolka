"use client";

import { useState } from "react";
import { toast } from "sonner";
import { mutate } from "swr";
import { ArrowDown, ArrowUp, Pencil } from "lucide-react";
import { resolveTheme, type PartialTheme, type SiteRendererTemplate } from "@mongkolka/templates";
import { Switch } from "@mongkolka/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@mongkolka/ui/select";
import { Button } from "@mongkolka/ui/button";
import { api, ApiError } from "@/lib/api";
import type { SectionComponent, WebsiteSection } from "../data/schema";
import type { PreviewProfile } from "../lib/build-content";
import { CONTENT_EDITABLE_SECTIONS, SectionContentDialog } from "./section-content-dialog";
import { SectionColorPopover } from "./section-color-popover";
import { SectionPreview } from "./section-preview";

const SECTIONS_KEY = "/couple/api/website/sections";
const TEMPLATE_DEFAULT = "__template_default__";

export function SectionsList({
  sections,
  components,
  template,
  themeOverride,
  profile,
}: {
  sections: WebsiteSection[];
  components: SectionComponent[];
  /** The couple's selected template — used to resolve each row's live preview
   * and its "no override" starting colors. */
  template: SiteRendererTemplate;
  themeOverride: PartialTheme | null;
  profile: PreviewProfile;
}) {
  const [editingSection, setEditingSection] = useState<WebsiteSection | null>(null);
  // Guards the arrow buttons against a rapid double-click firing a second
  // reorder before the first round trip (and its Sheets-backed writes)
  // resolves — see move() below for why that's worth avoiding.
  const [reordering, setReordering] = useState(false);
  const ordered = [...sections].sort((a, b) => a.display_order - b.display_order);

  // Every toggle/select/reorder here used to wait a full round trip before
  // updating anything on screen — against a Sheets-backed API that's exactly
  // what read as "laggy". These now update the local SWR cache immediately
  // (revalidate: false) and only re-sync with the server once the request
  // settles, succeed or fail — a failure's re-sync is what rolls the
  // optimistic guess back if the write didn't actually happen.
  async function patchSection(sectionId: string, data: Record<string, unknown>) {
    const optimistic = ordered.map((s) => (s.section_id === sectionId ? { ...s, ...data } : s));
    mutate(SECTIONS_KEY, { sections: optimistic }, { revalidate: false });
    try {
      await api.patch(`/couple/api/website/sections/${sectionId}`, data);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to update section");
    } finally {
      mutate(SECTIONS_KEY);
    }
  }

  async function move(index: number, direction: -1 | 1) {
    if (reordering) return;
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= ordered.length) return;
    const reordered = [...ordered];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, moved);
    const optimistic = reordered.map((s, i) => ({ ...s, display_order: i }));
    mutate(SECTIONS_KEY, { sections: optimistic }, { revalidate: false });
    setReordering(true);
    try {
      await api.post("/couple/api/website/sections/reorder", {
        section_ids: reordered.map((s) => s.section_id),
      });
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to reorder sections");
    } finally {
      mutate(SECTIONS_KEY);
      setReordering(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {ordered.map((section, index) => {
        const options = components.filter((c) => c.section === section.section_key);
        // What this section would resolve to with no override of its own —
        // template default cascaded through the couple's whole-site override
        // (see packages/templates/src/theme.ts) — used both to pre-fill the
        // color popover and to render the live preview.
        const effectiveTheme = resolveTheme(template.default_theme, themeOverride, null);
        return (
          <div key={section.section_id} className="flex flex-wrap items-center gap-3 rounded-lg border p-3">
            <div className="flex flex-col">
              <Button
                size="icon"
                variant="ghost"
                className="size-5"
                disabled={index === 0 || reordering}
                onClick={() => move(index, -1)}
              >
                <ArrowUp className="size-3" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="size-5"
                disabled={index === ordered.length - 1 || reordering}
                onClick={() => move(index, 1)}
              >
                <ArrowDown className="size-3" />
              </Button>
            </div>
            <SectionPreview section={section} template={template} themeOverride={themeOverride} profile={profile} />
            <span className="w-24 shrink-0 text-sm font-medium capitalize">{section.section_key}</span>
            <Select
              value={section.component_id ?? TEMPLATE_DEFAULT}
              onValueChange={(value) =>
                patchSection(section.section_id, {
                  component_id: value === TEMPLATE_DEFAULT ? null : value,
                })
              }
            >
              <SelectTrigger size="sm" className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={TEMPLATE_DEFAULT}>Template default</SelectItem>
                {options.map((component) => (
                  <SelectItem key={component.component_id} value={component.component_id}>
                    {component.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {CONTENT_EDITABLE_SECTIONS.includes(section.section_key) && (
              <Button size="sm" variant="outline" onClick={() => setEditingSection(section)}>
                <Pencil className="size-3" /> Edit content
              </Button>
            )}
            <SectionColorPopover section={section} effectiveTheme={effectiveTheme} />
            <Switch
              checked={section.enabled}
              onCheckedChange={(checked) => patchSection(section.section_id, { enabled: checked })}
              className="ml-auto"
            />
          </div>
        );
      })}
      <SectionContentDialog
        section={editingSection}
        onOpenChange={(open) => {
          if (!open) setEditingSection(null);
        }}
      />
    </div>
  );
}
