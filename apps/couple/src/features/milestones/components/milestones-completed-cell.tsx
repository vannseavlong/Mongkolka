"use client";

import { toast } from "sonner";
import { mutate } from "swr";
import { Checkbox } from "@mongkolka/ui/checkbox";
import { api, ApiError } from "@/lib/api";
import type { Milestone } from "../data/schema";

export function MilestonesCompletedCell({ milestone }: { milestone: Milestone }) {
  async function toggle(checked: boolean) {
    try {
      await api.patch(`/couple/api/milestones/${milestone.milestone_id}`, { completed: checked });
      mutate("/couple/api/milestones");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to update milestone");
    }
  }

  return (
    <Checkbox
      checked={milestone.completed}
      onCheckedChange={(checked) => toggle(checked === true)}
    />
  );
}
