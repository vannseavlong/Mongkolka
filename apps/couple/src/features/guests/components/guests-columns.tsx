import { type ColumnDef } from "@tanstack/react-table";
import { Badge } from "@mongkolka/ui/badge";
import { DataTableColumnHeader } from "@mongkolka/ui/data-table";
import { formatGift, type Guest } from "../data/schema";
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
    id: "gift",
    accessorKey: "gift_status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Gift" />,
    cell: ({ row }) => {
      const g = row.original;
      const amount = formatGift(g.gift_amount, g.gift_currency);
      if (g.gift_status === "received") {
        return (
          <div className="text-sm">
            <Badge className="bg-emerald-100 text-emerald-900 hover:bg-emerald-100">
              {amount ?? (g.gift_type === "gift" ? "Gift" : "Received")}
            </Badge>
            {g.gift_note && <div className="mt-0.5 text-xs text-muted-foreground">{g.gift_note}</div>}
          </div>
        );
      }
      if (g.gift_status === "reported") {
        return (
          <Badge variant="outline" className="border-amber-300 text-amber-800">
            {amount ? `${amount} · to confirm` : "to confirm"}
          </Badge>
        );
      }
      return <span className="text-muted-foreground">—</span>;
    },
  },
  {
    id: "actions",
    cell: GuestsRowActions,
  },
];
