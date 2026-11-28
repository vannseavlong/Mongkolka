"use client";

import { useEffect, useMemo, useState } from "react";
import { mutate as mutateGlobal } from "swr";
import useSWRInfinite from "swr/infinite";
import { api, ApiError } from "@/lib/api";
import { useApiQuery } from "@/lib/use-api-query";
import { assistListPath } from "../data/assist-requests-api";
import { toAssistRequest, type AssistPageDto, type AssistRequest } from "../data/schema";
import { countLabel } from "./assist-rules";
import { toRequestRow, type RequestRow } from "./request-rows";

const PENDING_PATH = assistListPath({ status: "pending" });

/** The sidebar badge. Errors stay silent: the page itself explains them. */
export function usePendingBadge(): string | undefined {
  const { data } = useApiQuery<AssistPageDto>(PENDING_PATH);
  return data ? countLabel(data.requests.length, data.next_cursor !== null) : undefined;
}

/** Re-renders on a timer so an approval that runs out loses its buttons without a reload. */
export function useNow(intervalMs = 30_000): Date {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(timer);
  }, [intervalMs]);
  return now;
}

/** Every status, newest first, one page at a time. */
export function useAssistRequests() {
  const { data, error, isLoading, isValidating, size, setSize, mutate } = useSWRInfinite<AssistPageDto>(
    (index, previous: AssistPageDto | null) => {
      if (previous && !previous.next_cursor) return null;
      return assistListPath({ cursor: index === 0 ? null : previous?.next_cursor });
    },
    (path: string) => api.get<AssistPageDto>(path),
    // The couple can cancel or revoke at any time, so a page that is opened again is read again.
    { revalidateOnMount: true },
  );

  const requests = useMemo(() => (data ?? []).flatMap((page) => page.requests).map(toAssistRequest), [data]);

  return {
    requests,
    loading: isLoading,
    loadingMore: !isLoading && isValidating && (data?.length ?? 0) < size,
    error: error ? (error instanceof ApiError ? error.message : "Something went wrong") : null,
    forbidden: error instanceof ApiError && error.status === 403,
    hasMore: Boolean(data?.at(-1)?.next_cursor),
    loadMore: () => void setSize(size + 1),
    /** After any action: this list and the sidebar count. */
    refresh: () => Promise.all([mutate(), mutateGlobal(PENDING_PATH)]),
  };
}

/**
 * Table rows. The array only changes when a row would look different, because a new array sends the table back to
 * its first page and the clock ticks every 30 seconds.
 */
export function useRequestRows(requests: AssistRequest[], now: Date): RequestRow[] {
  const rows = requests.map((r) => toRequestRow(r, now));
  const key = JSON.stringify(rows);
  // eslint-disable-next-line react-hooks/exhaustive-deps -- `key` is the content of `rows`
  return useMemo(() => rows, [key]);
}
