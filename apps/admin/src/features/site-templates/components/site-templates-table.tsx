"use client";

import { DataTable } from "@mongkolka/ui/data-table";
import type { SiteTemplate } from "../data/schema";
import { siteTemplatesColumns } from "./site-templates-columns";

export function SiteTemplatesTable({ data }: { data: SiteTemplate[] }) {
  return (
    <DataTable columns={siteTemplatesColumns} data={data} searchKey="name" searchPlaceholder="Filter by name…" />
  );
}
