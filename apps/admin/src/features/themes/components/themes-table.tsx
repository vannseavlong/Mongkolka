"use client";

import { DataTable } from "@mongkolka/ui/data-table";
import type { Theme } from "../data/schema";
import { themesColumns } from "./themes-columns";

export function ThemesTable({ data }: { data: Theme[] }) {
  return (
    <DataTable columns={themesColumns} data={data} searchKey="name" searchPlaceholder="Filter by name…" />
  );
}
