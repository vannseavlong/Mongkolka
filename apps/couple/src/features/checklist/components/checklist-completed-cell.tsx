"use client";

import { toast } from "sonner";
import { mutate } from "swr";
import { Checkbox } from "@mongkolka/ui/checkbox";
import { api, ApiError } from "@/lib/api";
import type { ChecklistItem } from "../data/schema";

export function ChecklistCompletedCell({ item }: { item: ChecklistItem }) {
  async function toggle(checked: boolean) {
    try {
      await api.patch(`/couple/api/checklist-items/${item.item_id}`, { completed: checked });
      mutate("/couple/api/checklist-items");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to update task");
    }
  }

  return (
    <Checkbox
      checked={item.completed}
      onCheckedChange={(checked) => toggle(checked === true)}
    />
  );
}
