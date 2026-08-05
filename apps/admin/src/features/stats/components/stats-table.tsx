"use client";

import { DataTable } from "@mongkolka/ui/data-table";
import type { Stat } from "../data/schema";
import { statsColumns } from "./stats-columns";

export function StatsTable({ data }: { data: Stat[] }) {
  return <DataTable columns={statsColumns} data={data} searchKey="label" searchPlaceholder="Filter by label…" />;
}
