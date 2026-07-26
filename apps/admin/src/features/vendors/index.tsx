"use client";

import { Main } from "@mongkolka/ui/layout/main";
import { useApiQuery } from "@/lib/use-api-query";
import { VendorsDialogs } from "./components/vendors-dialogs";
import { VendorsProvider } from "./components/vendors-provider";
import { VendorsTable } from "./components/vendors-table";
import type { Vendor } from "./data/schema";

export function Vendors() {
  const { data, error } = useApiQuery<{ vendors: Vendor[] }>("/admin/api/vendors");

  return (
    <VendorsProvider>
      <Main>
        <div className="mb-4">
          <h1 className="text-2xl font-bold tracking-tight">Vendors</h1>
          <p className="text-muted-foreground">Every approved vendor account.</p>
        </div>
        {error && <p className="text-destructive">{error}</p>}
        <VendorsTable data={data?.vendors ?? []} />
      </Main>
      <VendorsDialogs />
    </VendorsProvider>
  );
}
