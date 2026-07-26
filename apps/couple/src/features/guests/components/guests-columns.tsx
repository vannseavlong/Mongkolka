import { type ColumnDef } from "@tanstack/react-table";
import { Badge } from "@mongkolka/ui/badge";
import { DataTableColumnHeader } from "@mongkolka/ui/data-table";
import type { Guest } from "../data/schema";
import { GuestStatusCell } from "./guests-status-cell";
import { GuestsRowActions } from "./guests-row-actions";

export const guestsColumns: ColumnDef<Guest>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
    cell: ({ row }) => (
      <div>
        <div>{row.original.name}</div>
        {row.original.plus_one && (
          <div className="text-sm text-muted-foreground">
            +1 {row.original.plus_one_name ? `(${row.original.plus_one_name})` : ""}
          </div>
        )}
      </div>
    ),
  },
  {
    accessorKey: "group",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Group" />,
    cell: ({ row }) =>
      row.original.group ? (
        <Badge variant="outline" className="capitalize">
          {row.original.group}
        </Badge>
      ) : (
        "—"
      ),
  },
  {
    accessorKey: "phone",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Contact" />,
    cell: ({ row }) => (
      <div className="text-sm">
        {row.original.phone && <div>{row.original.phone}</div>}
        {row.original.telegram && <div className="text-muted-foreground">{row.original.telegram}</div>}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="RSVP" />,
    cell: ({ row }) => <GuestStatusCell guest={row.original} />,
  },
  {
    id: "actions",
    cell: GuestsRowActions,
  },
];
