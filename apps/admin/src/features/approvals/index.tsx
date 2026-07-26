"use client";

import { Main } from "@mongkolka/ui/layout/main";
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
      <Main>
        <div className="mb-4">
          <h1 className="text-2xl font-bold tracking-tight">Approvals</h1>
          <p className="text-muted-foreground">Couples and vendors waiting to be approved.</p>
        </div>
        {error && <p className="text-destructive">{error}</p>}
        <ApprovalsTable data={pending} />
      </Main>
      <ApprovalsDialogs />
    </ApprovalsProvider>
  );
}
