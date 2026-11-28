"use client";

import { actionsFor } from "../lib/assist-rules";
import type { RequestRow } from "../lib/request-rows";
import { ConfirmDialog } from "./confirm-dialog";
import { DeclineDialog } from "./decline-dialog";
import { useRequests } from "./requests-provider";

export function RequestsDialogs({ rows }: { rows: RequestRow[] }) {
  const { busy, accept, decline, revoke, dialog, setDialog } = useRequests();
  const request = rows.find((r) => r.id === dialog?.requestId);
  if (!dialog || !request) return null;

  // The request can change under an open dialog; a dialog that no longer applies goes away.
  const can = actionsFor({ status: request.status, expiresAt: request.accessEndsAt }, new Date());
  const close = () => setDialog(null);

  if (dialog.kind === "decline") {
    return can.decline ? (
      <DeclineDialog
        key={request.id}
        coupleName={request.coupleName}
        busy={busy}
        onCancel={close}
        onDecline={async (reason) => {
          // Stays open on failure so the typed reason is not lost.
          if (await decline(request.id, reason)) close();
        }}
      />
    ) : null;
  }

  const accepting = dialog.kind === "accept";
  return (
    <ConfirmDialog
      open={accepting ? can.accept : can.revoke}
      title={accepting ? `Help ${request.coupleName}?` : `End access to ${request.coupleName}?`}
      description={
        accepting
          ? "Mongkolka admins will be able to edit this couple's site for 7 days. The couple sees what is viewed and changed, and can end access at any time."
          : "Open editors stop working at once. The couple has to ask again if they still need help."
      }
      confirmLabel={accepting ? "Accept" : "End access"}
      busy={busy}
      onCancel={close}
      onConfirm={async () => {
        await (accepting ? accept : revoke)(request.id);
        close();
      }}
    />
  );
}
