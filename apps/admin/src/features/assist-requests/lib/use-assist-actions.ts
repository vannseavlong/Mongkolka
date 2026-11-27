"use client";

import { useState } from "react";
import { toast } from "sonner";
import { ApiError } from "@/lib/api";
import { acceptRequest, declineRequest, openEditorSession, revokeRequest } from "../data/assist-requests-api";
import { openInNewTab } from "./open-editor";

const message = (error: unknown, fallback: string) => (error instanceof ApiError ? error.message : fallback);

/** The four admin actions, with one in flight at a time per card. Resolves true when it worked. */
export function useAssistActions(refresh: () => Promise<unknown>) {
  const [busy, setBusy] = useState(false);

  async function run(work: () => Promise<unknown>, done: string, failed: string): Promise<boolean> {
    setBusy(true);
    try {
      await work();
      toast.success(done);
      return true;
    } catch (error) {
      toast.error(message(error, failed));
      return false;
    } finally {
      // Also after a failure: a conflict means the request changed under us.
      await refresh().catch(() => undefined);
      setBusy(false);
    }
  }

  return {
    busy,
    accept: (id: string) => run(() => acceptRequest(id), "Request accepted. Access lasts 7 days.", "Could not accept"),
    decline: (id: string, reason: string) => run(() => declineRequest(id, reason.trim()), "Request declined", "Could not decline"),
    revoke: (id: string) => run(() => revokeRequest(id), "Access ended", "Could not end access"),
    async openEditor(id: string) {
      setBusy(true);
      try {
        const outcome = await openInNewTab(
          () => window.open("", "_blank"),
          async () => (await openEditorSession(id)).editor_url,
        );
        if (outcome === "blocked") toast.error("Your browser blocked the new tab. Allow pop-ups for this site and try again.");
        if (outcome === "unsafe") toast.error("The editor link looked wrong, so it was not opened.");
      } catch (error) {
        toast.error(message(error, "Could not open the editor"));
        await refresh().catch(() => undefined);
      } finally {
        setBusy(false);
      }
    },
  };
}
