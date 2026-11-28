"use client";

import { Alert, AlertDescription, AlertTitle } from "@mongkolka/ui/alert";
import { Button } from "@mongkolka/ui/button";
import { DataTable } from "@mongkolka/ui/data-table";
import { Skeleton } from "@mongkolka/ui/skeleton";
import { STATUS_LABEL } from "../lib/assist-rules";
import { useAssistRequests, useNow, useRequestRows } from "../lib/use-assist-requests";
import { requestsColumns } from "./requests-columns";
import { RequestsDialogs } from "./requests-dialogs";
import { RequestsProvider } from "./requests-provider";

const STATUS_OPTIONS = Object.entries(STATUS_LABEL).map(([value, label]) => ({ value, label }));

export function RequestsTable() {
  const now = useNow();
  const { requests, loading, loadingMore, error, forbidden, hasMore, loadMore, refresh } = useAssistRequests();
  const rows = useRequestRows(requests, now);

  if (loading) {
    return (
      <div className="flex flex-col gap-3" aria-busy="true" aria-label="Loading requests">
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="h-12 w-full" />
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
    <RequestsProvider refresh={refresh}>
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
        {(!error || rows.length > 0) && (
          <DataTable
            columns={requestsColumns}
            data={rows}
            searchKey="coupleName"
            searchPlaceholder="Filter by couple…"
            filters={[{ columnId: "status", title: "Status", options: STATUS_OPTIONS }]}
          />
        )}
        {hasMore && (
          <div className="flex flex-col items-center gap-1">
            <Button variant="outline" size="sm" disabled={loadingMore} onClick={loadMore}>
              {loadingMore ? "Loading" : "Load older requests"}
            </Button>
            <p className="text-sm text-muted-foreground">Search and filters cover the requests loaded so far.</p>
          </div>
        )}
      </div>
      <RequestsDialogs rows={rows} />
    </RequestsProvider>
  );
}
