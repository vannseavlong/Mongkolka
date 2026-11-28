"use client";

import { Main } from "@mongkolka/ui/layout/main";
import { PageHeader } from "@mongkolka/ui/layout/page-header";
import { useApiQuery } from "@/lib/use-api-query";
import { VendorsDialogs } from "./components/vendors-dialogs";
import { VendorsProvider } from "./components/vendors-provider";
import { VendorsTable } from "./components/vendors-table";
import type { Vendor } from "./data/schema";

export function Vendors() {
  const { data, error } = useApiQuery<{ vendors: Vendor[] }>("/admin/api/vendors");

  return (
    <VendorsProvider>
      <PageHeader title="Vendors" description="Every approved vendor account." />
      <Main fluid>
        {error && <p className="text-destructive">{error}</p>}
        <VendorsTable data={data?.vendors ?? []} />
      </Main>
      <VendorsDialogs />
    </VendorsProvider>
  );
}
