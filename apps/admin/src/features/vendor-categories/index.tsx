"use client";

import { Main } from "@mongkolka/ui/layout/main";
import { PageHeader } from "@mongkolka/ui/layout/page-header";
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
      <PageHeader
        title="Vendor Categories"
        description="The category list vendors pick from — retire a category instead of deleting it if vendors already use it."
        actions={<VendorCategoriesPrimaryButtons />}
      />
      <Main fluid>
        {error && <p className="text-destructive">{error}</p>}
        <VendorCategoriesTable data={data?.categories ?? []} />
      </Main>
      <VendorCategoriesDialogs />
    </VendorCategoriesProvider>
  );
}
