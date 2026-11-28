"use client";

import { Main } from "@mongkolka/ui/layout/main";
import { PageHeader } from "@mongkolka/ui/layout/page-header";
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
      <PageHeader title="Services" actions={<ServicesPrimaryButtons />} />
      <Main fluid>
        {error && <p className="text-destructive">{error}</p>}
        <ServicesTable data={data?.services ?? []} />
      </Main>
      <ServicesDialogs />
    </ServicesProvider>
  );
}
