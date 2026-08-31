"use client";

import { useMemo } from "react";
import { DataTable } from "@mongkolka/ui/data-table";
import type { BudgetCategory } from "@/features/budget/data/schema";
import type { ChecklistItem } from "../data/schema";
import { getChecklistColumns } from "./checklist-columns";

export function ChecklistTable({ data, categories }: { data: ChecklistItem[]; categories: BudgetCategory[] }) {
  const columns = useMemo(() => getChecklistColumns(categories), [categories]);

  return (
    <DataTable columns={columns} data={data} searchKey="text" searchPlaceholder="Filter by task…" />
  );
}
