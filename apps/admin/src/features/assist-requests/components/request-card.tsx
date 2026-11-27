"use client";

import { useState } from "react";
import { ExternalLink } from "lucide-react";
import { Badge } from "@mongkolka/ui/badge";
import { Button } from "@mongkolka/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@mongkolka/ui/card";
import type { AssistRequest } from "../data/schema";
import { STATUS_LABEL, actionsFor, currentStatus, timeLeft } from "../lib/assist-rules";
import { useAssistActions } from "../lib/use-assist-actions";
import { ConfirmDialog } from "./confirm-dialog";
import { DeclineDialog } from "./decline-dialog";

const when = (iso: string) => new Date(iso).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });

export function RequestCard({ request, now, refresh }: { request: AssistRequest; now: Date; refresh: () => Promise<unknown> }) {
  const [dialog, setDialog] = useState<"accept" | "decline" | "revoke" | null>(null);
  const { busy, accept, decline, revoke, openEditor } = useAssistActions(refresh);
  const status = currentStatus(request, now);
  const can = actionsFor(request, now);
  const close = () => setDialog(null);

  return (
    <Card>
      <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <CardTitle className="break-words">{request.coupleName}</CardTitle>
          <p className="text-sm text-muted-foreground">Asked {when(request.requestedAt)}</p>
        </div>
        <Badge variant={status === "pending" ? "default" : status === "approved" ? "secondary" : "outline"}>
          {STATUS_LABEL[status]}
        </Badge>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 text-sm">
        <p className="whitespace-pre-wrap break-words">{request.note}</p>
        {status === "approved" && request.expiresAt && (
          <p className="text-muted-foreground">
            Access ends {when(request.expiresAt)} ({timeLeft(request.expiresAt, now)})
          </p>
        )}
        {status === "expired" && request.expiresAt && <p className="text-muted-foreground">Access ended {when(request.expiresAt)}</p>}
        {status === "revoked" && request.revokedAt && <p className="text-muted-foreground">Access ended {when(request.revokedAt)}</p>}
        {request.declineReason && <p className="break-words text-muted-foreground">Reason given: {request.declineReason}</p>}
      </CardContent>
      {(can.accept || can.openEditor) && (
        <CardFooter className="flex flex-wrap gap-2">
          {can.accept && (
            <Button disabled={busy} onClick={() => setDialog("accept")}>
              Accept
            </Button>
          )}
          {can.decline && (
            <Button variant="outline" disabled={busy} onClick={() => setDialog("decline")}>
              Decline
            </Button>
          )}
          {can.openEditor && (
            <Button disabled={busy} onClick={() => void openEditor(request.id)}>
              <ExternalLink />
              Open editor
            </Button>
          )}
          {can.revoke && (
            <Button variant="outline" disabled={busy} onClick={() => setDialog("revoke")}>
              End access
            </Button>
          )}
        </CardFooter>
      )}

      <ConfirmDialog
        open={dialog === "accept" && can.accept}
        title={`Help ${request.coupleName}?`}
        description="Mongkolka admins will be able to edit this couple's site for 7 days. The couple sees what is viewed and changed, and can end access at any time."
        confirmLabel="Accept"
        busy={busy}
        onCancel={close}
        onConfirm={async () => {
          await accept(request.id);
          close();
        }}
      />
      <ConfirmDialog
        open={dialog === "revoke" && can.revoke}
        title={`End access to ${request.coupleName}?`}
        description="Open editors stop working at once. The couple has to ask again if they still need help."
        confirmLabel="End access"
        busy={busy}
        onCancel={close}
        onConfirm={async () => {
          await revoke(request.id);
          close();
        }}
      />
      {dialog === "decline" && can.decline && (
        <DeclineDialog
          coupleName={request.coupleName}
          busy={busy}
          onCancel={close}
          onDecline={async (reason) => {
            // Stays open on failure so the typed reason is not lost.
            if (await decline(request.id, reason)) close();
          }}
        />
      )}
    </Card>
  );
}
