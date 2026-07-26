"use client";

import { DataTable } from "@mongkolka/ui/data-table";
import { Main } from "@mongkolka/ui/layout/main";
import { useApiQuery } from "@/lib/use-api-query";
import { bookingsColumns } from "./components/bookings-columns";
import type { Booking } from "./data/schema";

export function Bookings() {
  const { data, error } = useApiQuery<{ bookings: Booking[] }>("/vendor/api/bookings");

  return (
    <Main>
      <div className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight">Bookings</h1>
      </div>
      {error && <p className="text-destructive">{error}</p>}
      <DataTable
        columns={bookingsColumns}
        data={data?.bookings ?? []}
        filters={[
          {
            columnId: "status",
            title: "Status",
            options: [
              { label: "Inquiry", value: "inquiry" },
              { label: "Pending", value: "pending" },
              { label: "Confirmed", value: "confirmed" },
              { label: "Completed", value: "completed" },
              { label: "Cancelled", value: "cancelled" },
            ],
          },
        ]}
      />
    </Main>
  );
}
