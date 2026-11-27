"use client";

import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@mongkolka/ui/alert";
import { useIsAssisting } from "@/features/assist/lib/use-assist-session";
import { useDriveConnection } from "../lib/use-drive-connection";

/** Shows only when Google stopped access; renders nothing while loading, on errors, or when fine. */
export function DriveReconnectBanner() {
  const { connection } = useDriveConnection();
  const assisting = useIsAssisting();
  // Reconnecting is the couple's to do.
  if (assisting || connection?.state !== "needs_reconnect") return null;
  return (
    <Alert className="mb-4">
      <AlertTriangle className="size-4" />
      <AlertTitle>Google Drive needs to be reconnected</AlertTitle>
      <AlertDescription>
        New uploads are saved by Mongkolka until you reconnect.{" "}
        <Link href="/settings/storage" className="font-medium underline underline-offset-2">
          Reconnect now
        </Link>
      </AlertDescription>
    </Alert>
  );
}
