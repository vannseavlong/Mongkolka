"use client";

import { useCallback, useState } from "react";
import useSWR from "swr";
import { ApiError } from "@/lib/api";
import { disconnectDrive, DRIVE_KEY, fetchDriveConnection, startDriveConnect } from "../data/drive-api";

/** Logic layer: loads the connection and runs connect/disconnect. No markup here. */
export function useDriveConnection() {
  const { data, error, isLoading, mutate } = useSWR(DRIVE_KEY, fetchDriveConnection);
  const [busy, setBusy] = useState<"connect" | "disconnect" | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const connect = useCallback(async () => {
    setBusy("connect");
    setActionError(null);
    try {
      window.location.assign(await startDriveConnect());
    } catch (err) {
      setActionError(err instanceof ApiError ? err.message : "Could not start the connection.");
      setBusy(null);
    }
  }, []);

  const disconnect = useCallback(async () => {
    setBusy("disconnect");
    setActionError(null);
    try {
      await disconnectDrive();
      await mutate();
    } catch (err) {
      setActionError(err instanceof ApiError ? err.message : "Could not disconnect.");
    } finally {
      setBusy(null);
    }
  }, [mutate]);

  return {
    connection: data ?? null,
    loading: isLoading,
    loadError: error ? (error instanceof ApiError ? error.message : "Something went wrong") : null,
    forbidden: error instanceof ApiError && error.status === 403,
    busy,
    actionError,
    connect,
    disconnect,
    reload: () => mutate(),
  };
}
