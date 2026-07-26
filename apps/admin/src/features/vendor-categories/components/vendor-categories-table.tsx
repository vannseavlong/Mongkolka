"use client";

import { DataTable } from "@mongkolka/ui/data-table";
import type { VendorCategory } from "../data/schema";
import { vendorCategoriesColumns } from "./vendor-categories-columns";

export function VendorCategoriesTable({ data }: { data: VendorCategory[] }) {
  return (
    <DataTable
      columns={vendorCategoriesColumns}
      data={data}
      searchKey="label_en"
      searchPlaceholder="Filter by label…"
    />
  );
}
