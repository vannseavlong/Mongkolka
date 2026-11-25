"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { AlertTriangle, CheckCircle2, HardDrive, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@mongkolka/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@mongkolka/ui/alert-dialog";
import { Button } from "@mongkolka/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@mongkolka/ui/card";
import { Skeleton } from "@mongkolka/ui/skeleton";
import { GoogleIcon } from "@/components/google-icon";
import { driveResultMessage } from "../lib/drive-result";
import { useDriveConnection } from "../lib/use-drive-connection";

function useShowResultOnce() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const code = params.get("drive");
  useEffect(() => {
    const message = driveResultMessage(code);
    if (!message) return;
    (message.kind === "success" ? toast.success : toast.error)(message.text);
    router.replace(pathname); // drop ?drive= so a refresh does not repeat the toast
  }, [code, pathname, router]);
}

const WHAT_IS_STORED = (
  <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
    <li>Photos you add to your website and photos your guests share are saved in a “Mongkolka” folder in your Drive.</li>
    <li>Mongkolka can only open files it created there. It cannot see anything else in your Drive.</li>
    <li>You can disconnect at any time.</li>
  </ul>
);

export function DriveConnectCard() {
  useShowResultOnce();
  const d = useDriveConnection();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HardDrive className="size-5" aria-hidden /> Google Drive storage
        </CardTitle>
        <CardDescription>Keep your wedding photos in your own Google Drive.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {d.loading && (
          <div className="space-y-3" aria-busy="true" aria-label="Loading storage settings">
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="h-10 w-48" />
          </div>
        )}

        {!d.loading && d.forbidden && (
          <Alert variant="destructive">
            <AlertTitle>You do not have access to this</AlertTitle>
            <AlertDescription>Ask the person who created the wedding account to manage storage.</AlertDescription>
          </Alert>
        )}

        {!d.loading && !d.forbidden && d.loadError && (
          <Alert variant="destructive">
            <AlertTitle>Could not load storage settings</AlertTitle>
            <AlertDescription className="flex flex-wrap items-center gap-3">
              {d.loadError}
              <Button size="sm" variant="outline" onClick={d.reload}>
                Try again
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {d.connection && !d.connection.available && (
          <p className="text-sm text-muted-foreground">
            Google Drive storage is not available yet. Your files are stored safely by Mongkolka.
          </p>
        )}

        {d.connection?.available && d.connection.state === "not_connected" && (
          <>
            <p className="text-sm">Right now your files are stored by Mongkolka.</p>
            {WHAT_IS_STORED}
            <Button onClick={d.connect} disabled={d.busy !== null} className="w-full sm:w-auto">
              {d.busy === "connect" ? <Loader2 className="size-4 animate-spin" /> : <GoogleIcon className="size-4" />}
              Connect Google Drive
            </Button>
          </>
        )}

        {d.connection?.available && d.connection.state === "active" && (
          <>
            <p className="flex flex-wrap items-center gap-2 text-sm font-medium">
              <CheckCircle2 className="size-4 text-green-600" aria-hidden /> Connected
              {d.connection.email && <span className="break-all font-normal text-muted-foreground">· {d.connection.email}</span>}
            </p>
            <p className="text-sm text-muted-foreground">New uploads are saved in the “Mongkolka” folder of this Drive.</p>
            {WHAT_IS_STORED}
            <DisconnectButton busy={d.busy === "disconnect"} onConfirm={d.disconnect} />
          </>
        )}

        {d.connection?.available && d.connection.state === "needs_reconnect" && (
          <>
            <Alert>
              <AlertTriangle className="size-4" />
              <AlertTitle>Google Drive needs to be reconnected</AlertTitle>
              <AlertDescription>
                Google stopped our access{d.connection.email ? ` to ${d.connection.email}` : ""}. New uploads are being
                saved by Mongkolka instead, so nothing is lost. Photos already in your Drive will not show on your
                website until you reconnect.
              </AlertDescription>
            </Alert>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button onClick={d.connect} disabled={d.busy !== null} className="w-full sm:w-auto">
                {d.busy === "connect" ? <Loader2 className="size-4 animate-spin" /> : <GoogleIcon className="size-4" />}
                Reconnect Google Drive
              </Button>
              <DisconnectButton busy={d.busy === "disconnect"} onConfirm={d.disconnect} />
            </div>
          </>
        )}

        {d.actionError && (
          <Alert variant="destructive">
            <AlertDescription>{d.actionError}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}

function DisconnectButton({ busy, onConfirm }: { busy: boolean; onConfirm: () => void }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" disabled={busy} className="w-full sm:w-auto">
          {busy && <Loader2 className="size-4 animate-spin" />} Disconnect
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Disconnect Google Drive?</AlertDialogTitle>
          <AlertDialogDescription>
            Your files stay in your Drive, but photos that are stored there will stop showing on your website, because
            Mongkolka can no longer open them. Reconnecting the same Google account brings them back. New uploads will
            be saved by Mongkolka.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Keep connected</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Disconnect</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
