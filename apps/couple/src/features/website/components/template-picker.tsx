"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { mutate } from "swr";
import { Check, ExternalLink } from "lucide-react";
import { Badge } from "@mongkolka/ui/badge";
import { Button } from "@mongkolka/ui/button";
import { Skeleton } from "@mongkolka/ui/skeleton";
import { api, ApiError } from "@/lib/api";
import { siteOrigin } from "@/lib/site-url";
import { cn } from "@mongkolka/ui/utils";
import type { SiteTemplate } from "../data/schema";
import { TemplateApplyDialog, type ApplyMode } from "./template-apply-dialog";
import { TemplateThumbnail } from "./template-thumbnail";

export function TemplatePicker({
  templates,
  selectedTemplateId,
  templatesLoading = false,
  settingsError = null,
  onRetry,
}: {
  templates: SiteTemplate[];
  /** `undefined` = settings not loaded (or failed): the current template is unknown, so nothing is selectable. */
  selectedTemplateId: string | null | undefined;
  templatesLoading?: boolean;
  settingsError?: string | null;
  onRetry?: () => void;
}) {
  // One request in flight at a time: a rapid double-click used to fire the
  // template POST twice, racing on the couple_profile bootstrap. Buttons use
  // aria-disabled (not `disabled`) so a focused button keeps focus while pending.
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [confirming, setConfirming] = useState<SiteTemplate | null>(null);
  const [dialogError, setDialogError] = useState<string | null>(null);
  const inFlight = useRef(false);
  const opener = useRef<HTMLElement | null>(null);

  async function apply(template: SiteTemplate, mode: ApplyMode) {
    if (inFlight.current) return;
    inFlight.current = true;
    setPendingId(template.template_id);
    setDialogError(null);
    let posted = false;
    try {
      await api.post("/couple/api/website/template", { template_id: template.template_id, mode });
      posted = true;
      // The apply response has no sections. Fetch sections first and settings
      // last so the canvas never pairs the new template with old sections; a
      // failed refetch throws here instead of being swallowed by SWR.
      const sections = await api.get("/couple/api/website/sections");
      const settings = await api.get("/couple/api/website/settings");
      await mutate("/couple/api/website/sections", sections, { revalidate: false });
      await mutate("/couple/api/website/settings", settings, { revalidate: false });
      toast.success(`Now using ${template.name}`);
      setConfirming(null);
    } catch (err) {
      let message: string;
      if (posted) {
        // Applied on the server but we could not reload it: be honest, and try
        // the normal revalidation in the background.
        message = "Template applied, but the page could not refresh. Reload to see it.";
        void mutate("/couple/api/website/sections");
        void mutate("/couple/api/website/settings");
        setConfirming(null);
      } else {
        message = err instanceof ApiError ? err.message : "Failed to apply template";
        setDialogError(message);
      }
      toast.error(message);
    } finally {
      inFlight.current = false;
      setPendingId(null);
    }
  }

  function choose(template: SiteTemplate) {
    if (inFlight.current || selectedTemplateId === undefined || template.template_id === selectedTemplateId) return;
    // First pick has nothing to lose, so it applies directly.
    if (selectedTemplateId === null) void apply(template, "keep_content");
    else {
      opener.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      setConfirming(template);
    }
  }

  if (settingsError) {
    return (
      <div role="alert" className="flex flex-col items-start gap-2 rounded-md border border-destructive/50 p-4 text-sm">
        <p>Could not load your current template: {settingsError}</p>
        {onRetry && (
          <Button size="sm" variant="outline" onClick={onRetry}>
            Try again
          </Button>
        )}
      </div>
    );
  }
  if (templatesLoading || selectedTemplateId === undefined) {
    return (
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2" aria-busy="true" aria-label="Loading templates">
        {[0, 1].map((i) => (
          <Skeleton key={i} className="h-64 w-full" />
        ))}
      </div>
    );
  }
  if (templates.length === 0) {
    return <p className="text-sm text-muted-foreground">No templates are available yet.</p>;
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
          error={dialogError}
          onCloseFocus={() => opener.current?.focus()}
          onCancel={() => {
            setConfirming(null);
            setDialogError(null);
          }}
          onConfirm={(mode) => apply(confirming, mode)}
        />
      )}
    </>
  );
}
