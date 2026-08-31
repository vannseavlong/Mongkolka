"use client";

import { Main } from "@mongkolka/ui/layout/main";
import { useApiQuery } from "@/lib/use-api-query";
import type { BudgetCategory } from "@/features/budget/data/schema";
import { ChecklistDialogs } from "./components/checklist-dialogs";
import { ChecklistPrimaryButtons } from "./components/checklist-primary-buttons";
import { ChecklistProvider } from "./components/checklist-provider";
import { ChecklistTable } from "./components/checklist-table";
import type { ChecklistItem } from "./data/schema";

export function Checklist() {
  const { data, error } = useApiQuery<{ items: ChecklistItem[] }>("/couple/api/checklist-items");
  const { data: categoryData } = useApiQuery<{ categories: BudgetCategory[] }>(
    "/couple/api/budget-categories",
  );
  const items = data?.items ?? [];
  const completed = items.filter((i) => i.completed).length;

  return (
    <ChecklistProvider>
      <Main>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Checklist</h1>
            <p className="text-muted-foreground">
              {completed} of {items.length} tasks done
            </p>
          </div>
          <ChecklistPrimaryButtons />
        </div>
        {error && <p className="text-destructive">{error}</p>}
        <ChecklistTable data={items} categories={categoryData?.categories ?? []} />
      </Main>
      <ChecklistDialogs />
    </ChecklistProvider>
  );
}
