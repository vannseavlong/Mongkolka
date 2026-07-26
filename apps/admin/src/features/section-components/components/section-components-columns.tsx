import { type ColumnDef } from "@tanstack/react-table";
import { Badge } from "@mongkolka/ui/badge";
import { DataTableColumnHeader } from "@mongkolka/ui/data-table";
import type { SectionComponent } from "../data/schema";
import { SectionComponentActiveCell } from "./section-component-active-cell";
import { SectionComponentsRowActions } from "./section-components-row-actions";

export const sectionComponentsColumns: ColumnDef<SectionComponent>[] = [
  {
    id: "preview",
    header: "Preview",
    cell: ({ row }) => (
      <div
        className="size-8 rounded-full border"
        style={{
          backgroundColor: row.original.preview_bg_color ?? undefined,
          borderColor: row.original.preview_accent_color ?? undefined,
        }}
      />
    ),
  },
  {
    accessorKey: "component_id",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Component ID" />,
    cell: ({ row }) => <span className="font-mono text-sm">{row.getValue("component_id")}</span>,
  },
  {
    accessorKey: "section",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Section" />,
    cell: ({ row }) => <Badge variant="outline">{row.getValue("section")}</Badge>,
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
  },
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Active" />,
    cell: ({ row }) => <SectionComponentActiveCell component={row.original} />,
  },
  {
    id: "actions",
    cell: SectionComponentsRowActions,
  },
];
