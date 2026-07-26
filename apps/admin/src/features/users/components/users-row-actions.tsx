"use client";

import { MoreHorizontal, UserCheck, UserX } from "lucide-react";
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
import type { User } from "../data/schema";
import { useUsers } from "./users-provider";

export function UsersRowActions({ row }: { row: Row<User> }) {
  const { setOpen, setCurrentRow } = useUsers();
  const user = row.original;

  async function activate() {
    try {
      await api.post(`/admin/api/users/${user.user_id}/approve`);
      toast.success("User activated");
      mutate("/admin/api/users");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to activate user");
    }
  }

  if (user.role === "admin") return null;

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex h-8 w-8 p-0 data-[state=open]:bg-muted">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {user.status !== "active" ? (
          <DropdownMenuItem onClick={activate}>
            Activate
            <UserCheck className="ms-auto size-4" />
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            variant="destructive"
            onClick={() => {
              setCurrentRow(user);
              setOpen("deactivate");
            }}
          >
            Deactivate
            <UserX className="ms-auto size-4" />
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
