"use client";

import { toast } from "sonner";
import { mutate } from "swr";
import { Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@mongkolka/ui/card";
import { api, ApiError } from "@/lib/api";
import { cn } from "@mongkolka/ui/utils";
import type { SiteTemplate } from "../data/schema";

export function TemplatePicker({
  templates,
  selectedTemplateId,
}: {
  templates: SiteTemplate[];
  selectedTemplateId: string | null;
}) {
  async function selectTemplate(templateId: string) {
    try {
      await api.post("/couple/api/website/template", { template_id: templateId });
      toast.success("Template selected");
      mutate("/couple/api/website/settings");
      mutate("/couple/api/website/sections");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to select template");
    }
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {templates.map((template) => {
        const selected = template.template_id === selectedTemplateId;
        return (
          <Card
            key={template.template_id}
            role="button"
            tabIndex={0}
            onClick={() => selectTemplate(template.template_id)}
            className={cn("cursor-pointer transition-colors", selected && "ring-2 ring-primary")}
          >
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">{template.name}</CardTitle>
              {selected && <Check className="size-4 text-primary" />}
            </CardHeader>
            <CardContent>
              <div className="flex h-8 overflow-hidden rounded-md border">
                <div className="flex-1" style={{ backgroundColor: template.default_theme.bg_color }} />
                <div className="flex-1" style={{ backgroundColor: template.default_theme.text_color }} />
                <div className="flex-1" style={{ backgroundColor: template.default_theme.accent_color }} />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
