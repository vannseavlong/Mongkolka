"use client";

import { Eye, Mail, MailOpen, MoreHorizontal, Trash2 } from "lucide-react";
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
import type { ContactMessage } from "../data/schema";
import { useMessages } from "./messages-provider";

export function MessagesRowActions({ row }: { row: Row<ContactMessage> }) {
  const { setOpen, setCurrentRow } = useMessages();
  const message = row.original;

  async function toggleStatus() {
    const nextStatus = message.status === "unread" ? "read" : "unread";
    try {
      await api.patch(`/admin/api/contact-messages/${message.message_id}`, { status: nextStatus });
      mutate("/admin/api/contact-messages");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to update message");
    }
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex h-8 w-8 p-0 data-[state=open]:bg-muted">
          <MoreHorizontal className="size-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuItem
          onClick={() => {
            setCurrentRow(message);
            setOpen("view");
          }}
        >
          <Eye className="size-5" />
          View
        </DropdownMenuItem>
        <DropdownMenuItem onClick={toggleStatus}>
          {message.status === "unread" ? (
            <>
              <MailOpen className="size-5" />
              Mark as read
            </>
          ) : (
            <>
              <Mail className="size-5" />
              Mark as unread
            </>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem
          variant="destructive"
          onClick={() => {
            setCurrentRow(message);
            setOpen("delete");
          }}
        >
          <Trash2 className="size-5" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
