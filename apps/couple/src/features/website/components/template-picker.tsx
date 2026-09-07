"use client";

import { useState } from "react";
import { toast } from "sonner";
import { mutate } from "swr";
import { Check, Loader2 } from "lucide-react";
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
  // Tracks the one request in flight (if any) so the whole grid can be
  // disabled while it resolves — a rapid double-click used to fire the
  // template-select POST twice, racing on the couple_profile bootstrap
  // (see couple-website.service.ts). Also lets the clicked card show
  // its own spinner instead of the picker just sitting there looking stuck.
  const [pendingId, setPendingId] = useState<string | null>(null);

  async function selectTemplate(templateId: string) {
    if (pendingId || templateId === selectedTemplateId) return;
    setPendingId(templateId);
    try {
      await api.post("/couple/api/website/template", { template_id: templateId });
      toast.success("Template selected");
      await Promise.all([mutate("/couple/api/website/settings"), mutate("/couple/api/website/sections")]);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to select template");
    } finally {
      setPendingId(null);
    }
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {templates.map((template) => {
        const selected = template.template_id === selectedTemplateId;
        const isPending = pendingId === template.template_id;
        return (
          <Card
            key={template.template_id}
            role="button"
            tabIndex={0}
            aria-disabled={pendingId !== null}
            onClick={() => selectTemplate(template.template_id)}
            className={cn(
              "cursor-pointer transition-colors",
              selected && "ring-2 ring-primary",
              pendingId !== null && pendingId !== template.template_id && "pointer-events-none opacity-50",
            )}
          >
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">{template.name}</CardTitle>
              {isPending ? (
                <Loader2 className="size-4 animate-spin text-muted-foreground" />
              ) : (
                selected && <Check className="size-4 text-primary" />
              )}
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
