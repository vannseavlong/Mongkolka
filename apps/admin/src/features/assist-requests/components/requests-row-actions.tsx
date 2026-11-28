"use client";

import { Ban, Check, ExternalLink, MoreHorizontal, X } from "lucide-react";
import { type Row } from "@tanstack/react-table";
import { Button } from "@mongkolka/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@mongkolka/ui/dropdown-menu";
import { actionsFor } from "../lib/assist-rules";
import type { RequestRow } from "../lib/request-rows";
import { useRequests } from "./requests-provider";

export function RequestsRowActions({ row }: { row: Row<RequestRow> }) {
  const { busy, openEditor, setDialog } = useRequests();
  const { id: requestId, coupleName, accessEndsAt, status } = row.original;
  const can = actionsFor({ status, expiresAt: accessEndsAt }, new Date());

  if (!can.accept && !can.openEditor) return null;

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" disabled={busy} className="flex h-8 w-8 p-0 data-[state=open]:bg-muted">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Actions for {coupleName}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        {can.accept && (
          <DropdownMenuItem onClick={() => setDialog({ kind: "accept", requestId })}>
            Accept
            <Check className="ms-auto size-4" />
          </DropdownMenuItem>
        )}
        {can.decline && (
          <DropdownMenuItem variant="destructive" onClick={() => setDialog({ kind: "decline", requestId })}>
            Decline
            <X className="ms-auto size-4" />
          </DropdownMenuItem>
        )}
        {can.openEditor && (
          <DropdownMenuItem onClick={() => void openEditor(requestId)}>
            Open editor
            <ExternalLink className="ms-auto size-4" />
          </DropdownMenuItem>
        )}
        {can.revoke && (
          <DropdownMenuItem variant="destructive" onClick={() => setDialog({ kind: "revoke", requestId })}>
            End access
            <Ban className="ms-auto size-4" />
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
