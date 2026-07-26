"use client";

import { toast } from "sonner";
import { mutate } from "swr";
import { ArrowDown, ArrowUp } from "lucide-react";
import { Switch } from "@mongkolka/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@mongkolka/ui/select";
import { Button } from "@mongkolka/ui/button";
import { api, ApiError } from "@/lib/api";
import type { SectionComponent, WebsiteSection } from "../data/schema";

const SECTIONS_KEY = "/couple/api/website/sections";
const TEMPLATE_DEFAULT = "__template_default__";

export function SectionsList({
  sections,
  components,
}: {
  sections: WebsiteSection[];
  components: SectionComponent[];
}) {
  const ordered = [...sections].sort((a, b) => a.display_order - b.display_order);

  async function patchSection(sectionId: string, data: Record<string, unknown>) {
    try {
      await api.patch(`/couple/api/website/sections/${sectionId}`, data);
      mutate(SECTIONS_KEY);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to update section");
    }
  }

  async function move(index: number, direction: -1 | 1) {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= ordered.length) return;
    const reordered = [...ordered];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, moved);
    try {
      await api.post("/couple/api/website/sections/reorder", {
        section_ids: reordered.map((s) => s.section_id),
      });
      mutate(SECTIONS_KEY);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to reorder sections");
    }
  }

  return (
    <div className="flex flex-col gap-2">
      {ordered.map((section, index) => {
        const options = components.filter((c) => c.section === section.section_key);
        return (
          <div key={section.section_id} className="flex items-center gap-3 rounded-lg border p-3">
            <div className="flex flex-col">
              <Button
                size="icon"
                variant="ghost"
                className="size-5"
                disabled={index === 0}
                onClick={() => move(index, -1)}
              >
                <ArrowUp className="size-3" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="size-5"
                disabled={index === ordered.length - 1}
                onClick={() => move(index, 1)}
              >
                <ArrowDown className="size-3" />
              </Button>
            </div>
            <span className="w-24 shrink-0 text-sm font-medium capitalize">{section.section_key}</span>
            <Select
              value={section.component_id ?? TEMPLATE_DEFAULT}
              onValueChange={(value) =>
                patchSection(section.section_id, {
                  component_id: value === TEMPLATE_DEFAULT ? null : value,
                })
              }
            >
              <SelectTrigger size="sm" className="flex-1">
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
            <Switch
              checked={section.enabled}
              onCheckedChange={(checked) => patchSection(section.section_id, { enabled: checked })}
            />
          </div>
        );
      })}
    </div>
  );
}
