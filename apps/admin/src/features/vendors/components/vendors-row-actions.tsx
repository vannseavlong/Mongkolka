"use client";

import { Ban, MoreVertical, RotateCcw } from "lucide-react";
import { type Row } from "@tanstack/react-table";
import { toast } from "sonner";
import { mutate } from "swr";
import { Button } from "@mongkolka/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@mongkolka/ui/dropdown-menu";
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

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex h-8 w-8 p-0 data-[state=open]:bg-muted">
          <MoreVertical className="size-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {vendor.status === "active" ? (
          <DropdownMenuItem
            variant="destructive"
            onClick={() => {
              setCurrentRow(vendor);
              setOpen("suspend");
            }}
          >
            Suspend
            <Ban className="ms-auto size-4" />
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem onClick={reactivate}>
            Reactivate
            <RotateCcw className="ms-auto size-4" />
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
