"use client";

import { Main } from "@mongkolka/ui/layout/main";
import { useApiQuery } from "@/lib/use-api-query";
import { UsersDialogs } from "./components/users-dialogs";
import { UsersProvider } from "./components/users-provider";
import { UsersTable } from "./components/users-table";
import type { User } from "./data/schema";

export function Users() {
  const { data, error } = useApiQuery<{ users: User[] }>("/admin/api/users");

  return (
    <UsersProvider>
      <Main>
        <div className="mb-4">
          <h1 className="text-2xl font-bold tracking-tight">All Users</h1>
          <p className="text-muted-foreground">Every login identity across all three portals.</p>
        </div>
        {error && <p className="text-destructive">{error}</p>}
        <UsersTable data={data?.users ?? []} />
      </Main>
      <UsersDialogs />
    </UsersProvider>
  );
}
