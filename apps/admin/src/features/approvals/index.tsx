"use client";

import { Main } from "@mongkolka/ui/layout/main";
import { PageHeader } from "@mongkolka/ui/layout/page-header";
import { useApiQuery } from "@/lib/use-api-query";
import type { User } from "@/features/users/data/schema";
import { ApprovalsDialogs } from "./components/approvals-dialogs";
import { ApprovalsProvider } from "./components/approvals-provider";
import { ApprovalsTable } from "./components/approvals-table";

export function Approvals() {
  const { data, error } = useApiQuery<{ users: User[] }>("/admin/api/users?status=pending");
  const pending = (data?.users ?? []).filter((u) => u.role === "couple" || u.role === "vendor");

  return (
    <ApprovalsProvider>
      <PageHeader title="Approvals" description="Couples and vendors waiting to be approved." />
      <Main fluid>
        {error && <p className="text-destructive">{error}</p>}
        <ApprovalsTable data={pending} />
      </Main>
      <ApprovalsDialogs />
    </ApprovalsProvider>
  );
}
