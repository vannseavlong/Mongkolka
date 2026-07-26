"use client";

import { Main } from "@mongkolka/ui/layout/main";
import { useApiQuery } from "@/lib/use-api-query";
import { GuestsDialogs } from "./components/guests-dialogs";
import { GuestsPrimaryButtons } from "./components/guests-primary-buttons";
import { GuestsProvider } from "./components/guests-provider";
import { GuestsTable } from "./components/guests-table";
import type { Guest } from "./data/schema";

export function Guests() {
  const { data, error } = useApiQuery<{ guests: Guest[] }>("/couple/api/guests");
  const guests = data?.guests ?? [];
  const confirmed = guests.filter((g) => g.status === "confirmed").length;

  return (
    <GuestsProvider>
      <Main>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Guests</h1>
            <p className="text-muted-foreground">
              {confirmed} confirmed of {guests.length} invited
            </p>
          </div>
          <GuestsPrimaryButtons />
        </div>
        {error && <p className="text-destructive">{error}</p>}
        <GuestsTable data={guests} />
      </Main>
      <GuestsDialogs />
    </GuestsProvider>
  );
}
