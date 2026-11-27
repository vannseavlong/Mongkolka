"use client";

import { Button } from "@mongkolka/ui/button";
import type { AssistEndReason } from "@/lib/assist-session";
import { ADMIN_REQUESTS_URL, signInInstead } from "../lib/use-assist-session";

const TEXT: Record<AssistEndReason, { title: string; body: string }> = {
  exited: { title: "You left the help session", body: "To go back in, use Open editor in the admin app." },
  ended: {
    title: "Help access has ended",
    body: "The couple or an admin ended it, or the account changed. Nothing more can be viewed or edited here.",
  },
  expired: { title: "This editor link has expired", body: "Links last up to an hour. Use Open editor in the admin app for a new one." },
  invalid: { title: "This editor link does not work", body: "Use Open editor in the admin app for a new one." },
};

export function AssistEnded({ reason }: { reason: AssistEndReason }) {
  const { title, body } = TEXT[reason] ?? TEXT.ended;
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
      <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      <p role="status" className="max-w-sm text-sm text-muted-foreground">
        {body}
      </p>
      <Button asChild>
        <a href={ADMIN_REQUESTS_URL}>Back to admin</a>
      </Button>
      <Button variant="link" size="sm" onClick={signInInstead}>
        Sign in with a couple account instead
      </Button>
    </main>
  );
}
