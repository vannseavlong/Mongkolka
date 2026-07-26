import { type ColumnDef } from "@tanstack/react-table";
import { Badge } from "@mongkolka/ui/badge";
import { DataTableColumnHeader } from "@mongkolka/ui/data-table";
import { LongText } from "@mongkolka/ui/long-text";
import type { User } from "@/features/users/data/schema";
import { ApprovalsRowActions } from "./approvals-row-actions";

export const approvalsColumns: ColumnDef<User>[] = [
  {
    accessorKey: "email",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
    cell: ({ row }) => <LongText className="max-w-56">{row.getValue("email")}</LongText>,
  },
  {
    accessorKey: "role",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Role" />,
    cell: ({ row }) => (
      <Badge variant="secondary" className="capitalize">
        {row.getValue("role")}
      </Badge>
    ),
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
  },
  {
    accessorKey: "_created_at",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Registered" />,
    cell: ({ row }) => new Date(row.getValue("_created_at")).toLocaleDateString(),
  },
  {
    id: "actions",
    cell: ApprovalsRowActions,
  },
];
