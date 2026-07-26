"use client";

import { Main } from "@mongkolka/ui/layout/main";
import { useApiQuery } from "@/lib/use-api-query";
import { VendorCategoriesDialogs } from "./components/vendor-categories-dialogs";
import { VendorCategoriesPrimaryButtons } from "./components/vendor-categories-primary-buttons";
import { VendorCategoriesProvider } from "./components/vendor-categories-provider";
import { VendorCategoriesTable } from "./components/vendor-categories-table";
import type { VendorCategory } from "./data/schema";

export function VendorCategories() {
  const { data, error } = useApiQuery<{ categories: VendorCategory[] }>("/admin/api/vendor-categories");

  return (
    <VendorCategoriesProvider>
      <Main>
        <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Vendor Categories</h1>
            <p className="text-muted-foreground">
              The category list vendors pick from — retire a category instead of deleting it if
              vendors already use it.
            </p>
          </div>
          <VendorCategoriesPrimaryButtons />
        </div>
        {error && <p className="text-destructive">{error}</p>}
        <VendorCategoriesTable data={data?.categories ?? []} />
      </Main>
      <VendorCategoriesDialogs />
    </VendorCategoriesProvider>
  );
}
