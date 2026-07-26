"use client";

import { Main } from "@mongkolka/ui/layout/main";
import { useApiQuery } from "@/lib/use-api-query";
import { CouplesDialogs } from "./components/couples-dialogs";
import { CouplesProvider } from "./components/couples-provider";
import { CouplesTable } from "./components/couples-table";
import type { Couple } from "./data/schema";

export function Couples() {
  const { data, error } = useApiQuery<{ couples: Couple[] }>("/admin/api/couples");

  return (
    <CouplesProvider>
      <Main>
        <div className="mb-4">
          <h1 className="text-2xl font-bold tracking-tight">Couples</h1>
          <p className="text-muted-foreground">Every approved couple account.</p>
        </div>
        {error && <p className="text-destructive">{error}</p>}
        <CouplesTable data={data?.couples ?? []} />
      </Main>
      <CouplesDialogs />
    </CouplesProvider>
  );
}
