"use client";

import { Plus } from "lucide-react";
import { Button } from "@mongkolka/ui/button";
import { useBudget } from "./budget-provider";

export function BudgetPrimaryButtons() {
  const { setOpen } = useBudget();
  return (
    <Button onClick={() => setOpen("create")}>
      <Plus className="size-4" /> Add category
    </Button>
  );
}
