import { type ColumnDef } from "@tanstack/react-table";
import { Badge } from "@mongkolka/ui/badge";
import { DataTableColumnHeader } from "@mongkolka/ui/data-table";
import type { Service } from "../data/schema";
import { ServicesRowActions } from "./services-row-actions";

export const servicesColumns: ColumnDef<Service>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
    cell: ({ row }) => (
      <div>
        <div>{row.original.name}</div>
        {row.original.description && (
          <div className="text-sm text-muted-foreground">{row.original.description}</div>
        )}
      </div>
    ),
  },
  {
    accessorKey: "price",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Price" />,
    cell: ({ row }) => {
      const price = row.getValue<number | null>("price");
      return price != null ? `$${price}` : "—";
    },
  },
  {
    accessorKey: "unit",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Unit" />,
    cell: ({ row }) => <Badge variant="outline">{row.getValue<string>("unit").replace("_", " ")}</Badge>,
  },
  {
    id: "actions",
    cell: ServicesRowActions,
  },
];
