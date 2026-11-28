"use client";

import { Main } from "@mongkolka/ui/layout/main";
import { PageHeader } from "@mongkolka/ui/layout/page-header";
import { useApiQuery } from "@/lib/use-api-query";
import { CouplesDialogs } from "./components/couples-dialogs";
import { CouplesProvider } from "./components/couples-provider";
import { CouplesTable } from "./components/couples-table";
import type { Couple } from "./data/schema";

export function Couples() {
  const { data, error } = useApiQuery<{ couples: Couple[] }>("/admin/api/couples");

  return (
    <CouplesProvider>
      <PageHeader title="Couples" description="Every approved couple account." />
      <Main fluid>
        {error && <p className="text-destructive">{error}</p>}
        <CouplesTable data={data?.couples ?? []} />
      </Main>
      <CouplesDialogs />
    </CouplesProvider>
  );
}
