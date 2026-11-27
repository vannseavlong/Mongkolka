"use client";

import { useEffect, useState } from "react";
import { mutate as mutateGlobal } from "swr";
import useSWRInfinite from "swr/infinite";
import { api, ApiError } from "@/lib/api";
import { useApiQuery } from "@/lib/use-api-query";
import { assistListPath } from "../data/assist-requests-api";
import { toAssistRequest, type AssistPageDto } from "../data/schema";
import { apiStatusFor, countLabel, inTab, type Tab } from "./assist-rules";

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

export function useAssistRequests(tab: Tab, now: Date) {
  const { data, error, isLoading, isValidating, size, setSize, mutate } = useSWRInfinite<AssistPageDto>(
    (index, previous: AssistPageDto | null) => {
      if (previous && !previous.next_cursor) return null;
      return assistListPath({ status: apiStatusFor(tab), cursor: index === 0 ? null : previous?.next_cursor });
    },
    (path: string) => api.get<AssistPageDto>(path),
    // The couple can cancel or revoke at any time, so a tab that is opened again is read again.
    { revalidateOnMount: true },
  );

  const pages = data ?? [];
  const requests = pages
    .flatMap((page) => page.requests)
    .map(toAssistRequest)
    .filter((r) => inTab(r, tab, now));

  return {
    requests,
    loading: isLoading,
    loadingMore: !isLoading && isValidating && pages.length < size,
    error: error ? (error instanceof ApiError ? error.message : "Something went wrong") : null,
    forbidden: error instanceof ApiError && error.status === 403,
    hasMore: Boolean(pages.at(-1)?.next_cursor),
    loadMore: () => void setSize(size + 1),
    /** After any action: this list and the sidebar count. */
    refresh: () => Promise.all([mutate(), mutateGlobal(PENDING_PATH)]),
  };
}
