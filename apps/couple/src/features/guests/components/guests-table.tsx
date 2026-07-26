"use client";

import { DataTable } from "@mongkolka/ui/data-table";
import type { Guest } from "../data/schema";
import { guestsColumns } from "./guests-columns";

export function GuestsTable({ data }: { data: Guest[] }) {
  return (
    <DataTable columns={guestsColumns} data={data} searchKey="name" searchPlaceholder="Filter by name…" />
  );
}
