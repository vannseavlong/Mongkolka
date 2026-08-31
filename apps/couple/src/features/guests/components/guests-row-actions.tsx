"use client";

import { MoreVertical, Pencil, Send, Trash2 } from "lucide-react";
import { type Row } from "@tanstack/react-table";
import { toast } from "sonner";
import { Button } from "@mongkolka/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@mongkolka/ui/dropdown-menu";
import { useApiQuery } from "@/lib/use-api-query";
import { buildInviteLink } from "@/lib/site-url";
import type { WebsiteSettings } from "@/features/website/data/schema";
import type { Guest } from "../data/schema";
import { useGuests } from "./guests-provider";

export function GuestsRowActions({ row }: { row: Row<Guest> }) {
  const { setOpen, setCurrentRow } = useGuests();
  const { data } = useApiQuery<{ settings: WebsiteSettings }>("/couple/api/website/settings");
  const slug = data?.settings.slug;
  const guest = row.original;

  async function sendInvitation() {
    if (!slug) {
      toast.error("Set up your wedding website before sending invitations");
      return;
    }

    const names = guest.plus_one && guest.plus_one_name ? [guest.name, guest.plus_one_name] : [guest.name];
    const link = buildInviteLink(slug, names);

    try {
      await navigator.clipboard.writeText(link);
      toast.success("Invitation link copied to clipboard");
    } catch {
      toast.error("Couldn't copy the link — try again");
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
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem
          onClick={() => {
            setCurrentRow(guest);
            setOpen("edit");
          }}
        >
          Edit
          <Pencil className="ms-auto size-4" />
        </DropdownMenuItem>
        <DropdownMenuItem onClick={sendInvitation}>
          Send invitation
          <Send className="ms-auto size-4" />
        </DropdownMenuItem>
        <DropdownMenuItem
          variant="destructive"
          onClick={() => {
            setCurrentRow(guest);
            setOpen("delete");
          }}
        >
          Delete
          <Trash2 className="ms-auto size-4" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
