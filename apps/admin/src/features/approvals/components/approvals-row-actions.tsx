"use client";

import { type Row } from "@tanstack/react-table";
import { toast } from "sonner";
import { mutate } from "swr";
import { Button } from "@mongkolka/ui/button";
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
    <div className="flex justify-end gap-2">
      <Button size="sm" onClick={approve}>
        Approve
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={() => {
          setCurrentRow(user);
          setOpen("reject");
        }}
      >
        Reject
      </Button>
    </div>
  );
}
