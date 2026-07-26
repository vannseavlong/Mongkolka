"use client";

import { DataTable } from "@mongkolka/ui/data-table";
import type { ChecklistItem } from "../data/schema";
import { checklistColumns } from "./checklist-columns";

export function ChecklistTable({ data }: { data: ChecklistItem[] }) {
  return (
    <DataTable
      columns={checklistColumns}
      data={data}
      searchKey="text"
      searchPlaceholder="Filter by task…"
    />
  );
}
