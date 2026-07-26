"use client";

import { type Row } from "@tanstack/react-table";
import { toast } from "sonner";
import { mutate } from "swr";
import { Button } from "@mongkolka/ui/button";
import { api, ApiError } from "@/lib/api";
import type { Couple } from "../data/schema";
import { useCouples } from "./couples-provider";

export function CouplesRowActions({ row }: { row: Row<Couple> }) {
  const { setOpen, setCurrentRow } = useCouples();
  const couple = row.original;

  async function reactivate() {
    try {
      await api.post(`/admin/api/couples/${couple.couple_id}/reactivate`);
      toast.success("Reactivated");
      mutate("/admin/api/couples");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to reactivate couple");
    }
  }

  if (couple.status === "active") {
    return (
      <Button
        size="sm"
        variant="outline"
        onClick={() => {
          setCurrentRow(couple);
          setOpen("suspend");
        }}
      >
        Suspend
      </Button>
    );
  }

  return (
    <Button size="sm" onClick={reactivate}>
      Reactivate
    </Button>
  );
}
