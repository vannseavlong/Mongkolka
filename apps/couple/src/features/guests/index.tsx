"use client";

import { Main } from "@mongkolka/ui/layout/main";
import { useApiQuery } from "@/lib/use-api-query";
import { GuestsDialogs } from "./components/guests-dialogs";
import { GuestsPrimaryButtons } from "./components/guests-primary-buttons";
import { GuestsProvider } from "./components/guests-provider";
import { GuestsTable } from "./components/guests-table";
import { formatGift, type Guest } from "./data/schema";

export function Guests() {
  const { data, error } = useApiQuery<{ guests: Guest[] }>("/couple/api/guests");
  const guests = data?.guests ?? [];
  const confirmed = guests.filter((g) => g.status === "confirmed").length;

  // Totals per currency — USD and KHR are never summed together.
  const received: Record<string, number> = {};
  let receivedCount = 0;
  let toConfirm = 0;
  for (const g of guests) {
    if (g.gift_status === "received") {
      receivedCount += 1;
      const c = g.gift_currency ?? "USD";
      received[c] = (received[c] ?? 0) + (Number(g.gift_amount) || 0);
    } else if (g.gift_status === "reported") {
      toConfirm += 1;
    }
  }
  const giftSummary = Object.entries(received)
    .map(([currency, total]) => formatGift(total, currency))
    .filter(Boolean)
    .join("  +  ");

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
        {(receivedCount > 0 || toConfirm > 0) && (
          <div className="mb-4 flex flex-wrap items-center gap-x-6 gap-y-1 rounded-lg border bg-muted/40 px-4 py-3 text-sm">
            <span className="font-medium">Gifts</span>
            {giftSummary && <span className="text-base font-semibold">{giftSummary}</span>}
            <span className="text-muted-foreground">
              from {receivedCount} guest{receivedCount === 1 ? "" : "s"}
            </span>
            {toConfirm > 0 && (
              <span className="text-amber-700">
                {toConfirm} reported by guests, waiting for you to confirm
              </span>
            )}
          </div>
        )}
        {error && <p className="text-destructive">{error}</p>}
        <GuestsTable data={guests} />
      </Main>
      <GuestsDialogs />
    </GuestsProvider>
  );
}
