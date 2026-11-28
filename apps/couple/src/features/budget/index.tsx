"use client";

import { Main } from "@mongkolka/ui/layout/main";
import { PageHeader } from "@mongkolka/ui/layout/page-header";
import { useApiQuery } from "@/lib/use-api-query";
import { BudgetDialogs } from "./components/budget-dialogs";
import { BudgetPrimaryButtons } from "./components/budget-primary-buttons";
import { BudgetProvider } from "./components/budget-provider";
import { BudgetTable } from "./components/budget-table";
import type { BudgetCategory } from "./data/schema";

export function Budget() {
  const { data, error } = useApiQuery<{ categories: BudgetCategory[] }>("/couple/api/budget-categories");
  const categories = data?.categories ?? [];
  const totalAllocated = categories.reduce((sum, c) => sum + c.allocated, 0);
  const totalSpent = categories.reduce((sum, c) => sum + c.spent, 0);

  return (
    <BudgetProvider>
      <PageHeader
        title="Budget"
        description={`$${totalSpent.toLocaleString()} spent of $${totalAllocated.toLocaleString()} allocated`}
        actions={<BudgetPrimaryButtons />}
      />
      <Main fluid>
        {error && <p className="text-destructive">{error}</p>}
        <BudgetTable data={categories} />
      </Main>
      <BudgetDialogs />
    </BudgetProvider>
  );
}
