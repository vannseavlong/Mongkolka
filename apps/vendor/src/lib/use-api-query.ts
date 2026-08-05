"use client";

import useSWR from "swr";
import { api, ApiError } from "./api";

// `path: null` disables the fetch entirely (SWR's own convention for a
// conditional key) — used to defer a query until its prerequisites are ready.
export function useApiQuery<T>(path: string | null) {
  const { data, error, isLoading, mutate } = useSWR<T>(path, (p: string) => api.get<T>(p));

  return {
    data: data ?? null,
    loading: isLoading,
    error: error ? (error instanceof ApiError ? error.message : "Something went wrong") : null,
    refetch: () => mutate(),
  };
}
