import { type ColumnDef } from "@tanstack/react-table";
import { Badge } from "@mongkolka/ui/badge";
import { DataTableColumnHeader } from "@mongkolka/ui/data-table";
import { LongText } from "@mongkolka/ui/long-text";
import type { Vendor } from "../data/schema";
import { VendorCategoryCell } from "./vendor-category-cell";
import { VendorsRowActions } from "./vendors-row-actions";

const STATUS_VARIANT: Record<Vendor["status"], "default" | "secondary" | "destructive"> = {
  pending: "secondary",
  active: "default",
  inactive: "destructive",
  rejected: "destructive",
};

export const vendorsColumns: ColumnDef<Vendor>[] = [
  {
    id: "business_name",
    accessorFn: (row) => row.business_name ?? row.owner_email,
    header: ({ column }) => <DataTableColumnHeader column={column} title="Business" />,
    cell: ({ row }) => <LongText className="max-w-48">{row.getValue("business_name")}</LongText>,
  },
  {
    accessorKey: "owner_email",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Owner email" />,
  },
  {
    accessorKey: "category_id",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Category" />,
    cell: ({ row }) => <VendorCategoryCell categoryId={row.getValue("category_id")} />,
  },
  {
    accessorKey: "location",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Location" />,
    cell: ({ row }) => row.getValue("location") ?? "—",
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const status = row.getValue<Vendor["status"]>("status");
      return (
        <Badge variant={STATUS_VARIANT[status]} className="capitalize">
          {status}
        </Badge>
      );
    },
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
  },
  {
    id: "actions",
    cell: VendorsRowActions,
  },
];
