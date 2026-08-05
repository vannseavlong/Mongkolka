import { type ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@mongkolka/ui/data-table";
import type { Stat } from "../data/schema";
import { StatActiveCell } from "./stat-active-cell";
import { StatsRowActions } from "./stats-row-actions";

export const statsColumns: ColumnDef<Stat>[] = [
  {
    accessorKey: "display_order",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Order" />,
    cell: ({ row }) => <span className="text-muted-foreground">{row.original.display_order}</span>,
  },
  {
    accessorKey: "label",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Label" />,
    cell: ({ row }) => <span className="font-medium">{row.original.label}</span>,
  },
  {
    accessorKey: "value",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Value" />,
    cell: ({ row }) => <span className="font-mono text-sm">{row.original.value}</span>,
  },
  {
    accessorKey: "icon",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Icon" />,
    cell: ({ row }) => row.original.icon ?? "—",
  },
  {
    accessorKey: "active",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Active" />,
    cell: ({ row }) => <StatActiveCell stat={row.original} />,
  },
  {
    id: "actions",
    cell: StatsRowActions,
  },
];
