"use client";

import { toast } from "sonner";
import { mutate } from "swr";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@mongkolka/ui/select";
import { api, ApiError } from "@/lib/api";
import { GUEST_STATUSES, type Guest } from "../data/schema";

export function GuestStatusCell({ guest }: { guest: Guest }) {
  async function updateStatus(status: string) {
    try {
      await api.patch(`/couple/api/guests/${guest.guest_id}`, { status });
      mutate("/couple/api/guests");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to update status");
    }
  }

  return (
    <Select value={guest.status} onValueChange={updateStatus}>
      <SelectTrigger size="sm" className="w-40">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {GUEST_STATUSES.map((status) => (
          <SelectItem key={status} value={status} className="capitalize">
            {status.replace(/-/g, " ")}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
