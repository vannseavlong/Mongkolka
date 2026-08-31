import { type ColumnDef } from "@tanstack/react-table";
import { Badge } from "@mongkolka/ui/badge";
import { DataTableColumnHeader } from "@mongkolka/ui/data-table";
import type { BudgetCategory } from "@/features/budget/data/schema";
import type { ChecklistItem } from "../data/schema";
import { ChecklistCompletedCell } from "./checklist-completed-cell";
import { ChecklistRowActions } from "./checklist-row-actions";

const PRIORITY_VARIANTS = {
  high: "destructive",
  medium: "default",
  low: "secondary",
} as const;

// Category and amount spent are looked up per row rather than baked into a
// static column list, so a task like "Book the venue" can show "Venue" and
// its cost — the same numbers that get summed into that category's "spent"
// total on the Budget page (see CoupleBudgetService.withComputedSpent).
export function getChecklistColumns(categories: BudgetCategory[]): ColumnDef<ChecklistItem>[] {
  const categoryById = new Map(categories.map((c) => [c.category_id, c]));

  return [
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
      accessorKey: "category",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Category" />,
      cell: ({ row }) => {
        const category = row.original.category ? categoryById.get(row.original.category) : undefined;
        if (!category) return "—";
        return (
          <div className="flex items-center gap-2">
            <span
              className="inline-block size-2 rounded-full"
              style={{ backgroundColor: category.color ?? "#999" }}
            />
            {category.name}
          </div>
        );
      },
    },
    {
      accessorKey: "budget_spent",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Spent" />,
      cell: ({ row }) => (row.original.budget_spent ? `$${row.original.budget_spent.toLocaleString()}` : "—"),
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
}
