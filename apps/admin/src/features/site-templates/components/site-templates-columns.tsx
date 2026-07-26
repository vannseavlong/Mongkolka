import { type ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@mongkolka/ui/data-table";
import type { SiteTemplate } from "../data/schema";
import { SiteTemplateActiveCell } from "./site-template-active-cell";
import { SiteTemplatesRowActions } from "./site-templates-row-actions";

export const siteTemplatesColumns: ColumnDef<SiteTemplate>[] = [
  {
    id: "preview",
    header: "Preview",
    cell: ({ row }) => (
      <div
        className="size-8 rounded-full border"
        style={{
          backgroundColor: row.original.default_theme.bg_color,
          borderColor: row.original.default_theme.accent_color,
        }}
      />
    ),
  },
  {
    accessorKey: "template_id",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Template ID" />,
    cell: ({ row }) => <span className="font-mono text-sm">{row.getValue("template_id")}</span>,
  },
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Active" />,
    cell: ({ row }) => <SiteTemplateActiveCell template={row.original} />,
  },
  {
    id: "actions",
    cell: SiteTemplatesRowActions,
  },
];
