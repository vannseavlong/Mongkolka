"use client";

import { DataTable } from "@mongkolka/ui/data-table";
import type { SectionComponent } from "../data/schema";
import { WEBSITE_SECTIONS } from "../data/schema";
import { sectionComponentsColumns } from "./section-components-columns";

export function SectionComponentsTable({ data }: { data: SectionComponent[] }) {
  return (
    <DataTable
      columns={sectionComponentsColumns}
      data={data}
      searchKey="name"
      searchPlaceholder="Filter by name…"
      filters={[
        {
          columnId: "section",
          title: "Section",
          options: WEBSITE_SECTIONS.map((section) => ({ label: section, value: section })),
        },
      ]}
    />
  );
}
