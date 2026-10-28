"use client";

import { useState } from "react";
import { toast } from "sonner";
import { mutate } from "swr";
import { Check, ExternalLink } from "lucide-react";
import { Badge } from "@mongkolka/ui/badge";
import { Button } from "@mongkolka/ui/button";
import { api, ApiError } from "@/lib/api";
import { siteOrigin } from "@/lib/site-url";
import { cn } from "@mongkolka/ui/utils";
import type { SiteTemplate } from "../data/schema";
import { TemplateApplyDialog, type ApplyMode } from "./template-apply-dialog";
import { TemplateThumbnail } from "./template-thumbnail";

export function TemplatePicker({
  templates,
  selectedTemplateId,
}: {
  templates: SiteTemplate[];
  selectedTemplateId: string | null;
}) {
  // One request in flight at a time: a rapid double-click used to fire the
  // template POST twice, racing on the couple_profile bootstrap. Buttons use
  // aria-disabled (not `disabled`) so a focused button keeps focus while pending.
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [confirming, setConfirming] = useState<SiteTemplate | null>(null);

  async function apply(template: SiteTemplate, mode: ApplyMode) {
    if (pendingId) return;
    setPendingId(template.template_id);
    try {
      await api.post("/couple/api/website/template", { template_id: template.template_id, mode });
      // The apply response has no sections: refetch both so the canvas refreshes.
      await Promise.all([mutate("/couple/api/website/settings"), mutate("/couple/api/website/sections")]);
      toast.success(`Now using ${template.name}`);
      setConfirming(null);
    } catch (err) {
      // Nothing was refetched, so the previous template and content stay on screen.
      toast.error(err instanceof ApiError ? err.message : "Failed to apply template");
    } finally {
      setPendingId(null);
    }
  }

  function choose(template: SiteTemplate) {
    if (pendingId || template.template_id === selectedTemplateId) return;
    // First pick has nothing to lose, so it applies directly.
    if (selectedTemplateId === null) void apply(template, "keep_content");
    else setConfirming(template);
  }

  return (
    <>
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {templates.map((template) => {
          const selected = template.template_id === selectedTemplateId;
          const isPending = pendingId === template.template_id;
          const theme = template.default_theme;
          return (
            <li
              key={template.template_id}
              className={cn("flex flex-col gap-3 rounded-lg border bg-card p-3", selected && "ring-2 ring-primary")}
            >
              <TemplateThumbnail template={template} />
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-base font-semibold">{template.name}</h3>
                {selected && (
                  <Badge>
                    <Check className="size-3" /> Selected
                  </Badge>
                )}
              </div>
              {template.description && <p className="text-sm text-muted-foreground">{template.description}</p>}
              <div className="flex h-5 overflow-hidden rounded-md border" aria-hidden="true">
                {[theme.bg_color, theme.text_color, theme.accent_color].map((color, i) => (
                  <div key={i} className="flex-1" style={{ backgroundColor: color }} />
                ))}
              </div>
              <div className="mt-auto flex flex-wrap gap-2">
                {template.slug && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={siteOrigin(template.slug)} target="_blank" rel="noopener noreferrer">
                      Preview <ExternalLink className="size-3.5" />
                      <span className="sr-only"> {template.name} (opens in a new tab)</span>
                    </a>
                  </Button>
                )}
                <Button
                  size="sm"
                  variant={selected ? "secondary" : "default"}
                  aria-disabled={pendingId !== null || selected}
                  aria-pressed={selected}
                  className={cn((pendingId !== null || selected) && "opacity-60")}
                  onClick={() => choose(template)}
                >
                  {selected ? "Current template" : isPending ? "Applying..." : "Use this template"}
                </Button>
              </div>
            </li>
          );
        })}
      </ul>
      {confirming && (
        <TemplateApplyDialog
          templateName={confirming.name}
          pending={pendingId !== null}
          onCancel={() => setConfirming(null)}
          onConfirm={(mode) => apply(confirming, mode)}
        />
      )}
    </>
  );
}
