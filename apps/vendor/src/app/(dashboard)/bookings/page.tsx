"use client";

import { Badge } from "@mongkolka/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@mongkolka/ui/table";
import { useApiQuery } from "@/lib/use-api-query";
import type { Booking } from "@/lib/types";

const STATUS_VARIANT: Record<Booking["status"], "default" | "secondary" | "destructive" | "outline"> = {
  inquiry: "secondary",
  pending: "secondary",
  confirmed: "default",
  completed: "outline",
  cancelled: "destructive",
};

export default function BookingsPage() {
  const { data, loading, error } = useApiQuery<{ bookings: Booking[] }>("/vendor/api/bookings");

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-medium">Bookings</h1>
      {error && <p className="text-destructive">{error}</p>}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Service</TableHead>
            <TableHead>Event date</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!loading && (data?.bookings.length ?? 0) === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-muted-foreground">
                No bookings yet.
              </TableCell>
            </TableRow>
          )}
          {data?.bookings.map((booking) => (
            <TableRow key={booking.booking_id}>
              <TableCell>{booking.service_summary ?? "—"}</TableCell>
              <TableCell>
                {booking.event_date ? new Date(booking.event_date).toLocaleDateString() : "—"}
              </TableCell>
              <TableCell>{booking.amount != null ? `$${booking.amount}` : "—"}</TableCell>
              <TableCell>
                <Badge variant={STATUS_VARIANT[booking.status]} className="capitalize">
                  {booking.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
