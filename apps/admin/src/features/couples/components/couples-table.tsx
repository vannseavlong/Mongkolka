"use client";

import { DataTable } from "@mongkolka/ui/data-table";
import type { Couple } from "../data/schema";
import { couplesColumns } from "./couples-columns";

export function CouplesTable({ data }: { data: Couple[] }) {
  return (
    <DataTable
      columns={couplesColumns}
      data={data}
      searchKey="partner1"
      searchPlaceholder="Filter by partner name…"
      filters={[
        {
          columnId: "status",
          title: "Status",
          options: [
            { label: "Pending", value: "pending" },
            { label: "Active", value: "active" },
            { label: "Suspended", value: "suspended" },
            { label: "Rejected", value: "rejected" },
          ],
        },
      ]}
    />
  );
}
