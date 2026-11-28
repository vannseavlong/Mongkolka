"use client";

import { Main } from "@mongkolka/ui/layout/main";
import { PageHeader } from "@mongkolka/ui/layout/page-header";
import { useApiQuery } from "@/lib/use-api-query";
import { UsersDialogs } from "./components/users-dialogs";
import { UsersProvider } from "./components/users-provider";
import { UsersTable } from "./components/users-table";
import type { User } from "./data/schema";

export function Users() {
  const { data, error } = useApiQuery<{ users: User[] }>("/admin/api/users");

  return (
    <UsersProvider>
      <PageHeader title="All Users" description="Every login identity across all three portals." />
      <Main fluid>
        {error && <p className="text-destructive">{error}</p>}
        <UsersTable data={data?.users ?? []} />
      </Main>
      <UsersDialogs />
    </UsersProvider>
  );
}
