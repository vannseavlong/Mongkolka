import { type ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@mongkolka/ui/data-table";
import type { VendorCategory } from "../data/schema";
import { VendorCategoryActiveCell } from "./vendor-category-active-cell";
import { VendorCategoriesRowActions } from "./vendor-categories-row-actions";

export const vendorCategoriesColumns: ColumnDef<VendorCategory>[] = [
  {
    accessorKey: "key",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Key" />,
    cell: ({ row }) => <span className="font-mono text-sm">{row.getValue("key")}</span>,
  },
  {
    accessorKey: "label_en",
    header: ({ column }) => <DataTableColumnHeader column={column} title="English" />,
  },
  {
    accessorKey: "label_kh",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Khmer" />,
    cell: ({ row }) => row.getValue("label_kh") ?? "—",
  },
  {
    accessorKey: "active",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Active" />,
    cell: ({ row }) => <VendorCategoryActiveCell category={row.original} />,
  },
  {
    id: "actions",
    cell: VendorCategoriesRowActions,
  },
];
