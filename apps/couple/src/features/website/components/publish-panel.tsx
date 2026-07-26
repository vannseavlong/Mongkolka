"use client";

import { toast } from "sonner";
import { mutate } from "swr";
import { Badge } from "@mongkolka/ui/badge";
import { Button } from "@mongkolka/ui/button";
import { api, ApiError } from "@/lib/api";
import type { WebsiteSettings } from "../data/schema";

const SETTINGS_KEY = "/couple/api/website/settings";

export function PublishPanel({ settings }: { settings: WebsiteSettings }) {
  const isPublished = settings.website_status === "published";

  async function toggle() {
    try {
      await api.post(isPublished ? "/couple/api/website/unpublish" : "/couple/api/website/publish");
      toast.success(isPublished ? "Site unpublished" : "Site published");
      mutate(SETTINGS_KEY);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to update website status");
    }
  }

  return (
    <div className="flex items-center justify-between rounded-lg border p-4">
      <div>
        <div className="flex items-center gap-2">
          <Badge variant={isPublished ? "default" : "outline"} className="capitalize">
            {settings.website_status}
          </Badge>
          {settings.slug && <span className="text-sm text-muted-foreground">/{settings.slug}</span>}
        </div>
        {!isPublished && (
          <p className="mt-1 text-sm text-muted-foreground">
            Your site is only visible to you until you publish it.
          </p>
        )}
      </div>
      <Button onClick={toggle} variant={isPublished ? "outline" : "default"}>
        {isPublished ? "Unpublish" : "Publish site"}
      </Button>
    </div>
  );
}
