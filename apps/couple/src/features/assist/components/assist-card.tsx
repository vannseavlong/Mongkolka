"use client";

import { useState } from "react";
import { HandHelping, Loader2 } from "lucide-react";
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
import { Badge } from "@mongkolka/ui/badge";
import { Button } from "@mongkolka/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@mongkolka/ui/card";
import { Skeleton } from "@mongkolka/ui/skeleton";
import { canAsk, type AssistView } from "../lib/assist-state";
import { useAssist } from "../lib/use-assist";
import { useIsAssisting } from "../lib/use-assist-session";
import { AskDialog } from "./ask-dialog";
import { AssistActivityList } from "./assist-activity";

const day = new Intl.DateTimeFormat(undefined, { dateStyle: "long" });

export function AssistCard() {
  const a = useAssist();
  const assisting = useIsAssisting();
  const [asking, setAsking] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HandHelping className="size-5" aria-hidden /> Help from Mongkolka
        </CardTitle>
        <CardDescription>Stuck, or short on time? Our team can set up your site with you.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {a.loading && (
          <div className="space-y-3" aria-busy="true" aria-label="Loading help status">
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="h-9 w-40" />
          </div>
        )}

        {!a.loading && a.forbidden && (
          <Alert variant="destructive">
            <AlertTitle>You do not have access to this</AlertTitle>
            <AlertDescription>Ask the person who created the wedding account.</AlertDescription>
          </Alert>
        )}

        {!a.loading && !a.forbidden && a.loadError && (
          <Alert variant="destructive">
            <AlertTitle>Could not load this</AlertTitle>
            <AlertDescription className="flex flex-wrap items-center gap-3">
              {a.loadError}
              <Button size="sm" variant="outline" onClick={() => void a.reload()}>
                Try again
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {!a.loading && !a.loadError && (
          <>
            <div aria-live="polite">
              <Status view={a.view} />
            </div>
            {/* Asking, cancelling and ending help are the couple's own decisions. */}
            {assisting ? (
              <p className="text-sm text-muted-foreground">Only the couple can ask for help or end it.</p>
            ) : (
              <div className="flex flex-col gap-2 sm:flex-row">
                {canAsk(a.view) && (
                  <Button
                    onClick={() => {
                      a.clearActionError(); // an old failure from cancel or revoke must not show inside the new dialog
                      setAsking(true);
                    }}
                    className="w-full sm:w-auto"
                  >
                    Ask Mongkolka to help
                  </Button>
                )}
                {a.view.kind === "pending" && (
                  <Button variant="outline" disabled={a.busy !== null} onClick={() => void a.cancel()} className="w-full sm:w-auto">
                    {a.busy === "cancel" && <Loader2 className="size-4 animate-spin" aria-hidden />} Cancel request
                  </Button>
                )}
                {a.view.kind === "approved" && <RevokeButton busy={a.busy === "revoke"} onConfirm={() => void a.revoke()} />}
              </div>
            )}
            {a.actionError && a.busy === null && !asking && (
              <p role="alert" className="text-sm text-destructive">
                {a.actionError}
              </p>
            )}
            <AssistActivityList activity={a.activity} />
          </>
        )}
      </CardContent>
      <AskDialog
        open={asking}
        onOpenChange={(open) => {
          if (!open && a.busy === "ask") return; // the request is on its way; closing now would hide its result
          setAsking(open);
          if (!open) a.clearActionError();
        }}
        busy={a.busy === "ask"}
        error={asking ? a.actionError : null}
        onSubmit={a.ask}
      />
    </Card>
  );
}

function Status({ view }: { view: AssistView }) {
  switch (view.kind) {
    case "none":
      return <p className="text-sm text-muted-foreground">Send us a note about what you need. If we accept, we can edit your site for you for 7 days.</p>;
    case "pending":
      return (
        <div className="space-y-1">
          <Badge variant="secondary">Waiting for Mongkolka</Badge>
          <p className="text-sm text-muted-foreground [overflow-wrap:anywhere]">Your note: “{view.request.note}”</p>
        </div>
      );
    case "approved":
      return (
        <div className="space-y-1">
          <Badge>Mongkolka is helping you</Badge>
          <p className="text-sm">
            Our team can edit your site until {day.format(view.until)} ({view.left} left). You can end this any time.
          </p>
        </div>
      );
    case "declined":
      return (
        <div className="space-y-1">
          <Badge variant="outline">Request declined</Badge>
          <p className="text-sm text-muted-foreground">{view.reason ? `Reason: ${view.reason}` : "We could not take this one on."}</p>
          <p className="text-sm text-muted-foreground">You can send a new request.</p>
        </div>
      );
    case "ended":
      return (
        <div className="space-y-1">
          <Badge variant="outline">{ENDED[view.why]}</Badge>
          <p className="text-sm text-muted-foreground">Mongkolka can no longer edit your site. You can send a new request if you need more help.</p>
        </div>
      );
  }
}

const ENDED = { expired: "Help period ended", revoked: "You ended the help", cancelled: "Request cancelled" } as const;

function RevokeButton({ busy, onConfirm }: { busy: boolean; onConfirm: () => void }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" disabled={busy} className="w-full sm:w-auto">
          {busy && <Loader2 className="size-4 animate-spin" aria-hidden />} End help now
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>End Mongkolka’s access?</AlertDialogTitle>
          <AlertDialogDescription>
            Our team will lose access to your site at once. Anything they already changed stays as it is. You can ask again later.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Keep helping</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>End help now</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
