import { type ColumnDef } from "@tanstack/react-table";
import { Badge } from "@mongkolka/ui/badge";
import { DataTableColumnHeader } from "@mongkolka/ui/data-table";
import type { Booking } from "../data/schema";

const STATUS_VARIANT: Record<Booking["status"], "default" | "secondary" | "destructive" | "outline"> = {
  inquiry: "secondary",
  pending: "secondary",
  confirmed: "default",
  completed: "outline",
  cancelled: "destructive",
};

export const bookingsColumns: ColumnDef<Booking>[] = [
  {
    accessorKey: "service_summary",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Service" />,
    cell: ({ row }) => row.getValue("service_summary") ?? "—",
  },
  {
    accessorKey: "event_date",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Event date" />,
    cell: ({ row }) => {
      const value = row.getValue<string | null>("event_date");
      return value ? new Date(value).toLocaleDateString() : "—";
    },
  },
  {
    accessorKey: "amount",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Amount" />,
    cell: ({ row }) => {
      const amount = row.getValue<number | null>("amount");
      return amount != null ? `$${amount}` : "—";
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const status = row.getValue<Booking["status"]>("status");
      return (
        <Badge variant={STATUS_VARIANT[status]} className="capitalize">
          {status}
        </Badge>
      );
    },
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
  },
];
