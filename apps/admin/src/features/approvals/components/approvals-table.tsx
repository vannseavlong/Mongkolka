"use client";

import { DataTable } from "@mongkolka/ui/data-table";
import type { User } from "@/features/users/data/schema";
import { approvalsColumns } from "./approvals-columns";

export function ApprovalsTable({ data }: { data: User[] }) {
  return (
    <DataTable
      columns={approvalsColumns}
      data={data}
      searchKey="email"
      searchPlaceholder="Filter by email…"
      filters={[
        {
          columnId: "role",
          title: "Role",
          options: [
            { label: "Couple", value: "couple" },
            { label: "Vendor", value: "vendor" },
          ],
        },
      ]}
    />
  );
}
