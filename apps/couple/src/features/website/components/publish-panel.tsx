"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Copy, ExternalLink } from "lucide-react";
import { mutate } from "swr";
import { Badge } from "@mongkolka/ui/badge";
import { Button } from "@mongkolka/ui/button";
import { api, ApiError } from "@/lib/api";
import { siteOrigin } from "@/lib/site-url";
import type { WebsiteSettings } from "../data/schema";
import { SlugEditor } from "./slug-editor";

const SETTINGS_KEY = "/couple/api/website/settings";

export function PublishPanel({ settings }: { settings: WebsiteSettings }) {
  const isPublished = settings.website_status === "published";

  const [busy, setBusy] = useState(false);
  const url = settings.slug ? siteOrigin(settings.slug) : null;

  async function copyLink() {
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied");
    } catch {
      toast.error("Couldn't copy, select the link and copy it manually");
    }
  }

  async function toggle() {
    if (busy) return;
    setBusy(true);
    try {
      await api.post(isPublished ? "/couple/api/website/unpublish" : "/couple/api/website/publish");
      toast.success(isPublished ? "Site unpublished" : "Site published");
      mutate(SETTINGS_KEY);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to update website status");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-w-0 items-center gap-x-3">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2" title={isPublished ? undefined : "Your site is only visible to you until you publish it."}>
          <Badge variant={isPublished ? "default" : "outline"} className="capitalize">
            {settings.website_status}
          </Badge>
          <SlugEditor slug={settings.slug} />
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2 sm:ml-auto">
        {isPublished && url && (
          <Button variant="outline" size="icon" onClick={copyLink}>
            <Copy className="size-4" />
            <span className="sr-only">Copy site link</span>
          </Button>
        )}
        {isPublished && (
          <Button onClick={toggle} disabled={busy} variant="outline">
            Unpublish
          </Button>
        )}
        {isPublished && url ? (
          <Button asChild>
            <a href={url} target="_blank" rel="noreferrer">
              <ExternalLink className="size-4" /> View site
            </a>
          </Button>
        ) : (
          !isPublished && (
            <Button onClick={toggle} disabled={busy}>
              Publish site
            </Button>
          )
        )}
      </div>
    </div>
  );
}
