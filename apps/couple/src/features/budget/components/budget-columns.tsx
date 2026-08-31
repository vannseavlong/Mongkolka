import { type ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@mongkolka/ui/data-table";
import type { BudgetCategory } from "../data/schema";
import { BudgetRowActions } from "./budget-row-actions";

export const budgetColumns: ColumnDef<BudgetCategory>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <span
          className="inline-block size-3 rounded-full"
          style={{ backgroundColor: row.original.color ?? "#999" }}
        />
        {row.original.name}
      </div>
    ),
  },
  {
    accessorKey: "allocated",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Allocated" />,
    cell: ({ row }) => `$${row.original.allocated.toLocaleString()}`,
  },
  {
    // Computed server-side from this category's checklist tasks (see
    // CoupleBudgetService.withComputedSpent) — not directly editable here.
    accessorKey: "spent",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Spent (from tasks)" />,
    cell: ({ row }) => `$${row.original.spent.toLocaleString()}`,
  },
  {
    id: "remaining",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Remaining" />,
    cell: ({ row }) => {
      const remaining = row.original.allocated - row.original.spent;
      return (
        <span className={remaining < 0 ? "text-destructive" : undefined}>
          ${remaining.toLocaleString()}
        </span>
      );
    },
  },
  {
    id: "actions",
    cell: BudgetRowActions,
  },
];
