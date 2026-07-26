import { type ColumnDef } from "@tanstack/react-table";
import { Badge } from "@mongkolka/ui/badge";
import { DataTableColumnHeader } from "@mongkolka/ui/data-table";
import type { ChecklistItem } from "../data/schema";
import { ChecklistCompletedCell } from "./checklist-completed-cell";
import { ChecklistRowActions } from "./checklist-row-actions";

const PRIORITY_VARIANTS = {
  high: "destructive",
  medium: "default",
  low: "secondary",
} as const;

export const checklistColumns: ColumnDef<ChecklistItem>[] = [
  {
    id: "completed",
    header: "",
    cell: ({ row }) => <ChecklistCompletedCell item={row.original} />,
  },
  {
    accessorKey: "text",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Task" />,
    cell: ({ row }) => (
      <span className={row.original.completed ? "line-through text-muted-foreground" : ""}>
        {row.original.text}
      </span>
    ),
  },
  {
    accessorKey: "priority",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Priority" />,
    cell: ({ row }) => (
      <Badge variant={PRIORITY_VARIANTS[row.original.priority]} className="capitalize">
        {row.original.priority}
      </Badge>
    ),
  },
  {
    accessorKey: "due_date",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Due date" />,
    cell: ({ row }) =>
      row.original.due_date ? new Date(row.original.due_date).toLocaleDateString() : "—",
  },
  {
    id: "actions",
    cell: ChecklistRowActions,
  },
];
