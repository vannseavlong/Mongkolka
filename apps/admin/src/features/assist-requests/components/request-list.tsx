"use client";

import { Alert, AlertDescription, AlertTitle } from "@mongkolka/ui/alert";
import { Button } from "@mongkolka/ui/button";
import { Skeleton } from "@mongkolka/ui/skeleton";
import type { Tab } from "../lib/assist-rules";
import { useAssistRequests, useNow } from "../lib/use-assist-requests";
import { RequestCard } from "./request-card";

export function RequestList({ tab, empty }: { tab: Tab; empty: string }) {
  const now = useNow();
  const { requests, loading, loadingMore, error, forbidden, hasMore, loadMore, refresh } = useAssistRequests(tab, now);

  if (loading) {
    return (
      <div className="flex flex-col gap-3" aria-busy="true" aria-label="Loading requests">
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="h-36 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (forbidden) {
    return (
      <Alert variant="destructive">
        <AlertTitle>You cannot see help requests</AlertTitle>
        <AlertDescription>{error}. Ask another admin to check your account.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Could not load help requests</AlertTitle>
          <AlertDescription>
            <p>{error}</p>
            <Button size="sm" variant="outline" className="mt-2" onClick={() => void refresh()}>
              Try again
            </Button>
          </AlertDescription>
        </Alert>
      )}
      {!error && requests.length === 0 && (
        <p className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">
          {hasMore ? "Nothing here among the newest requests." : empty}
        </p>
      )}
      {requests.map((request) => (
        <RequestCard key={request.id} request={request} now={now} refresh={refresh} />
      ))}
      {hasMore && (
        <Button variant="outline" size="sm" className="self-center" disabled={loadingMore} onClick={loadMore}>
          {loadingMore ? "Loading" : "Load older requests"}
        </Button>
      )}
    </div>
  );
}
