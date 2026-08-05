import { type ColumnDef } from "@tanstack/react-table";
import { Badge } from "@mongkolka/ui/badge";
import { DataTableColumnHeader } from "@mongkolka/ui/data-table";
import type { Theme } from "../data/schema";
import { ThemesRowActions } from "./themes-row-actions";

export const themesColumns: ColumnDef<Theme>[] = [
  {
    id: "preview",
    header: "Preview",
    cell: ({ row }) => {
      const { tokens } = row.original;
      return (
        <div className="flex items-center gap-1">
          <span
            className="size-4 rounded-full border"
            style={{ backgroundColor: tokens.background }}
          />
          <span className="size-4 rounded-full border" style={{ backgroundColor: tokens.primary }} />
          <span className="size-4 rounded-full border" style={{ backgroundColor: tokens.accent }} />
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <span className="font-medium">{row.original.name}</span>
        {row.original.is_active_web && <Badge>Web</Badge>}
        {row.original.is_active_couple && <Badge variant="secondary">Couple</Badge>}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => (
      <Badge variant={row.original.status === "active" ? "secondary" : "outline"} className="capitalize">
        {row.original.status}
      </Badge>
    ),
  },
  {
    id: "actions",
    cell: ThemesRowActions,
  },
];
