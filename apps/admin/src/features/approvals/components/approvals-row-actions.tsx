"use client";

import { Check, MoreVertical, X } from "lucide-react";
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
import type { User } from "@/features/users/data/schema";
import { useApprovals } from "./approvals-provider";

export function ApprovalsRowActions({ row }: { row: Row<User> }) {
  const { setOpen, setCurrentRow } = useApprovals();
  const user = row.original;

  async function approve() {
    try {
      await api.post(`/admin/api/users/${user.user_id}/approve`);
      toast.success("Approved");
      mutate("/admin/api/users?status=pending");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to approve");
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
        <DropdownMenuItem onClick={approve}>
          Approve
          <Check className="ms-auto size-4" />
        </DropdownMenuItem>
        <DropdownMenuItem
          variant="destructive"
          onClick={() => {
            setCurrentRow(user);
            setOpen("reject");
          }}
        >
          Reject
          <X className="ms-auto size-4" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
