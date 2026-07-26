"use client";

import { DataTable } from "@mongkolka/ui/data-table";
import type { Vendor } from "../data/schema";
import { vendorsColumns } from "./vendors-columns";

export function VendorsTable({ data }: { data: Vendor[] }) {
  return (
    <DataTable
      columns={vendorsColumns}
      data={data}
      searchKey="business_name"
      searchPlaceholder="Filter by business name…"
      filters={[
        {
          columnId: "status",
          title: "Status",
          options: [
            { label: "Pending", value: "pending" },
            { label: "Active", value: "active" },
            { label: "Inactive", value: "inactive" },
            { label: "Rejected", value: "rejected" },
          ],
        },
      ]}
    />
  );
}
