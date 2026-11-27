"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import useSWR from "swr";
import { ApiError } from "@/lib/api";
import { ASSIST_KEY, cancelAssist, createAssist, fetchAssist, revokeAssist } from "../data/assist-api";
import { assistView } from "./assist-state";

const MINUTE = 60_000;

/** The clock, refreshed each minute, so "6 days left" and an expiry that passes while the page is open stay true. */
function useNow() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), MINUTE);
    return () => clearInterval(id);
  }, []);
  return now;
}

const messageOf = (err: unknown, fallback: string) => (err instanceof ApiError ? err.message : fallback);

/** Asking and cancelling are for the partners; the API answers 403 to anyone else on the account. */
const PARTNER_ONLY = "Only the partners on this account can do this.";
const messageFor = (kind: "ask" | "cancel" | "revoke", err: unknown, fallback: string) =>
  kind !== "revoke" && err instanceof ApiError && err.status === 403 ? PARTNER_ONLY : messageOf(err, fallback);

type Busy = "ask" | "cancel" | "revoke" | null;

/** Logic layer: loads the help request and runs ask, cancel and revoke. No markup here. */
export function useAssist() {
  // Read again each time the card is shown: an admin may have answered or looked around since. The dashboard's
  // defaults would keep showing the first answer until a full reload.
  const { data, error, isLoading, mutate } = useSWR(ASSIST_KEY, fetchAssist, { revalidateOnMount: true });
  const now = useNow();
  const [busy, setBusy] = useState<Busy>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  // State is read after render, so two quick calls could both pass a `busy` check; a ref closes that gap.
  const inFlight = useRef(false);

  const run = useCallback(
    async (kind: Exclude<Busy, null>, action: () => Promise<unknown>, fallback: string) => {
      if (inFlight.current) return false;
      inFlight.current = true;
      setBusy(kind);
      setActionError(null);
      try {
        await action();
        await mutate(); // the list and activity come from the server, so reload instead of patching
        return true;
      } catch (err) {
        // A 409 or 404 means the request changed behind the couple's back (an admin accepted or declined it):
        // show the real state next to the message, not the stale one.
        await mutate();
        setActionError(messageFor(kind, err, fallback));
        return false;
      } finally {
        inFlight.current = false;
        setBusy(null);
      }
    },
    [mutate],
  );

  const view = assistView(data ?? null, now);
  const requestId = "request" in view ? view.request.id : null;

  return {
    view,
    activity: data?.activity ?? [],
    loading: isLoading,
    loadError: error ? messageOf(error, "Something went wrong") : null,
    forbidden: error instanceof ApiError && error.status === 403,
    busy,
    actionError,
    clearActionError: () => setActionError(null),
    reload: () => mutate(),
    ask: (note: string) => run("ask", () => createAssist(note), "Could not send your request."),
    cancel: () => (requestId ? run("cancel", () => cancelAssist(requestId), "Could not cancel the request.") : Promise.resolve(false)),
    revoke: () => (requestId ? run("revoke", () => revokeAssist(requestId), "Could not end the access.") : Promise.resolve(false)),
  };
}
