import { type ColumnDef } from "@tanstack/react-table";
import { Badge } from "@mongkolka/ui/badge";
import { DataTableColumnHeader } from "@mongkolka/ui/data-table";
import { LongText } from "@mongkolka/ui/long-text";
import type { Couple } from "../data/schema";
import { CouplesRowActions } from "./couples-row-actions";

const STATUS_VARIANT: Record<Couple["status"], "default" | "secondary" | "destructive"> = {
  pending: "secondary",
  active: "default",
  suspended: "destructive",
  rejected: "destructive",
};

export const couplesColumns: ColumnDef<Couple>[] = [
  {
    id: "partner1",
    accessorFn: (row) => row.partner1_name ?? row.partner1_email,
    header: ({ column }) => <DataTableColumnHeader column={column} title="Partner 1" />,
    cell: ({ row }) => <LongText className="max-w-40">{row.getValue("partner1")}</LongText>,
  },
  {
    id: "partner2",
    accessorFn: (row) => row.partner2_name ?? row.partner2_email ?? "—",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Partner 2" />,
    cell: ({ row }) => <LongText className="max-w-40">{row.getValue("partner2")}</LongText>,
  },
  {
    accessorKey: "slug",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Slug" />,
    cell: ({ row }) => <span className="font-mono text-sm">{row.getValue("slug")}</span>,
  },
  {
    accessorKey: "wedding_date",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Wedding date" />,
    cell: ({ row }) => {
      const value = row.getValue<string | null>("wedding_date");
      return value ? new Date(value).toLocaleDateString() : "—";
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const status = row.getValue<Couple["status"]>("status");
      return (
        <Badge variant={STATUS_VARIANT[status]} className="capitalize">
          {status}
        </Badge>
      );
    },
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
  },
  {
    accessorKey: "website_status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Website" />,
    cell: ({ row }) => (
      <Badge variant="outline" className="capitalize">
        {row.getValue("website_status")}
      </Badge>
    ),
  },
  {
    id: "actions",
    cell: CouplesRowActions,
  },
];
