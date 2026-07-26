"use client";

import { type Row } from "@tanstack/react-table";
import { toast } from "sonner";
import { mutate } from "swr";
import { Button } from "@mongkolka/ui/button";
import { api, ApiError } from "@/lib/api";
import type { Vendor } from "../data/schema";
import { useVendors } from "./vendors-provider";

export function VendorsRowActions({ row }: { row: Row<Vendor> }) {
  const { setOpen, setCurrentRow } = useVendors();
  const vendor = row.original;

  async function reactivate() {
    try {
      await api.post(`/admin/api/vendors/${vendor.vendor_id}/reactivate`);
      toast.success("Reactivated");
      mutate("/admin/api/vendors");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to reactivate vendor");
    }
  }

  if (vendor.status === "active") {
    return (
      <Button
        size="sm"
        variant="outline"
        onClick={() => {
          setCurrentRow(vendor);
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
