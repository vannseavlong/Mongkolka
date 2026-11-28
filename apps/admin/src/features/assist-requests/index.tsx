"use client";

import { Main } from "@mongkolka/ui/layout/main";
import { PageHeader } from "@mongkolka/ui/layout/page-header";
import { RequestsTable } from "./components/requests-table";

export function AssistRequests() {
  return (
    <>
      <PageHeader title="Help requests" description="Couples asking Mongkolka to help with their site." />
      <Main fluid>
        <RequestsTable />
      </Main>
    </>
  );
}
