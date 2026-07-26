"use client";

import { toast } from "sonner";
import { mutate } from "swr";
import { Switch } from "@mongkolka/ui/switch";
import { api, ApiError } from "@/lib/api";
import type { SiteTemplate } from "../data/schema";

export function SiteTemplateActiveCell({ template }: { template: SiteTemplate }) {
  async function toggle(checked: boolean) {
    try {
      await api.patch(`/admin/api/site-templates/${template.template_id}`, {
        status: checked ? "active" : "inactive",
      });
      mutate("/admin/api/site-templates");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to update template");
    }
  }

  return <Switch checked={template.status === "active"} onCheckedChange={toggle} />;
}
