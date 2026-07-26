"use client";

import useSWR from "swr";
import { api, ApiError } from "./api";

export function useApiQuery<T>(path: string) {
  const { data, error, isLoading, mutate } = useSWR<T>(path, (p: string) => api.get<T>(p));

  return {
    data: data ?? null,
    loading: isLoading,
    error: error ? (error instanceof ApiError ? error.message : "Something went wrong") : null,
    refetch: () => mutate(),
  };
}
