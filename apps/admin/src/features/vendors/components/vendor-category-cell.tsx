"use client";

import { useApiQuery } from "@/lib/use-api-query";
import type { VendorCategory } from "@/features/vendor-categories/data/schema";

export function VendorCategoryCell({ categoryId }: { categoryId: string | null }) {
  const { data } = useApiQuery<{ categories: VendorCategory[] }>("/admin/api/vendor-categories");
  if (!categoryId) return <span>—</span>;
  const category = data?.categories.find((c) => c.category_id === categoryId);
  return <span>{category?.label_en ?? "—"}</span>;
}
