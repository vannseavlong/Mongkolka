"use client";

import { DataTable } from "@mongkolka/ui/data-table";
import type { Service } from "../data/schema";
import { servicesColumns } from "./services-columns";

export function ServicesTable({ data }: { data: Service[] }) {
  return <DataTable columns={servicesColumns} data={data} searchKey="name" searchPlaceholder="Filter by name…" />;
}
