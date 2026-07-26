"use client";

import { Main } from "@mongkolka/ui/layout/main";
import { useApiQuery } from "@/lib/use-api-query";
import { ServicesDialogs } from "./components/services-dialogs";
import { ServicesPrimaryButtons } from "./components/services-primary-buttons";
import { ServicesProvider } from "./components/services-provider";
import { ServicesTable } from "./components/services-table";
import type { Service } from "./data/schema";

export function Services() {
  const { data, error } = useApiQuery<{ services: Service[] }>("/vendor/api/services");

  return (
    <ServicesProvider>
      <Main>
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Services</h1>
          <ServicesPrimaryButtons />
        </div>
        {error && <p className="text-destructive">{error}</p>}
        <ServicesTable data={data?.services ?? []} />
      </Main>
      <ServicesDialogs />
    </ServicesProvider>
  );
}
