import { type ColumnDef } from "@tanstack/react-table";
import { Badge } from "@mongkolka/ui/badge";
import { DataTableColumnHeader } from "@mongkolka/ui/data-table";
import type { ContactMessage } from "../data/schema";
import { MessagesRowActions } from "./messages-row-actions";

export const messagesColumns: ColumnDef<ContactMessage>[] = [
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => (
      <Badge variant={row.original.status === "unread" ? "default" : "outline"}>
        {row.original.status === "unread" ? "Unread" : "Read"}
      </Badge>
    ),
  },
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
    cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
  },
  {
    accessorKey: "email",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
  },
  {
    accessorKey: "subject",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Subject" />,
    cell: ({ row }) => row.original.subject || "—",
  },
  {
    accessorKey: "message",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Message" />,
    cell: ({ row }) => (
      <span className="line-clamp-1 max-w-xs text-muted-foreground">{row.original.message}</span>
    ),
  },
  {
    accessorKey: "_created_at",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Received" />,
    cell: ({ row }) =>
      row.original._created_at ? new Date(row.original._created_at).toLocaleDateString() : "—",
  },
  {
    id: "actions",
    cell: MessagesRowActions,
  },
];
