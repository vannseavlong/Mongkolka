import { type ColumnDef } from "@tanstack/react-table";
import { Badge } from "@mongkolka/ui/badge";
import { DataTableColumnHeader } from "@mongkolka/ui/data-table";
import { STATUS_LABEL } from "../lib/assist-rules";
import type { RequestRow } from "../lib/request-rows";
import { RequestsRowActions } from "./requests-row-actions";

const when = (iso: string) => new Date(iso).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });

const STATUS_VARIANT = { pending: "default", approved: "secondary" } as const;

export const requestsColumns: ColumnDef<RequestRow>[] = [
  {
    accessorKey: "coupleName",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Couple" />,
    cell: ({ row }) => <div className="max-w-48 font-medium break-words whitespace-normal">{row.original.coupleName}</div>,
  },
  {
    accessorKey: "note",
    header: "Note",
    enableSorting: false,
    // Shown in full: the admin decides on it.
    cell: ({ row }) => (
      <div className="w-max max-w-md min-w-48 break-words whitespace-pre-wrap">
        {row.original.note}
        {row.original.declineReason && (
          <p className="text-muted-foreground">Reason given: {row.original.declineReason}</p>
        )}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const { status } = row.original;
      return (
        <Badge variant={status === "pending" || status === "approved" ? STATUS_VARIANT[status] : "outline"}>
          {STATUS_LABEL[status]}
        </Badge>
      );
    },
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
  },
  {
    accessorKey: "requestedAt",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Asked" />,
    cell: ({ row }) => when(row.original.requestedAt),
  },
  {
    accessorKey: "accessEndsAt",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Access ends" />,
    cell: ({ row }) => {
      const { accessEndsAt, accessLeft } = row.original;
      if (!accessEndsAt) return <span className="text-muted-foreground">—</span>;
      return (
        <div>
          {when(accessEndsAt)}
          {accessLeft && <p className="text-muted-foreground">{accessLeft}</p>}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: RequestsRowActions,
  },
];
