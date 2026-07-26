"use client";

import { DataTable } from "@mongkolka/ui/data-table";
import type { User } from "../data/schema";
import { usersColumns } from "./users-columns";

export function UsersTable({ data }: { data: User[] }) {
  return (
    <DataTable
      columns={usersColumns}
      data={data}
      searchKey="email"
      searchPlaceholder="Filter by email…"
      filters={[
        {
          columnId: "role",
          title: "Role",
          options: [
            { label: "Admin", value: "admin" },
            { label: "Couple", value: "couple" },
            { label: "Vendor", value: "vendor" },
          ],
        },
        {
          columnId: "status",
          title: "Status",
          options: [
            { label: "Pending", value: "pending" },
            { label: "Active", value: "active" },
            { label: "Inactive", value: "inactive" },
          ],
        },
      ]}
    />
  );
}
