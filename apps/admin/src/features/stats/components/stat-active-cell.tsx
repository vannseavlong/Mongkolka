"use client";

import { toast } from "sonner";
import { mutate } from "swr";
import { Switch } from "@mongkolka/ui/switch";
import { api, ApiError } from "@/lib/api";
import type { Stat } from "../data/schema";

export function StatActiveCell({ stat }: { stat: Stat }) {
  async function toggle(checked: boolean) {
    try {
      await api.patch(`/admin/api/stats/${stat.stat_id}`, { active: checked });
      mutate("/admin/api/stats");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to update stat");
    }
  }

  return <Switch checked={stat.active} onCheckedChange={toggle} />;
}
