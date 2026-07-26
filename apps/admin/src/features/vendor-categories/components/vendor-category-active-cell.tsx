"use client";

import { toast } from "sonner";
import { mutate } from "swr";
import { Switch } from "@mongkolka/ui/switch";
import { api, ApiError } from "@/lib/api";
import type { VendorCategory } from "../data/schema";

export function VendorCategoryActiveCell({ category }: { category: VendorCategory }) {
  async function toggle(checked: boolean) {
    try {
      await api.patch(`/admin/api/vendor-categories/${category.category_id}`, { active: checked });
      mutate("/admin/api/vendor-categories");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to update category");
    }
  }

  return <Switch checked={category.active} onCheckedChange={toggle} />;
}
