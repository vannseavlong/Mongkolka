"use client";

import { DataTable } from "@mongkolka/ui/data-table";
import type { BudgetCategory } from "../data/schema";
import { budgetColumns } from "./budget-columns";

export function BudgetTable({ data }: { data: BudgetCategory[] }) {
  return (
    <DataTable columns={budgetColumns} data={data} searchKey="name" searchPlaceholder="Filter by name…" />
  );
}
