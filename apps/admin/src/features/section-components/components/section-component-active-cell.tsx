"use client";

import { toast } from "sonner";
import { mutate } from "swr";
import { Switch } from "@mongkolka/ui/switch";
import { api, ApiError } from "@/lib/api";
import type { SectionComponent } from "../data/schema";

export function SectionComponentActiveCell({ component }: { component: SectionComponent }) {
  async function toggle(checked: boolean) {
    try {
      await api.patch(`/admin/api/section-components/${component.component_id}`, {
        status: checked ? "active" : "inactive",
      });
      mutate("/admin/api/section-components");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to update component");
    }
  }

  return <Switch checked={component.status === "active"} onCheckedChange={toggle} />;
}
