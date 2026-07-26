"use client";

import { Pencil, Trash2 } from "lucide-react";
import { type Row } from "@tanstack/react-table";
import { Button } from "@mongkolka/ui/button";
import type { BudgetCategory } from "../data/schema";
import { useBudget } from "./budget-provider";

export function BudgetRowActions({ row }: { row: Row<BudgetCategory> }) {
  const { setOpen, setCurrentRow } = useBudget();

  return (
    <div className="flex justify-end gap-1">
      <Button
        size="icon"
        variant="ghost"
        onClick={() => {
          setCurrentRow(row.original);
          setOpen("edit");
        }}
      >
        <Pencil className="size-4" />
        <span className="sr-only">Edit</span>
      </Button>
      <Button
        size="icon"
        variant="ghost"
        onClick={() => {
          setCurrentRow(row.original);
          setOpen("delete");
        }}
      >
        <Trash2 className="size-4" />
        <span className="sr-only">Delete</span>
      </Button>
    </div>
  );
}
